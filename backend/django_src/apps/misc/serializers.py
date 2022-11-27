from rest_framework import serializers
from .models import Telephone

from django.conf import settings
from django_typomatic import ts_interface, generate_ts, ts_field

@ts_interface(context="vehicle")
@ts_interface(context="misc")
class TelephoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telephone
        fields = ["number", "country_number", "ext", "ptype"]

if settings.DEBUG:
    generate_ts(settings.TS_TYPES_DIR / "misc.ts", context='misc')
