from django.shortcuts import render

# Create your views here.
import json
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.forms import AuthenticationForm
from django.conf import settings

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
    return JsonResponse({'detail': 'Successfully logged out.'})


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

if settings.DEBUG:
    generate_ts(settings.TS_TYPES_DIR / "auth.ts", context='auth')
