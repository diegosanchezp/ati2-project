from .models import Vehicle, VehicleImages, VehicleVideos

from django.forms import inlineformset_factory

VehicleImageFormSet = inlineformset_factory(
    Vehicle,
    VehicleImages,
    fields=("image",),
)

VehicleVideosFormSet = inlineformset_factory(
    Vehicle,
    VehicleVideos,
    fields=("video",)
)

