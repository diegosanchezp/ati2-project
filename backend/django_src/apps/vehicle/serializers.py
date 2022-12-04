from rest_framework import serializers
from django_src.apps.misc.models import Telephone
from django_src.apps.country.models import City, Country, State
from django_src.apps.country.views import CitiesSerializer, CountriesSerializer, StatesSerializer
from django_src.apps.vehicle.models import Vehicle, VehicleBrand, VehicleImages, VehicleModel, VehicleVideos

from django_src.apps.misc.serializers import TelephoneSerializer

# Typescript types
from django.conf import settings
from django_typomatic import ts_interface, generate_ts, ts_field

@ts_interface(context="vehicle")
class VehicleBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleBrand
        fields = ['id', 'name']


@ts_interface(context="vehicle")
class VehicleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleModel
        fields = ['id', 'name']

@ts_interface(context="vehicle")
class CityNestedSerializer(serializers.ModelSerializer):
    class Meta:
        fields = "__all__"
        model = City
        depth = 3

@ts_interface(context="vehicle")
class VechicleModelNested(serializers.ModelSerializer):
    class Meta:
        model = VehicleModel
        fields = "__all__"
        depth = 1

@ts_interface(context="vehicle")
class VehicleVideosSerializer(serializers.Serializer):
    class Meta:
        model = VehicleVideos
        fields = "__all__"

@ts_interface(context="vehicle")
class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImages
        fields = ('__all__')

    def create(self, validate_data):
        return VehicleImages.objects.create(**validate_data)

@ts_field('TelephoneSerializer', context="vehicle")
class TelephoneRelatedField(serializers.RelatedField):
    """
    A custom field to use for the `telephone` generic relationship.
    """
    def to_representation(self, value):
        """
        Serialize tagged objects to a simple textual representation.
        """
        if isinstance(value, Telephone):
            serializer = TelephoneSerializer(value)

        return serializer.data

@ts_interface(context="vehicle")
class VehicleSerializer(serializers.ModelSerializer):
    location_city = CityNestedSerializer()
    model = VechicleModelNested()
    # contact_phone_numbers = TelephoneRelatedField(many=True, queryset=Telephone.objects.all())

    class Meta:
        model = Vehicle
        include = "__all__"
        exclude = ('owner', "brand")
        depth = 1
    # def to_representation(self, instance):
    #     data = super().to_representation(instance=instance)
    #     telephones = TelephoneSerializer(
    #         instance.contact_phone_numbers.all(),
    #         many=True,
    #     )
    #     breakpoint()
    #     data["contact_phone_numbers"] = telephones.data
    #     return data

    def create(self, validate_data):
        return Vehicle.objects.create(**validate_data)

@ts_interface(context="vehicle")
class VehicleGetSerializer(serializers.Serializer):
    vehicle = VehicleSerializer()
    images = VehicleImageSerializer(many=True)
    videos = VehicleImageSerializer(many=True)
    countries = CountriesSerializer()
    states = StatesSerializer()
    cities = CitiesSerializer()

if settings.DEBUG:
    generate_ts(settings.TS_TYPES_DIR / "vehicle.ts", context='vehicle')
