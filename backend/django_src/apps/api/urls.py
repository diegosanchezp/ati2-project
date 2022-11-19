from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework import routers

from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter, SimpleRouter
from django.conf import settings
from django_src.apps.auth.urls import urlpatterns as authurls
from django_src.apps.country.urls import urlpatterns as countryUrls
from django_src.apps.vehicle.urls import urlpatterns as vehicleUrls
from django_src.apps.finance.urls import urlpatterns as financeUrls

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

urlpatterns = [
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
    path("email/", include('django_src.apps.e_mail.urls'))
]

urlpatterns += authurls
urlpatterns += countryUrls
urlpatterns += vehicleUrls
urlpatterns += financeUrls
urlpatterns += router.urls
