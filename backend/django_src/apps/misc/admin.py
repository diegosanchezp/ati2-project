from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline

from . import models

# Register your models here.
@admin.register(models.SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    """
    """
    list_display = ("name", )

class SocialMediaInline(GenericTabularInline):
    model = models.SocialMedia

class MediosStacked(admin.StackedInline):
    """
    """
    model = models.Medios
    extra = 1

@admin.register(models.Frequency)
class FrequencyAdmin(admin.ModelAdmin):
    """
    """
    list_display = ("time", "user")
    inlines = [
        MediosStacked
    ]

# TODO: use it in auth app.admin.py
class TelephoneStacked(admin.StackedInline):
    model = models.Telephone
    extra = 2

@admin.register(models.Telephone)
class TelephoneAdmin(admin.ModelAdmin):
    """
    """
    list_display = ("ptype", "country_number", "number", "ext")
