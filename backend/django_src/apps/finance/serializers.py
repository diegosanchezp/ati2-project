from rest_framework import serializers

from ..finance.models import Currency

class CurrencySerializer(serializers.ModelSerializer):
    class Meta: 
        model = Currency
        exclude = []