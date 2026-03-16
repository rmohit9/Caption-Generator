from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="GuestUsage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("identifier_hash", models.CharField(max_length=64, unique=True)),
                ("source", models.CharField(max_length=20)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
