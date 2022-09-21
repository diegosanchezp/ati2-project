from . import views
from django.urls import path

urlpatterns = [
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.LoginView.as_view(), name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.SessionView.as_view(), name='api-session'),  # new
    path('whoami/', views.WhoAmIView.as_view(), name='api-whoami'),  # new
]
