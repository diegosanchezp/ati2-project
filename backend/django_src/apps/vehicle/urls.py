from django.urls import path

from . import views

urlpatterns = [
    path('vehicle/brands', views.VehicleBrandView.as_view(), name='vehicle-brand-list'),
    path('vehicle/models', views.VehicleModelView.as_view(), name='vehicle-model-list'),
    path('vehicle/create', views.VehicleView.as_view(), name='vehicle-create'),
]
