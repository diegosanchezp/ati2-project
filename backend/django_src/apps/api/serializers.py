from rest_framework import serializers
from ..vehicle.models import Vehicle, VehicleImages, VehicleVideos, VehicleModel, VehicleBrand
from ..finance.serializers import CurrencySerializer
from ..country.serializers import CitySerializer


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

class VehicleSerializer(serializers.ModelSerializer):
    currency = CurrencySerializer(read_only = True)
    location_city = CitySerializer(read_only = True)
    model = VehicleModelSerializer(read_only = True)
    images = VehicleImageSerializer(many = True, read_only = True)
    videos = VehicleVideosSerializer(many = True, read_only = True)
    class Meta: 
        model = Vehicle
        exclude = [
            "owner",
        ]



class VehicleListSerializer(serializers.Serializer):
    data = VehicleSerializer(many = True, read_only = True)
    total_elements = serializers.IntegerField()
    total_pages = serializers.IntegerField()


