from django.forms.formsets import BaseFormSet
from .models import Vehicle, VehicleImages, VehicleVideos
from django.forms import ModelForm
from django.forms import inlineformset_factory
from django_src.apps.misc.models import Telephone
from django import forms
from django.contrib.contenttypes.forms import generic_inlineformset_factory
class VehicleForm(ModelForm):
    class Meta:
        model = Vehicle
        exclude = ("owner", "brand",)

VehicleImageFormSet = inlineformset_factory(
    Vehicle,
    VehicleImages,
    fields=("image",),
    max_num=20,
    extra=0
)

VehicleVideosFormSet = inlineformset_factory(
    Vehicle,
    VehicleVideos,
    fields=("video",)
)

VehicleTelephoneNumber = generic_inlineformset_factory(
    Telephone,
    fields=("number", "country_number","ext", "ptype"),
    max_num=2,
    extra=0,
)
