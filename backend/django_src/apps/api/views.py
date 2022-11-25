from rest_framework.response import Response
from rest_framework.views import APIView

from django.core.paginator import Paginator
from django.db.models import Q

from ..vehicle.models import Vehicle
from .serializers import VehicleListSerializer

class VehiclesView(APIView):
    def get(self, request, format = None):
        filters = Q()

        continent = request.GET.get("continent", "any")
        if(continent != "any"):
            filters &= Q(location_city__state__country__continent__iexact = continent)

            country = request.GET.get("country", "any")
            if(country != "any"):
                filters &= Q(location_city__state__country__name__iexact = country)

                states = request.GET.getlist("state")
                if(len(states) > 0):
                    filters &= Q(location_city__state__id__in = states)
                    cities = request.GET.getlist("city")
                    if(len(cities)):
                        filters &= Q(location_city__id__in = cities)


        contract_type = request.GET.get("contract_type", "any")
        if(contract_type != "any"):
            filters &= Q(contract_type__icontains = contract_type)

        minimum_price = request.GET.get("minimum_price", -1)
        if(minimum_price != -1):
            minimum_price_filter = Q()

            if(contract_type in ["any", "RENTAL_SALE"] or contract_type == "SALE"):
                minimum_price_filter |= Q(sale_price__gte = minimum_price)

            if(contract_type in ["any", "RENTAL_SALE"] or contract_type == "RENTAL"):
                minimum_price_filter |= Q(rental_price__gte = minimum_price)
            
            filters &= minimum_price_filter

        year = request.GET.get("year", -1)
        if(year != -1):
            filters &= Q(year__year = year)

        vehicle_brand_id = request.GET.get("vehicle_brand_id", -1)
        if(vehicle_brand_id != -1):
            filters &= Q(model__brand__id = vehicle_brand_id)

        vehicle_model_id = request.GET.get("vehicle_model_id", -1)
        if(vehicle_model_id != -1):
            filters &= Q(model__id = vehicle_model_id)

        currency_code = request.GET.get("currency_code", "any")
        if(currency_code != "any"):
            filters &= Q(currency__code__iexact = currency_code)
        
        page_number = request.GET.get("page", 1)
        page_quantity = request.GET.get("page_quantity", 10)

        vehicles = Vehicle.objects.select_related("currency", "location_city__state__country")\
            .filter(filters)

        paginator = Paginator(vehicles, page_quantity)
        page_obj = paginator.get_page(page_number)

        serializer = VehicleListSerializer({
            "data": list(page_obj),
            "total_pages": paginator.num_pages,
            "total_elements": len(vehicles)
        })

        return Response(serializer.data)
