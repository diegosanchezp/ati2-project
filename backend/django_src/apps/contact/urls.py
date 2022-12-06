from . import views
from django.urls import path
from django.contrib.auth.views import PasswordResetConfirmView

urlpatterns = [
  path('contact/send-email/', views.sendEmail.as_view(), name='send-email'),
  path('contact/call-me/', views.callMe.as_view(), name='call-me'),
  path('contact/send-consult/', views.sendConsult.as_view(), name='send-consult'),
  path('contact/visit/', views.visitView.as_view(), name='visit'),
]
