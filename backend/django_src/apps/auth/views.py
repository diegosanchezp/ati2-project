from django.shortcuts import render

# Create your views here.
import json
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from django.http import HttpRequest, QueryDict
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.forms import (
    AuthenticationForm,
    PasswordChangeForm,
    PasswordResetForm,
    SetPasswordForm,
)
from django.contrib.auth.views import (
    PasswordResetConfirmView
)
from django.conf import settings
from django.utils import translation

from django_typomatic import ts_interface, generate_ts
from rest_framework import serializers
from drf_spectacular.utils import extend_schema

@ts_interface(context="auth")
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ['password']


# Create your views here.
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


@ts_interface(context="auth")
class LoginRequestBody(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

class LoginView(APIView):
    @extend_schema(
        request=LoginRequestBody,
        responses={
            200: UserSerializer,
        },
        auth=None,
    )
    def post(self, request, format=None):
        login_data = LoginRequestBody(request.data)

        form = AuthenticationForm(request=request,data={
            "username": login_data.data.get('email'),
            "password": login_data.data.get('password')
        })

        if not form.is_valid():
            return Response(data=form.errors.get_json_data(), status=400)

        user = form.get_user()
        login(request, user)
        s_user = UserSerializer(user)
        return Response(data=s_user.data)

def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)

    logout(request)
    response = JsonResponse({'detail': 'Successfully logged out.'})
    # Remove language cookie
    translation.deactivate()
    response.delete_cookie(settings.LANGUAGE_COOKIE_NAME)
    return response


class SessionView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, format=None):
        return JsonResponse({'isAuthenticated': True})

class WhoAmIView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    @extend_schema(
        description="Get the logged in user",
        responses={
            200: UserSerializer
        }
    )
    def get(request, format=None):

        s_user = UserSerializer(request.user)
        return JsonResponse(s_user.data)

class PasswordResetView(APIView):

    def post(self, request, format=None):
        form = PasswordResetForm(data=request.data)

        if not form.is_valid():
            return Response(data=form.errors.get_json_data(), status=400)

        opts = {
            "use_https": request.is_secure(),
            "token_generator": default_token_generator,
            "domain_override": "localhost:3000",
            "from_email": "noreply@company.com",
            "email_template_name": "e_mail/password_reset_email.txt",
            "subject_template_name": "registration/password_reset_subject.txt",
            "request": request,
            "html_email_template_name": "e_mail/password_reset_email.html",
            "extra_email_context": None,
        }
        form.save(**opts)
        return Response(data={"message": "success"})

class SetNewPasswordView(APIView):
    def post(self, request, format=None, **kwargs):

        # Convert DRF request to django HttpRequest
        req = HttpRequest()
        req.method = request.method
        req.session = request.session
        req.META = request.META
        req.COOKIES = request.COOKIES
        req.path = request.path
        req.encoding = request.encoding
        # Pass request data as post
        postData = QueryDict(mutable=True)
        postData.update(request.data)
        req.POST = postData

        view = PasswordResetConfirmView(
            success_url="/"
        )
        view.setup(req, **kwargs)
        res = view.dispatch(req, **kwargs)

        # res = view(req, **kwargs)
        if(res.status_code != 302):
            form = view.get_form()
            if not form.is_valid():
                return Response(data=form.errors.get_json_data(), status=400)

        return Response(data={"message": "success"})

@ts_interface(context="auth")
class ChangeLanguageBody(serializers.Serializer):
    language = serializers.ChoiceField(
        choices=settings.LANGUAGES
    )

class ChangeSessionLanguageView(APIView):

    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ChangeLanguageBody,
    )
    def post(self, request, format=None, **kwargs):
        lang_body = ChangeLanguageBody(data=request.data)
        if not lang_body.is_valid():
            return Response(
                data={"message": "Invalid language"},
                status=400
            )
        user_language = lang_body.data
        translation.activate(user_language["language"])
        res = Response(data={"message": "success"})
        res.set_cookie(settings.LANGUAGE_COOKIE_NAME, user_language["language"])
        return res


if settings.DEBUG:
    generate_ts(settings.TS_TYPES_DIR / "auth.ts", context='auth')
