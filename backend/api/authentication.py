
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class SupabaseUser:
    """
    A lightweight user object representing a Supabase-authenticated user.
    This avoids the need for a Django User model tied to Supabase.
    """

    def __init__(self, payload):
        self.id = payload.get("sub")
        self.email = payload.get("email", "")
        self.role = payload.get("role", "")
        self.user_metadata = payload.get("user_metadata", {})
        self.is_authenticated = True

    def __str__(self):
        return self.email or self.id


class SupabaseAuthentication(BaseAuthentication):
    """
    DRF Authentication class that validates Supabase-issued JWTs.

    Expects the header:
        Authorization: Bearer <supabase-access-token>
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None  # No auth header → allow other auth backends or AnonymousUser

        parts = auth_header.split()

        if len(parts) != 2 or parts[0].lower() != "bearer":
            return None

        token = parts[1]

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated",
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired.")
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f"Invalid token: {str(e)}")

        user = SupabaseUser(payload)
        return (user, token)
