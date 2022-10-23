from django.contrib import admin

from . import models

# Register your models here.

class StateInline(admin.StackedInline):
    model = models.State
    extra = 1

@admin.register(models.Country)
class CountryAdmin(admin.ModelAdmin):
    """
    """
    list_display = ("continent", "name", "iso3", "phonecode")
    inlines = [
        StateInline
    ]

class CityInline(admin.StackedInline):
    model = models.City
    extra = 1

@admin.register(models.State)
class StateAdmin(admin.ModelAdmin):
    """
    """
    list_display = ("name", "iso2")
    inlines = [
        CityInline
    ]


@admin.register(models.City)
class CityAdmin(admin.ModelAdmin):
    """
    """
    list_display = ("name", )
