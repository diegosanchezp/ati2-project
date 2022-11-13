from . import views
from django.urls import path

urlpatterns = [
    path('send_mail', views.SendMailView.as_view(), name="send-mail"),
]
