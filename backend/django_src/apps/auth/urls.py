from . import views
from django.urls import path
from django.contrib.auth.views import PasswordResetConfirmView

urlpatterns = [
    path('csrf/', views.get_csrf, name='api-csrf'),
    path('login/', views.LoginView.as_view(), name='api-login'),
    path('logout/', views.logout_view, name='api-logout'),
    path('session/', views.SessionView.as_view(), name='api-session'),  # new
    path('whoami/', views.WhoAmIView.as_view(), name='api-whoami'),  # new
    path("password_change/", views.PasswordResetView.as_view(), name="password_change"),
    path(
        "reset/<uidb64>/<token>/",
        views.SetNewPasswordView.as_view(),
        name="set_new_password",
    ),
    path(
        "change_session_lang",
        views.ChangeSessionLanguageView.as_view(),
        name="change_session_lang"
    ),
]
