import hashlib
import logging
import random

from django.conf import settings
from django.shortcuts import get_object_or_404

from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate

from .models import GuestUsage, Workspace, BatchProfile, CaptionHistory, Campaign, PasswordResetOTP, SystemConfig
from .services.model_router import generate_caption_and_hashtags
from .services.email_service import send_otp_email
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, WorkspaceSerializer, BatchProfileSerializer, CaptionHistorySerializer, CampaignSerializer



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
    
    # We now accept 'platforms' (list) for new chats, or 'platform' (string) for refine
    platforms = data.get("platforms", [])
    single_platform = data.get("platform") 
    
    caption_type = data.get("caption_type")
    topic = data.get("topic")
    language = data.get("language")
    raw_hashtag_count = data.get("hashtag_count")
    history_id = data.get("history_id")
    
    hashtag_count = None
    if raw_hashtag_count not in (None, "", []):
        try:
            hashtag_count = int(raw_hashtag_count)
        except (TypeError, ValueError):
            hashtag_count = None

    if not caption_type or not topic:
        return Response({"error": "caption_type and topic are required."}, status=status.HTTP_400_BAD_REQUEST)

    guest_hash = None
    if not request.user.is_authenticated:
        guest_raw = getattr(request, "guest_token", None) or request.META.get("REMOTE_ADDR", "")
        guest_hash = _hash_guest_id(guest_raw)
        if not history_id and GuestUsage.objects.filter(identifier_hash=guest_hash).exists():
            return Response({"error": "Free generation limit reached. Please login."}, status=status.HTTP_403_FORBIDDEN)

    # --- CASE A: REFINEMENT (Update existing chat session) ---
    if history_id and single_platform:
        normalized_platform = single_platform.strip().lower()
        try:
            caption, hashtags = generate_caption_and_hashtags(
                normalized_platform, str(caption_type).strip(), str(topic).strip(),
                str(language).strip() if language else None, hashtag_count
            )
            
            if request.user.is_authenticated:
                history_record = CaptionHistory.objects.get(id=history_id, user=request.user)
            else:
                history_record = CaptionHistory.objects.get(id=history_id, guest_identifier_hash=guest_hash)
                
            # Update results dict with the new refined text
            results = history_record.results or {}
            results[normalized_platform] = {"caption": caption, "hashtags": hashtags}
            history_record.results = results
            history_record.topic = str(topic).strip() # Update topic for sidebar context
            history_record.save()
            
            return Response({"id": history_record.id, "results": history_record.results}, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.exception("Refinement failed")
            return Response({"error": "Generation failed."}, status=status.HTTP_502_BAD_GATEWAY)

    # --- CASE B: NEW CHAT SESSION (Generate all selected platforms) ---
    if not platforms or not isinstance(platforms, list):
        return Response({"error": "platforms list is required."}, status=status.HTTP_400_BAD_REQUEST)

    results = {}
    for plat in platforms:
        norm_plat = plat.strip().lower()
        try:
            cap, tags = generate_caption_and_hashtags(
                norm_plat, str(caption_type).strip(), str(topic).strip(),
                str(language).strip() if language else None, hashtag_count
            )
            results[norm_plat] = {"caption": cap, "hashtags": tags}
        except Exception as e:
            logger.exception(f"Generation failed for {norm_plat}")
            results[norm_plat] = {"caption": f"Error: {str(e)}", "hashtags": []}

    if not request.user.is_authenticated:
        GuestUsage.objects.get_or_create(identifier_hash=guest_hash, defaults={"source": getattr(request, "guest_token_source", "ip")})

    history_record = CaptionHistory.objects.create(
        user=request.user if request.user.is_authenticated else None,
        guest_identifier_hash=guest_hash,
        platforms=platforms,
        caption_type=str(caption_type).strip(),
        topic=str(topic).strip(),
        results=results,
    )

    response = Response({"id": history_record.id, "results": results}, status=status.HTTP_200_OK)
    
    if not request.user.is_authenticated and getattr(request, "guest_new_token", None):
        response.set_cookie("guest_token", request.guest_new_token, max_age=60*60*24*365, httponly=True, samesite="Lax")

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


@api_view(["DELETE", "PATCH"])
@permission_classes([AllowAny])
def manage_caption_history(request, history_id):
    try:
        if request.user.is_authenticated:
            caption = CaptionHistory.objects.get(id=history_id, user=request.user)
        else:
            guest_raw = getattr(request, "guest_token", None) or request.META.get("REMOTE_ADDR", "")
            guest_hash = _hash_guest_id(guest_raw)
            caption = CaptionHistory.objects.get(id=history_id, guest_identifier_hash=guest_hash)
        
        if request.method == "DELETE":
            caption.delete()
            return Response({"message": "Caption deleted successfully"}, status=status.HTTP_200_OK)
            
        elif request.method == "PATCH":
            topic = request.data.get("topic")
            is_pinned = request.data.get("is_pinned")
            
            if topic is not None:
                caption.topic = topic
            if is_pinned is not None:
                caption.is_pinned = is_pinned
                
            caption.save()
            return Response({"message": "Caption updated successfully"}, status=status.HTTP_200_OK)

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

class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        full_name = request.data.get("full_name")
        
        if not full_name or not str(full_name).strip():
            return Response({"error": "Name cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
            
        user.first_name = str(full_name).strip()
        user.save()
        
        return Response({
            "message": "Profile updated successfully.", 
            "full_name": user.first_name
        }, status=status.HTTP_200_OK)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        
        if not hasattr(user, 'check_password'):
            # This should never happen if user model is correct, but safe check
            return Response({"error": "User missing password details."}, status=status.HTTP_400_BAD_REQUEST)
            
        if not old_password or not new_password:
            return Response({"error": "Both old and new passwords are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        if not user.check_password(old_password):
            return Response({"error": "Incorrect current password."}, status=status.HTTP_400_BAD_REQUEST)
            
        if len(new_password) < 8:
            return Response({"error": "New password must be at least 8 characters long."}, status=status.HTTP_400_BAD_REQUEST)
            
        user.set_password(new_password)
        user.save()
        
        return Response({"message": "Password updated successfully."}, status=status.HTTP_200_OK)

class WorkspaceListCreateView(generics.ListCreateAPIView):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return workspaces belonging to the logged-in user
        return Workspace.objects.filter(user=self.request.user).order_by('-created_at')

class WorkspaceDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Ensure a user can only edit/delete their own workspaces
        return Workspace.objects.filter(user=self.request.user)

class BatchProfileListCreateView(generics.ListCreateAPIView):
    serializer_class = BatchProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return profiles for the specific workspace, and ensure the user owns that workspace
        workspace_id = self.kwargs.get('workspace_id')
        return BatchProfile.objects.filter(workspace__id=workspace_id, workspace__user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically attach the profile to the correct workspace
        workspace_id = self.kwargs.get('workspace_id')
        workspace = get_object_or_404(Workspace, id=workspace_id, user=self.request.user)
        serializer.save(workspace=workspace)

class BatchProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BatchProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return BatchProfile.objects.filter(workspace__user=self.request.user)

class CampaignListCreateView(generics.ListCreateAPIView):
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        workspace_id = self.kwargs.get('workspace_id')
        return Campaign.objects.filter(workspace__id=workspace_id, workspace__user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        workspace_id = self.kwargs.get('workspace_id')
        workspace = get_object_or_404(Workspace, id=workspace_id, user=self.request.user)
        
        profile = serializer.validated_data['batch_profile']
        platforms = serializer.validated_data.get('platforms', [])
        product = serializer.validated_data.get('product', '')
        details = serializer.validated_data.get('details', '')
        
        # Extract language and hashtag_count from the validated data
        language = serializer.validated_data.get('language', 'English')
        hashtag_count = serializer.validated_data.get('hashtag_count')
        
        results = {}
        for platform in platforms:
            try:
                # Convert the tone array into a comma-separated string
                tones_str = ', '.join(profile.tone) if isinstance(profile.tone, list) else str(profile.tone)
                
                topic = f"Product: {product}. Details: {details}. Brand Name: {profile.brand}. Target Audience: {profile.audience}"
                
                # Pass tone, language, and hashtag_count to the AI
                caption, hashtags = generate_caption_and_hashtags(
                    platform.lower(), 
                    tones_str,
                    topic,
                    language,
                    hashtag_count
                )
                results[platform.lower()] = {
                    "caption": caption,
                    "hashtags": hashtags
                }
            except Exception as e:
                logger.exception(f"Failed to generate for {platform}: {e}")
                results[platform.lower()] = {
                    "caption": f"Error generating caption: {str(e)}",
                    "hashtags": []
                }
                
        serializer.save(workspace=workspace, results=results)

class CampaignDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CampaignSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Campaign.objects.filter(workspace__user=self.request.user)


class RequestOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response({"error": "No account found with this email."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Optional: delete existing OTPs for user
        PasswordResetOTP.objects.filter(user=user).delete()
        
        # Generate 6 digit OTP
        otp = f"{random.randint(100000, 999999)}"
        
        # Save OTP
        PasswordResetOTP.objects.create(user=user, otp=otp)
        
        # Send email
        success = send_otp_email(user.email, otp)
        if success:
            return Response({"message": "Verification code sent to your email!"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to send email. Try again later."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        
        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email__iexact=email)
            otp_record = PasswordResetOTP.objects.get(user=user, otp=otp)
            
            if not otp_record.is_valid():
                return Response({"error": "Code has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
                
            return Response({"message": "Code verified successfully!"}, status=status.HTTP_200_OK)
            
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"error": "Invalid code or email."}, status=status.HTTP_400_BAD_REQUEST)

class ConfirmPasswordResetView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        new_password = request.data.get("new_password")
        
        if not all([email, otp, new_password]):
            return Response({"error": "Email, OTP, and new password are required."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email__iexact=email)
            otp_record = PasswordResetOTP.objects.get(user=user, otp=otp)
            
            if not otp_record.is_valid():
                return Response({"error": "Code has expired. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)
                
            # Set new password
            user.set_password(new_password)
            user.save()
            
            # Delete OTP so it cannot be reused
            otp_record.delete()
            
            return Response({"message": "Password reset successfully! You can now log in."}, status=status.HTTP_200_OK)
            
        except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
            return Response({"error": "Invalid code or email."}, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        admin_key = request.data.get('admin_access_key')

        # 1. Verify the secret .env key first
        if admin_key != getattr(settings, 'ADMIN_ACCESS_KEY', ''):
            return Response({"error": "Invalid Admin Access Key. Intrusion logged."}, status=403)

        # 2. Verify user credentials
        user = authenticate(username=email, password=password)
        if user:
            # Promote to staff if they aren't already, so they pass IsAdminUser checks
            if not user.is_staff:
                user.is_staff = True
                user.save()

            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'full_name': getattr(user, 'first_name', user.username),
                'is_admin': True
            })
            
        return Response({"error": "Invalid email or password"}, status=401)


class SystemConfigView(APIView):
    permission_classes = [IsAdminUser] # Only staff can access this

    def get(self, request):
        config = SystemConfig.get_solo()
        # Compute dynamic exhaustion on the fly
        is_exhausted = config.is_exhausted or (config.token_limit > 0 and config.tokens_used >= config.token_limit)
        
        # Mask the API key for security (only show last 4 chars)
        masked_key = f"••••••••••••••••{config.gemini_api_key[-4:]}" if config.gemini_api_key else ""
        
        return Response({
            "gemini_api_key": masked_key,
            "token_limit": config.token_limit,
            "tokens_used": config.tokens_used,
            "is_exhausted": is_exhausted
        })

    def post(self, request):
        config = SystemConfig.get_solo()
        new_key = request.data.get('gemini_api_key')
        
        # If they sent a new key (not the masked one), update it and reset usage
        if new_key and not new_key.startswith('••••'):
            config.gemini_api_key = new_key
            config.tokens_used = 0 
            config.is_exhausted = False

        config.token_limit = request.data.get('token_limit', config.token_limit)
        
        # Recalculate exhaustion if they lower the limit below their usage
        if config.token_limit > 0 and config.tokens_used >= config.token_limit:
            config.is_exhausted = True
        elif config.token_limit <= 0 or config.tokens_used < config.token_limit:
            config.is_exhausted = False
            
        config.save()
        return Response({"message": "System Configuration updated successfully!"})

