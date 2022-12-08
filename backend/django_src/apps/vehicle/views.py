from django_src.apps.country.models import City, Country, State
from django_src.apps.country.views import CitiesSerializer, CountriesSerializer, StatesSerializer
from django_src.apps.vehicle.models import Vehicle, VehicleBrand, VehicleImages, VehicleModel, VehicleVideos
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .utils import base64ToImageField
# Create your views here.


class VehicleBrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleBrand
        fields = ['id', 'name']


class VehicleModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleModel
        fields = ['id', 'name']


class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ('__all__')

    def create(self, validate_data):
        return Vehicle.objects.create(**validate_data)


class VehicleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = VehicleImages
        fields = ('__all__')

    def create(self, validate_data):
        return VehicleImages.objects.create(**validate_data)


class VehicleBrandView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        vehicleBrands = VehicleBrand.objects.all()
        vehicleBrandsSerializer = VehicleBrandSerializer(
            vehicleBrands, many=True)

        return JsonResponse({'brands': vehicleBrandsSerializer.data})


class VehicleModelView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        vehicleModels = VehicleModel.objects.all()
        vehicleModelsSerializer = VehicleBrandSerializer(
            vehicleModels, many=True)

        return JsonResponse({'models': vehicleModelsSerializer.data})


class VehicleView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        vehicle = request.data.get('vehicle')
        createVehicleSerializer = VehicleSerializer(data=vehicle)
        if createVehicleSerializer.is_valid(raise_exception=True):
            createVehicleSerializer.save()

        vehicleImages = vehicle['vehicle_images']
        for image in vehicleImages:
            imageData = {
                'vehicle': createVehicleSerializer.data['id'],
                'image': base64ToImageField(image)
            }
            vehicleImageSerializer = VehicleImageSerializer(data=imageData)
            if vehicleImageSerializer.is_valid():
                vehicleImageSerializer.save()

        return JsonResponse({'success': True})

    @staticmethod
    def get(request, id=None):
        if id:
            vehicle = Vehicle.objects.filter(id=id).first()
            vehicleSerializer = VehicleSerializer(vehicle)

            vehicleImages = VehicleImages.objects.filter(vehicle=id)
            vehicleImagesSerializer = VehicleImageSerializer(
                vehicleImages, many=True)

            vehicleVideos = VehicleVideos.objects.filter(vehicle=id)
            vehicleVideosSerializer = VehicleImageSerializer(
                vehicleVideos, many=True)

            _vehicleData = vehicleSerializer.data
            _vehicleData['location_state'] = vehicle.location_city.state.id
            _vehicleData['location_country'] = vehicle.location_city.state.country.id
            _vehicleData['location_continent'] = vehicle.location_city.state.country.continent

            countries = Country.objects.all()
            countriesSerializer = CountriesSerializer(countries, many=True)

            states = State.objects.filter(
                country=vehicle.location_city.state.country.id)
            statesSerializer = StatesSerializer(states, many=True)

            cities = City.objects.filter(state=vehicle.location_city.state.id)
            citiesSerializer = CitiesSerializer(cities, many=True)

            return JsonResponse({
                    'vehicle': _vehicleData, 
                    'images': vehicleImagesSerializer.data, 
                    'videos': vehicleVideosSerializer.data, 
                    'countries': countriesSerializer.data,
                    'states': statesSerializer.data,
                    'cities': citiesSerializer.data
                })


class VehicleDeleteView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        ids = request.data.get('ids')
        vehicles_to_delete = Vehicle.objects.filter(pk__in=ids)
        vehicles_to_delete.delete()
        return JsonResponse({'success': True})