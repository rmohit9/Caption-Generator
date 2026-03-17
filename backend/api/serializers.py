from django.contrib.auth.models import User
from rest_framework import serializers
from email_validator import validate_email, EmailNotValidError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Workspace, BatchProfile, Campaign

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add the full name to the response payload. 
        # (We saved the 'name' from the React form into 'first_name' during registration)
        data['full_name'] = self.user.first_name
        
        return data

class UserSerializer(serializers.ModelSerializer):
    name = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True}
        }

    # DRF automatically calls validate_<fieldname> if it exists
    def validate_email(self, value):
        try:
            # Check that the email address is valid. Turn on check_deliverability 
            # for DNS lookups (it checks if the domain actually has MX records).
            email_info = validate_email(value, check_deliverability=True)
            
            # Get the normalized email (e.g., lowercases the domain)
            normalized_email = email_info.normalized

            # Check if this email is already registered in our database
            if User.objects.filter(email=normalized_email).exists():
                raise serializers.ValidationError("An account with this email already exists.")

            return normalized_email

        except EmailNotValidError as e:
            # This catches invalid formats, disposable emails (if configured), or dead domains
            # and returns the specific human-readable error from the library
            raise serializers.ValidationError(str(e))

    def create(self, validated_data):
        name = validated_data.pop('name')
        email = validated_data.get('email')
        
        # Django requires a unique username, so we map the email to the username
        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=name
        )
        return user

class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ('id', 'name', 'created_at')
        read_only_fields = ('id', 'created_at')

    def create(self, validated_data):
        # Automatically assign the logged-in user to the workspace
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class BatchProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BatchProfile
        fields = ('id', 'workspace', 'name', 'brand', 'audience', 'tone', 'created_at')
        read_only_fields = ('id', 'workspace', 'created_at')

class CampaignSerializer(serializers.ModelSerializer):
    profile_name = serializers.CharField(source='batch_profile.name', read_only=True)

    class Meta:
        model = Campaign
        fields = ('id', 'workspace', 'batch_profile', 'profile_name', 'name', 'product', 'details', 'hashtag_count', 'language', 'platforms', 'results', 'created_at')
        read_only_fields = ('id', 'workspace', 'results', 'created_at', 'profile_name')

from .models import CaptionHistory

class CaptionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CaptionHistory
        fields = [
            'id',
            'platform',
            'caption_type',
            'topic',
            'caption',
            'hashtags',
            'created_at',
        ]

