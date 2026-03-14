"""
API views for the Caption Generator backend.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from .serializers import UserProfileSerializer


class UserProfileView(APIView):
    """
    GET /api/v1/auth/user/
    Returns the authenticated Supabase user's profile info.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class HealthCheckView(APIView):
    """
    GET /api/v1/health/
    Public endpoint to verify the API is running.
    """

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {"status": "ok", "message": "Caption Generator API is running"},
            status=status.HTTP_200_OK,
        )
