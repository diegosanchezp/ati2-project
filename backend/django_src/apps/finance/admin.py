from django.contrib import admin

from . import models
# Register your models here.

@admin.register(models.Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ("name", "code")

@admin.register(models.PaymentInfo)
class PaymentInfoAdmin(admin.ModelAdmin):

    list_display = ("origin_bank", "destination_bank",)


