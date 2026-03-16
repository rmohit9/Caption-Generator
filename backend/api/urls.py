from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    generate_caption,
    caption_history,
    delete_caption_history,
    RegisterView,
    LogoutView,
    CustomTokenObtainPairView,
)

urlpatterns = [
    path("generate-caption/", generate_caption, name="generate-caption"),
    path("caption-history/", caption_history, name="caption-history"),
    path("caption-history/<int:history_id>/", delete_caption_history, name="delete-caption-history"),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]