import json
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.http import JsonResponse
from django.contrib.auth import get_user_model, login, logout
from django.contrib.auth.forms import AuthenticationForm

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ['password']

# Create your views here.
def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


@require_POST
def login_view(request):
    data = json.loads(request.body)

    form = AuthenticationForm(request=request,data={
        "username": data.get('username'),
        "password": data.get('password')
    })

    if not form.is_valid():
        return JsonResponse(form.errors.get_json_data(), status=400)

    user = form.get_user()
    login(request, user)
    s_user = UserSerializer(user)
    return JsonResponse(s_user.data)


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
    def get(request, format=None):

        s_user = UserSerializer(request.user)
        return JsonResponse(s_user.data)
