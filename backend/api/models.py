from django.db import models


class GuestUsage(models.Model):
    identifier_hash = models.CharField(max_length=64, unique=True)
    source = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.source}:{self.identifier_hash[:8]}"
