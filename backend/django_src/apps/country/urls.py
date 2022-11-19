from django.urls import path

from . import views

urlpatterns = [
    path('countries', views.CountriesView.as_view(), name='countries-list'),
    path('country/<int:id>/states', views.StatesByCountryView.as_view(), name='states-by-country-list'),
    path('state/<int:id>/cities', views.CitiesByStateView.as_view(), name='cities-by-state-list'),
]
