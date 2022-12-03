from django_src.apps.country.models import City, Country, State
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse

# Create your views here.

class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model= Country
        fields= ['id', 'name', 'iso3']

class StatesSerializer(serializers.ModelSerializer):
    class Meta:
        model= State
        fields= ['id', 'name']

class CitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model= City
        fields= ['id', 'name']

class CountriesView(APIView):

    @staticmethod
    def get(request):
        countries = Country.objects.all()
        countriesSerializer = CountriesSerializer(countries, many=True)

        return JsonResponse({'countries': countriesSerializer.data})

class StatesByCountryView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, id):
        states = State.objects.filter(country=id)
        statesSerializer = StatesSerializer(states, many=True)

        return JsonResponse({'states': statesSerializer.data})

class CitiesByStateView(APIView):
    authentication_classes = [SessionAuthentication, BasicAuthentication]
    permission_classes = [IsAuthenticated]

    @staticmethod
    def get(request, id):
        cities = City.objects.filter(state=id)
        citiesSerializer = CitiesSerializer(cities, many=True)

        return JsonResponse({'cities': citiesSerializer.data})