from django.urls import path

from . import views

urlpatterns = [
    path('vehicle/brands', views.VehicleBrandView.as_view(), name='vehicle-brands'),
    path('vehicle/brand/<int:pk>/models', views.VehicleModelsByBrandView.as_view(), name='vehicle-models-by-brand'),
    path('deletevehicle', views.VehicleDeleteView.as_view(), name='delete-vehicle'),
    path('vehicle/create', views.VehicleCreateView.as_view(), name='vehicle-create'),
    # path('vehicle/<int:id>', views.VehicleView.as_view(), name='get-vehicle'),
    path('vehicle/<int:pk>', views.VehicleGetView.as_view(), name='get-vehicle'),
    path('vehicle/edit/<int:pk>', views.VehicleUpdateView.as_view(), name='get-vehicle'),
]
