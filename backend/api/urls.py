from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    generate_caption,
    caption_history,
    manage_caption_history,
    RegisterView,
    LogoutView,
    CustomTokenObtainPairView,
    UpdateProfileView,
    ChangePasswordView,
    WorkspaceListCreateView, 
    WorkspaceDetailView,
    BatchProfileListCreateView, 
    BatchProfileDetailView,
    CampaignListCreateView,
    CampaignDetailView,
    RequestOTPView,
    VerifyOTPView,
    ConfirmPasswordResetView,
    AdminLoginView,
    SystemConfigView,
    RequestSignupOTPView,
    VerifySignupOTPView,
    OTPRegisterView,
    test_signup_otp
)

urlpatterns = [
    path("generate-caption/", generate_caption, name="generate-caption"),
    path("caption-history/", caption_history, name="caption-history"),
    path("caption-history/<int:history_id>/", manage_caption_history, name="manage-caption-history"),
    
    # Auth & Profile
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('update-profile/', UpdateProfileView.as_view(), name='update-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('password-reset/request-otp/', RequestOTPView.as_view(), name='request-otp'),
    path('password-reset/verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('password-reset/confirm/', ConfirmPasswordResetView.as_view(), name='confirm-password-reset'),
    
    # OTP Signup
    path('signup/test/', test_signup_otp, name='signup-test'),
    path('signup/request-otp/', RequestSignupOTPView.as_view(), name='signup-request-otp'),
    path('signup/verify-otp/', VerifySignupOTPView.as_view(), name='signup-verify-otp'),
    path('signup/otp-register/', OTPRegisterView.as_view(), name='signup-otp-register'),
    
    # Workspaces
    path('workspaces/', WorkspaceListCreateView.as_view(), name='workspace-list'),
    path('workspaces/<uuid:pk>/', WorkspaceDetailView.as_view(), name='workspace-detail'),

    # Batch Profiles
    path('workspaces/<uuid:workspace_id>/profiles/', BatchProfileListCreateView.as_view(), name='profile-list'),
    path('profiles/<uuid:pk>/', BatchProfileDetailView.as_view(), name='profile-detail'),

    # Campaigns
    path('workspaces/<uuid:workspace_id>/campaigns/', CampaignListCreateView.as_view(), name='campaign-list'),
    path('workspaces/<uuid:workspace_id>/campaigns/<uuid:pk>/', CampaignDetailView.as_view(), name='campaign-detail-workspace'),
    path('campaigns/<uuid:pk>/', CampaignDetailView.as_view(), name='campaign-detail'),

    # Admin
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('admin/config/', SystemConfigView.as_view(), name='admin-config'),
]