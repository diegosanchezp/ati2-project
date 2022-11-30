from django.contrib import admin
from . import models
from django.contrib.contenttypes.admin import GenericStackedInline
from django_src.apps.misc.models import Telephone
# Register your models here.

admin.site.register(models.VehicleVideos)
admin.site.register(models.VehicleImages)

class VehicleImageInline(admin.StackedInline):
    model = models.VehicleImages
    fk_name = "vehicle"
    extra = 1
    def get_formset(self, request, obj=None, **kwargs):
        f = super().get_formset(request, obj=None, **kwargs)
        return f
        


class VehicleVideoInline(admin.StackedInline):
    model = models.VehicleVideos
    extra = 1

class VehicleModelInline(admin.StackedInline):
    model = models.VehicleModel
    extra = 1

class VehicleTelephonesInline(GenericStackedInline):
    model = Telephone
    extra = 1

@admin.register(models.VehicleBrand)
class VehicleBrandAdmin(admin.ModelAdmin):
    list_display = ("name",)

    inlines = [
        VehicleModelInline,
    ]

@admin.register(models.VehicleModel)
class VehicleModelAdmin(admin.ModelAdmin):
    list_display = ("brand", "name",)

    @admin.display()
    def brand(self, obj):
        return obj.name

@admin.register(models.Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    raw_id_fields=("location_city",)
    inlines = [
        VehicleImageInline,
        VehicleVideoInline,
        VehicleTelephonesInline,
    ]

