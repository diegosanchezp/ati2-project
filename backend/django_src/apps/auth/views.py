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
from django.contrib.auth.hashers import make_password
from django_src.apps.auth.models import NaturalPerson
from django_src.apps.misc.models import Empresa, Telephone
from django_src.apps.finance.models import PaymentInfo
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

class NaturalPersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = NaturalPerson
        fields = '__all__'

    def create(self, validate_data):
        return NaturalPerson.objects.create(**validate_data)

class EmpresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empresa
        exclude = ['id']

class TelephoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telephone
        fields = '__all__'

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentInfo
        fields = '__all__'

class RegisterUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ['id','last_login','is_superuser','is_staff','is_active','groups','user_permissions', 'date_joined']

    def create(self, validate_data):
        return get_user_model().objects.create(**validate_data)

class RegisterUserView(APIView):
    @extend_schema(
        request=RegisterUserSerializer,
    )
    @extend_schema(
        request=NaturalPersonSerializer,
    )
    @extend_schema(
        request=EmpresaSerializer,
    )
    def post(self, request, format=None, **kwargs):
        request.data['password'] = make_password(request.data.get('password'), salt=None, hasher='default')
        register_user_serializer = RegisterUserSerializer(data=request.data)

        if not register_user_serializer.is_valid(raise_exception=True):
            return Response(
                data={"message": "Invalid user data"},
                status=400
            )
            
        result_user = register_user_serializer.save()

        if request.data.get('user_type') == 'NATURAL':
            natural_person_data = request.data.get('natural_person')
            natural_person_data['user'] = UserSerializer(result_user).data.get('id')
            natural_person_serializer = NaturalPersonSerializer(data=natural_person_data)

            if not natural_person_serializer.is_valid(raise_exception=True):
                return Response(
                    data={"message": "Invalid natural person data"},
                    status=400
                )

            natural_person_serializer.save()

        if request.data.get('user_type') == 'ENTERPRISE':
            empresa_data = request.data.get('empresa')
            empresa_data['representate'] = UserSerializer(result_user).data.get('id')
            empresa_serializer = EmpresaSerializer(data=empresa_data)
            if not empresa_serializer.is_valid(raise_exception = True):
                return Response(
                    data={"message": "Invalid empresa data"},
                    status=400
                )
            empresa_serializer.save()

        phone_numbers = request.data.get('phoneNumbers')
        for phone in phone_numbers:
            phone['content_type'] = 6
            phone['object_id'] = UserSerializer(result_user).data.get('id')
            phone['user'] = UserSerializer(result_user).data.get('id')
            phone_serializer = TelephoneSerializer(data=phone)
            if not phone_serializer.is_valid(raise_exception = True):
                return Response(
                    data={"message": "Invalid phone data"},
                    status=400
                )
            phone_serializer.save()

        banks = request.data.get('banks')
        
        banks_serializer = BankSerializer(data=banks)
        if not banks_serializer.is_valid(raise_exception = True):
            return Response(
                data={"message": "Invalid payment data"},
                status=400
            )
        banks_serializer.save()        

        res = Response(data={"message": "success"})
        return res

if settings.DEBUG:
    generate_ts(settings.TS_TYPES_DIR / "auth.ts", context='auth')
