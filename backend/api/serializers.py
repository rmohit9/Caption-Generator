from django.contrib.auth.models import User
from rest_framework import serializers
from email_validator import validate_email, EmailNotValidError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

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