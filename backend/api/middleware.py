import uuid


class GuestIdentityMiddleware:
    """
    Attach a guest identifier for unauthenticated users.
    Priority: X-Guest-Token header -> guest_token cookie -> new token.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = request.headers.get("X-Guest-Token") or request.COOKIES.get("guest_token")
        if token:
            request.guest_token = token
            request.guest_token_source = "token"
            request.guest_new_token = None
        else:
            request.guest_token = str(uuid.uuid4())
            request.guest_token_source = "token"
            request.guest_new_token = request.guest_token
        return self.get_response(request)
