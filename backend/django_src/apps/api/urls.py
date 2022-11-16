from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework import routers

from django.urls import path, include
from .views import VehiclesView
from rest_framework.routers import DefaultRouter, SimpleRouter
from django.conf import settings
from django_src.apps.auth.urls import urlpatterns as authurls

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

urlpatterns = [
    path("vehicles/", VehiclesView.as_view(), name="vehicles_list"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    # Optional UI:
    path(
        "docs/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]

urlpatterns += authurls
urlpatterns += router.urls
