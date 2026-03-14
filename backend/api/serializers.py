"""
Serializers for the API app.
"""

from rest_framework import serializers


class UserProfileSerializer(serializers.Serializer):
    """Serializes the authenticated Supabase user info."""

    id = serializers.CharField()
    email = serializers.EmailField()
    role = serializers.CharField()
    user_metadata = serializers.DictField()
