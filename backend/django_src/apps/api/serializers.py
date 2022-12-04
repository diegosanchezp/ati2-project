from rest_framework import serializers
from ..vehicle.models import Vehicle, VehicleImages, VehicleVideos, VehicleModel, VehicleBrand
from ..misc.models import Telephone
from ..finance.serializers import CurrencySerializer
from ..country.serializers import CitySerializer
from django_typomatic import ts_interface, generate_ts

from django.contrib.auth import get_user_model

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = [
            "password",
            "last_login",
            "is_superuser",
            "is_staff",
            "is_active",
            "date_joined",
            "user_type",
            "language",
            "keep_informed",
            "groups",
            "user_permissions"
        ]

class VehicleBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleBrand
        exclude = []


class VehicleModelSerializer(serializers.ModelSerializer):
    brand = VehicleBrandSerializer(read_only = True)
    class Meta:
        model = VehicleModel
        exclude = []


class VehicleVideosSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleVideos
        exclude = [
            "vehicle"
        ]

class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImages
        exclude = [
            "vehicle"
        ]
class TelephoneSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Telephone
        exclude = []

class VehicleSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only = True)
    location_city = CitySerializer(read_only = True)
    model = VehicleModelSerializer(read_only = True)
    owner = OwnerSerializer(read_only = True)
    images = VehicleImageSerializer(many = True, read_only = True)
    videos = VehicleVideosSerializer(many = True, read_only = True)
    #contact_phone_numbers = TelephoneSerializer(many=True, read_only=True)
    class Meta: 
        model = Vehicle
        exclude = []
    
class VehicleSerializerGet(serializers.Serializer):
    vehicle=VehicleSerializer(read_only=True)
    contact_phone_numbers = TelephoneSerializer(many=True, read_only=True)


class VehicleListSerializer(serializers.Serializer): 
    data = VehicleSerializer(many = True, read_only = True)
    total_elements = serializers.IntegerField()
    total_pages = serializers.IntegerField()


