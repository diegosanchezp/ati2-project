from django_src.apps.misc.models import Telephone
from .utils import base64ToImageField
from django.http import JsonResponse
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import generics
from rest_framework import serializers
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from django_src.apps.country.models import City, Country, State
from django_src.apps.country.views import CitiesSerializer, CountriesSerializer, StatesSerializer
from django_src.apps.vehicle.models import Vehicle, VehicleBrand, VehicleImages, VehicleModel, VehicleVideos
from django_src.apps.finance.models import Currency

from .serializers import *
# Create your views here.

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

class VehicleGetView(generics.RetrieveAPIView):
    serializer_class = VehicleSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Vehicle.objects.all()

class VehicleView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        vehicle = request.data.get('vehicle')
        createVehicleSerializer = VehicleSerializer(data=vehicle)
        # Currency(name=)
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

    # @staticmethod
    # def get(request, id=None):
    #     if id:
    #         vehicle = Vehicle.objects.filter(id=id).first()
    #         vehicleSerializer = VehicleSerializer(vehicle)
    #        
    #
    #         vehicleImages = VehicleImages.objects.filter(vehicle=id)
    #         vehicleImagesSerializer = VehicleImageSerializer(
    #             vehicleImages, many=True)
    #
    #         vehicleVideos = VehicleVideos.objects.filter(vehicle=id)
    #         vehicleVideosSerializer = VehicleImageSerializer(
    #             vehicleVideos, many=True)
    #
    #         _vehicleData = vehicleSerializer.data
    #         _vehicleData['location_state'] = vehicle.location_city.state.id
    #         _vehicleData['location_country'] = vehicle.location_city.state.country.id
    #         _vehicleData['location_continent'] = vehicle.location_city.state.country.continent
    #
    #         countries = Country.objects.all()
    #         countriesSerializer = CountriesSerializer(countries, many=True)
    #
    #         states = State.objects.filter(
    #             country=vehicle.location_city.state.country.id)
    #         statesSerializer = StatesSerializer(states, many=True)
    #
    #         cities = City.objects.filter(state=vehicle.location_city.state.id)
    #         citiesSerializer = CitiesSerializer(cities, many=True)
    #
    #
    #         return JsonResponse({
    #             'vehicle': _vehicleData,
    #             'images': vehicleImagesSerializer.data,
    #             'videos': vehicleVideosSerializer.data,
    #             'countries': countriesSerializer.data,
    #             'states': statesSerializer.data,
    #             'cities': citiesSerializer.data
    #         })

        @staticmethod
        def put(request):
            vehicle = request.data.get('vehicle')
            vehicleId = request.data.get('vehicle_id')
            editVehicleSerializer = VehicleSerializer(id=vehicleId, data=vehicle)
            if editVehicleSerializer.is_valid(raise_exception=True):
                editVehicleSerializer.save()

            vehicleImages = vehicle['vehicle_images']
            for image in vehicleImages:
                imageData = {
                    'vehicle': editVehicleSerializer.data['id'],
                    'image': base64ToImageField(image)
                }
                vehicleImageSerializer = VehicleImageSerializer(data=imageData)
                if vehicleImageSerializer.is_valid():
                    vehicleImageSerializer.save()

            return JsonResponse({'success': True})

