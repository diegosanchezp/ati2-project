from django.urls import path

from . import views

urlpatterns = [
    path('vehicle/brands', views.VehicleBrandView.as_view(), name='vehicle-brands'),
    path('vehicle/models', views.VehicleModelView.as_view(), name='vehicle-models'),
    path('vehicle', views.VehicleView.as_view(), name='vehicle-create'),
    # path('vehicle/<int:id>', views.VehicleView.as_view(), name='get-vehicle'),
    path('vehicle/<int:pk>', views.VehicleGetView.as_view(), name='get-vehicle'),
    path('vehicle/edit/<int:pk>', views.VehicleUpdateView.as_view(), name='get-vehicle'),
]
