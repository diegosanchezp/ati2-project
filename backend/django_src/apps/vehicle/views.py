from django_src.apps.misc.models import Telephone
from .utils import base64ToImageField, formsetdata_to_dict
from .serializers import VehicleModelSerializer
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
from rest_framework.response import Response
from rest_framework.parsers import FormParser, MultiPartParser
from .serializers import *
from .forms import *
from django.views import View
from django.views.generic import UpdateView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin
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

class CitiesByStateView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, id):
        cities = City.objects.filter(state=id)
        citiesSerializer = CitiesSerializer(cities, many=True)

        return JsonResponse({'cities': citiesSerializer.data})


class VehicleModelsByBrandView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, pk):
        vehicleModels = VehicleModel.objects.filter(brand=pk)
        vehicleModelsSerializer = VehicleModelSerializer(
            vehicleModels, many=True)

        return JsonResponse({'models': vehicleModelsSerializer.data})

class VehicleGetView(generics.RetrieveAPIView):
    serializer_class = VehicleSerializer
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Vehicle.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        initial_data = serializer.data
        countries = Country.objects.all()
        countriesSerializer = CountriesSerializer(countries, many=True)

        states = State.objects.filter(
            country=instance.location_city.state.country.id)
        statesSerializer = StatesSerializer(states, many=True)

        models = VehicleModel.objects.filter(
            brand=instance.model.brand.id
        )
        modelsSerializer = VehicleModelSerializer(models, many=True)

        cities = City.objects.filter(state=instance.location_city.state.id)
        citiesSerializer = CitiesSerializer(cities, many=True)
        images_form = VehicleImageFormSet(instance=instance)
        video_form = VehicleVideosFormSet(instance=instance)
        telephone_form = VehicleTelephoneNumber(instance=instance)


        new_data = {
            'images': formsetdata_to_dict(images_form),
            'videos': formsetdata_to_dict(video_form),
            'contact_phone_numbers': formsetdata_to_dict(telephone_form),
            'countries': countriesSerializer.data,
            'states': statesSerializer.data,
            'cities': citiesSerializer.data,
            'models': modelsSerializer.data
        }
        return Response({**initial_data, **new_data})

class VehicleCreateView(LoginRequiredMixin, CreateView):
    model = Vehicle
    success_url = "/"
    form_class = VehicleForm
    def post(self, request,*args, **kwargs):
        vehicle_form = self.get_form()
        if not vehicle_form.is_valid():
            return JsonResponse(data={
                "imageErrors": [],
                "videoErrors": [],
                "vehicleErrors": parent_form.errors.get_json_data(),
                "telephoneErrors": []
            }, status=400)

        vehicle = vehicle_form.save(commit=False)
        vehicle.brand = vehicle.model.brand
        vehicle.owner = request.user
        vehicle.save()

        image_form = VehicleImageFormSet(request.POST, request.FILES, instance=vehicle)
        video_form = VehicleVideosFormSet(request.POST, request.FILES, instance=vehicle)
        telephone_form = VehicleTelephoneNumber(request.POST, instance=vehicle)

        if not all([
            image_form.is_valid(),
            video_form.is_valid(),
            telephone_form.is_valid()
        ]):
            return JsonResponse(data={
                "imageErrors": image_form.errors,
                "videoErrors": video_form.errors,
                "vehicleErrors": vehicle_form.errors.get_json_data(),
                "telephoneErrors": telephone_form.errors
            }, status=400)

        images = image_form.save(commit=False)
        for image in images:
            image.vehicle = vehicle
            image.save()

        videos = video_form.save(commit=False)
        for video in videos:
            video.vehicle = vehicle
            video.save()

        phoneNums = telephone_form.save(commit=False)

        for phoneNum in phoneNums:
            phoneNum.user = request.user
            phoneNum.save()

        return JsonResponse(data={
            "message": "success"
        })
class VehicleUpdateView(LoginRequiredMixin, UpdateView):
    # parser_classes = [FormParser, MultiPartParser]
    model = Vehicle
    queryset = Vehicle.objects.all()
    form_class = VehicleForm
    success_url = "/"

    def post(self, request,*args, **kwargs):
        # super fetches the vehicle from db
        super().post(request, *args, **kwargs)
        vehicle = self.object

        # Vehicle Form
        parent_form = self.get_form()

        # Children Formsets
        image_form = VehicleImageFormSet(request.POST, request.FILES, instance=vehicle)
        video_form = VehicleVideosFormSet(request.POST, request.FILES, instance=vehicle)
        telephone_form = VehicleTelephoneNumber(request.POST, instance=vehicle)

        if all([
            parent_form.is_valid(),
            image_form.is_valid(),
            video_form.is_valid(),
            telephone_form.is_valid()
        ]):
            parent_form.save()
            images = image_form.save()
            videos = video_form.save()
            phoneNums = telephone_form.save(commit=False)

            for phoneNum in phoneNums:
                phoneNum.user = request.user
                phoneNum.save()

            return JsonResponse(data={
                "message": "success"
            })


        # return self.form_invalid(parent_form)
        return JsonResponse(data={
            "imageErrors": image_form.errors,
            "videoErrors": video_form.errors,
            "vehicleErrors": parent_form.errors.get_json_data(),
            "telephoneErrors": telephone_form.errors
        }, status=400)

    # def form_valid(self, parent_form, *formsets):
    #
    # def form_invalid(self, form):
    #     return self.render_to_response(self.get_context_data(form=form))

class VehicleDeleteView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def post(request):
        ids = request.data.get('ids')
        vehicles_to_delete = Vehicle.objects.filter(pk__in=ids)
        vehicles_to_delete.delete()
        return JsonResponse({'success': True})