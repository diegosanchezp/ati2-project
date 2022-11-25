from rest_framework import serializers
from ..vehicle.models import Vehicle
from ..finance.serializers import CurrencySerializer
from ..country.serializers import CitySerializer

class VehicleSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only = True)
    location_city = CitySerializer(read_only = True)
    class Meta: 
        model = Vehicle
        exclude = [
            "user_contact",
            "owner",
            "model"
        ]

class VehicleListSerializer(serializers.Serializer):
    data = VehicleSerializer(many = True, read_only = True)
    total_elements = serializers.IntegerField()
    total_pages = serializers.IntegerField()


