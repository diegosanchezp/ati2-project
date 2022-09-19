from django.apps import AppConfig


class AuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    label='customauth'
    name = 'django_src.apps.auth'
