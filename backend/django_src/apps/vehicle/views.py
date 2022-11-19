from dataclasses import fields
from django_src.apps.vehicle.models import Vehicle, VehicleBrand, VehicleImages, VehicleModel
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
        vehicleBrandsSerializer = VehicleBrandSerializer(vehicleBrands, many=True)

        return JsonResponse({'brands': vehicleBrandsSerializer.data})

class VehicleModelView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request):
        vehicleModels = VehicleModel.objects.all()
        vehicleModelsSerializer = VehicleBrandSerializer(vehicleModels, many=True)

        return JsonResponse({'models': vehicleModelsSerializer.data})

class VehicleView(APIView): 
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        vehicle = request.data.get('vehicle')
        createVehicleSerializer = VehicleSerializer(data=vehicle)
        if createVehicleSerializer.is_valid(raise_exception= True):
            createVehicleSerializer.save()

        vehicleImages = vehicle['vehicle_images']
        for image in vehicleImages :
            imageData = { 
                'vehicle': createVehicleSerializer.data['id'],
                'image': base64ToImageField(image)
            }
            vehicleImageSerializer = VehicleImageSerializer(data=imageData)
            if vehicleImageSerializer.is_valid():
                vehicleImageSerializer.save()

        return JsonResponse({ 'success': True })

