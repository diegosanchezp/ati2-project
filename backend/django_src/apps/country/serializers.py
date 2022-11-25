from rest_framework import serializers

from .models import City

class CitySerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()
    class Meta:
        model = City
        exclude = [
            "id",
            "state"
        ]
    
    def get_location(self, obj):
        return obj.__str__()