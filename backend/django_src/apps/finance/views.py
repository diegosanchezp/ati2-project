from django_src.apps.finance.models import Currency
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse

# Create your views here.

class CurrencySerializer(serializers.ModelSerializer):
    class Meta:
        model= Currency
        fields= ['id', 'name', 'code', 'country']

class CurrencyView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        currencies = Currency.objects.all()
        currenciesSerializer = CurrencySerializer(currencies, many=True)

        return JsonResponse({'currencies': currenciesSerializer.data})