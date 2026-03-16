from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    generate_caption, RegisterView, LogoutView, CustomTokenObtainPairView,
    WorkspaceListCreateView, WorkspaceDetailView,
    BatchProfileListCreateView, BatchProfileDetailView
)

urlpatterns = [
    path("generate-caption/", generate_caption, name="generate-caption"),
    
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Workspaces
    path('workspaces/', WorkspaceListCreateView.as_view(), name='workspace-list'),
    path('workspaces/<uuid:pk>/', WorkspaceDetailView.as_view(), name='workspace-detail'),

    # Batch Profiles
    path('workspaces/<uuid:workspace_id>/profiles/', BatchProfileListCreateView.as_view(), name='profile-list'),
    path('profiles/<uuid:pk>/', BatchProfileDetailView.as_view(), name='profile-detail'),
]