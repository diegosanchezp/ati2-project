from .base import *  # noqa
from django.core.management.utils import get_random_secret_key
import os

# Activate Django-Heroku. This line should always be last
# beacuse the locals function reads all of the variables
# defined in this file

#https://stackoverflow.com/a/59758479
SECRET_KEY = env('SECRET_KEY', cast=(
    str, get_random_secret_key()
)) # noqa F405

# https://docs.djangoproject.com/en/stable/ref/settings/#databases
DATABASES = {"default": env.db("DATABASE_URL")}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

# https://stackoverflow.com/questions/70508568/django-csrf-trusted-origins-not-working-as-expected
CSRF_TRUSTED_ORIGINS = [
    "https://*.herokuapp.com",
]

# Danger
ALLOWED_HOSTS = ["*"]

STATICFILES_STORAGE = "django_src.storage.WhiteNoiseStaticFilesStorage"


LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console"],
            "level": "DEBUG",
        },
    },
}
