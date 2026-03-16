from django.db import models


class GuestUsage(models.Model):
    identifier_hash = models.CharField(max_length=64, unique=True)
    source = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.source}:{self.identifier_hash[:8]}"


class CaptionHistory(models.Model):
    user = models.ForeignKey(
        "auth.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="caption_history",
    )
    guest_identifier_hash = models.CharField(max_length=64, null=True, blank=True)
    platform = models.CharField(max_length=50)
    caption_type = models.CharField(max_length=100)
    topic = models.TextField()
    caption = models.TextField()
    hashtags = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"CaptionHistory({self.platform}, {self.created_at.isoformat()})"
