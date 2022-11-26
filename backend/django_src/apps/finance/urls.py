from django.urls import path

from . import views

urlpatterns = [
    path('finance/currencies', views.CurrencyView.as_view(), name='currency-list'),
]
