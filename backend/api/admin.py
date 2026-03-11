from django.contrib import admin

from .models import GuestUsage


@admin.register(GuestUsage)
class GuestUsageAdmin(admin.ModelAdmin):
    list_display = ("id", "source", "identifier_hash", "created_at")
    search_fields = ("identifier_hash",)
