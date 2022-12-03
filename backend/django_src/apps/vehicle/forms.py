from .models import Vehicle, VehicleImages, VehicleVideos
from django.forms import ModelForm
from django.forms import inlineformset_factory

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

