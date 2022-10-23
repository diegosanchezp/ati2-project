from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (User, NaturalPerson)
from django_src.apps.misc.admin import (
    TelephoneStacked
)

class MyUserAdmin(UserAdmin):
    inlines = [
        TelephoneStacked
    ]

admin.site.register(User, MyUserAdmin)

@admin.register(NaturalPerson)
class NaturalPersonAdmin(admin.ModelAdmin):
    list_display = ("id_code", "user")
