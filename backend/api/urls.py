"""
URL configuration for the api app.
"""

from django.urls import path
from . import views

urlpatterns = [
    path("auth/user/", views.UserProfileView.as_view(), name="user-profile"),
    path("health/", views.HealthCheckView.as_view(), name="health-check"),
]
