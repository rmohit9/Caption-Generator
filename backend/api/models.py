from django.db import models
from django.contrib.auth.models import User
import uuid
from datetime import timedelta
from django.utils.timezone import now


class GuestUsage(models.Model):
    identifier_hash = models.CharField(max_length=64, unique=True)
    source = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.source}:{self.identifier_hash[:8]}"

class Workspace(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, related_name='workspaces', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class BatchProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace = models.ForeignKey(Workspace, related_name='batch_profiles', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    brand = models.CharField(max_length=255)
    audience = models.CharField(max_length=255)
    tone = models.JSONField(default=list)
    
    language = models.CharField(max_length=50, default="English")
    length = models.CharField(max_length=20, default="medium")
    hashtag_count = models.IntegerField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.brand})"

class Campaign(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workspace = models.ForeignKey(Workspace, related_name='campaigns', on_delete=models.CASCADE)
    batch_profile = models.ForeignKey(BatchProfile, related_name='campaigns', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    product = models.CharField(max_length=255)
    details = models.TextField()
    hashtag_count = models.IntegerField(default=5)
    language = models.CharField(max_length=50, default='English')
    platforms = models.JSONField(default=list)
    results = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CaptionHistory(models.Model):
    user = models.ForeignKey(
        "auth.User", on_delete=models.SET_NULL, null=True, blank=True, related_name="caption_history"
    )
    guest_identifier_hash = models.CharField(max_length=64, null=True, blank=True)
    
    platforms = models.JSONField(default=list)
    results = models.JSONField(default=dict)
    caption_type = models.CharField(max_length=100)
    topic = models.TextField()
    is_pinned = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        platform_names = ", ".join(self.platforms) if isinstance(self.platforms, list) else "Unknown"
        return f"CaptionHistory({platform_names}, {self.created_at.strftime('%Y-%m-%d')})"

class PasswordResetOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_otps')
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return now() < self.created_at + timedelta(minutes=10)
    
    def __str__(self):
        return f"{self.user.email} - {self.otp}"

class SystemConfig(models.Model):
    gemini_api_key = models.CharField(max_length=255, blank=True, null=True)
    token_limit = models.IntegerField(default=1000000) # e.g., 1M tokens
    tokens_used = models.IntegerField(default=0)
    is_exhausted = models.BooleanField(default=False)

    class Meta:
        verbose_name = "System Configuration"
        verbose_name_plural = "System Configuration"

    def save(self, *args, **kwargs):
        # Force the ID to be 1 so we only ever have one configuration row
        self.pk = 1 
        super(SystemConfig, self).save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj