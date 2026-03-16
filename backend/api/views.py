import hashlib
import logging

from django.conf import settings
from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User

from .models import GuestUsage, CaptionHistory
from .services.model_router import generate_caption_and_hashtags
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, CaptionHistorySerializer


ALLOWED_PLATFORMS = {
    "instagram",
    "linkedin",
    "twitter",
    "x",
    "facebook",
    "youtube",
    "tiktok",
}

logger = logging.getLogger(__name__)


def _hash_guest_id(raw: str) -> str:
    secret = settings.SECRET_KEY or "guest"
    return hashlib.sha256(f"{secret}:{raw}".encode("utf-8")).hexdigest()


@api_view(["POST"])
@permission_classes([AllowAny])
def generate_caption(request):
    data = request.data or {}
    platform = data.get("platform")
    caption_type = data.get("caption_type")
    topic = data.get("topic")

    if not platform or not caption_type or not topic:
        return Response(
            {"error": "platform, caption_type, and topic are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if isinstance(platform, (list, tuple)):
        if len(platform) != 1:
            if not request.user.is_authenticated:
                return Response(
                    {
                        "error": "Guest users can generate captions for only one platform. Please login for multi-platform support."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {"error": "Only one platform per request is supported."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        platform = platform[0]

    if not isinstance(platform, str):
        return Response(
            {"error": "Invalid platform input."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    normalized_platform = platform.strip().lower()
    if normalized_platform not in ALLOWED_PLATFORMS:
        return Response(
            {"error": "Invalid platform input."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if not request.user.is_authenticated:
        guest_raw = getattr(request, "guest_token", None) or request.META.get("REMOTE_ADDR", "")
        guest_hash = _hash_guest_id(guest_raw)
        if GuestUsage.objects.filter(identifier_hash=guest_hash).exists():
            return Response(
                {"error": "Free generation limit reached. Please login to continue."},
                status=status.HTTP_403_FORBIDDEN,
            )

    try:
        caption, hashtags = generate_caption_and_hashtags(
            normalized_platform, str(caption_type).strip(), str(topic).strip()
        )
    except Exception:
        logger.exception("Gemini generation failed")
        return Response(
            {"error": "Gemini API failure."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    if not caption:
        return Response(
            {"error": "Gemini API failure."},
            status=status.HTTP_502_BAD_GATEWAY,
        )

    if not request.user.is_authenticated:
        guest_raw = getattr(request, "guest_token", None) or request.META.get("REMOTE_ADDR", "")
        guest_hash = _hash_guest_id(guest_raw)
        GuestUsage.objects.get_or_create(
            identifier_hash=guest_hash,
            defaults={"source": getattr(request, "guest_token_source", "ip")},
        )

    # Save generation history for analytics and display
    guest_identifier_hash = None
    if not request.user.is_authenticated:
        guest_raw = getattr(request, "guest_token", None) or request.META.get("REMOTE_ADDR", "")
        guest_identifier_hash = _hash_guest_id(guest_raw)

    CaptionHistory.objects.create(
        user=request.user if request.user.is_authenticated else None,
        guest_identifier_hash=guest_identifier_hash,
        platform=normalized_platform,
        caption_type=str(caption_type).strip(),
        topic=str(topic).strip(),
        caption=caption,
        hashtags=hashtags,
    )

    response = Response(
        {"caption": caption, "hashtags": hashtags},
        status=status.HTTP_200_OK,
    )

    if not request.user.is_authenticated and getattr(request, "guest_new_token", None):
        response.set_cookie(
            "guest_token",
            request.guest_new_token,
            max_age=60 * 60 * 24 * 365,
            httponly=True,
            samesite="Lax",
        )

    return response


@api_view(["GET"])
@permission_classes([AllowAny])
def caption_history(request):
    # Return recent history for authenticated user or guest token
    if request.user.is_authenticated:
        history = CaptionHistory.objects.filter(user=request.user)
    else:
        guest_raw = getattr(request, "guest_token", None) or request.META.get("REMOTE_ADDR", "")
        guest_hash = _hash_guest_id(guest_raw)
        history = CaptionHistory.objects.filter(guest_identifier_hash=guest_hash)

    history = history.order_by("-created_at")[:20]
    serializer = CaptionHistorySerializer(history, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["DELETE"])
@permission_classes([AllowAny])
def delete_caption_history(request, history_id):
    # Delete a specific caption from history
    try:
        if request.user.is_authenticated:
            caption = CaptionHistory.objects.get(id=history_id, user=request.user)
        else:
            guest_raw = getattr(request, "guest_token", None) or request.META.get("REMOTE_ADDR", "")
            guest_hash = _hash_guest_id(guest_raw)
            caption = CaptionHistory.objects.get(id=history_id, guest_identifier_hash=guest_hash)
        
        caption.delete()
        return Response({"message": "Caption deleted successfully"}, status=status.HTTP_200_OK)
    except CaptionHistory.DoesNotExist:
        return Response({"error": "Caption not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": "Invalid token or token already blacklisted."}, status=status.HTTP_400_BAD_REQUEST)