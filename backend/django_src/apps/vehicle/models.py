from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings
from django.contrib.contenttypes.fields import GenericRelation
# Doesnt werks
# def user_directory_path(dir_name: str):
#     def fn(instance, filename):
#         # file will be uploaded to MEDIA_ROOT//user_<id>/<filename>
#         return f"{dir_name}/user_{instance.vehicle.owner.username}/{filename}"
#     return fn

def images_path(instance, filename):
    return f"vehicle/images/user_{instance.vehicle.owner.username}/{filename}"

def videos_path(instance, filename):
    return f"vehicle/videos/user_{instance.vehicle.owner.username}/{filename}"


class VehicleImages(models.Model):

    vehicle = models.ForeignKey(
        to="Vehicle",
        on_delete=models.CASCADE,
        verbose_name=_("Vehicle"),
        related_name="images",
    )

    image = models.ImageField(
        upload_to=images_path,
    )

class VehicleVideos(models.Model):

    vehicle = models.ForeignKey(
        to="Vehicle",
        on_delete=models.CASCADE,
        verbose_name=_("Vehicle"),
        related_name="videos",
    )

    video = models.FileField(
        upload_to=videos_path
    )

# Vehicle ->1..1-> 1 brand ->1..Many-> models
class VehicleBrand(models.Model):
    name = models.CharField(
        verbose_name=_("Brand name"),
        max_length=255,
    )

    def __str__(self) -> str:
        return f"{self.name}"

class VehicleModel(models.Model):
    name = models.CharField(
        verbose_name=_("Model name"),
        max_length=255,
    )

    brand = models.ForeignKey(
        to="VehicleBrand",
        on_delete=models.CASCADE,
        verbose_name=_("Vehicle Brand"),
        related_name="models",
    )

    def __str__(self) -> str:
        return f"{self.brand.name} {self.name}"

class Vehicle(models.Model):
    class TypeVehicle(models.TextChoices):
        TRUCK = "TRUCK", _("Truck")
        CAR = "CAR", _("Car")
        VAN = "VAN", _("Van")

    class Status(models.TextChoices):
        NEW = "NEW", _("New")
        USED = "USED", _("Used")

    class ContractType(models.TextChoices):

        RENTAL = "RENTAL", _("Rental")
        SALE = "SALE", _("Sale")
        RENTAL_SALE = "RENTAL_SALE", _("Rental and Sale")

    class ContactDays(models.TextChoices):
        MONDAY = "MONDAY", _("monday")
        TUESDAY = "TUESDAY", _("Tuesday")
        WEDNESDAY = "WEDNESDAY", _("Wednesday")
        THURSDAY = "THURSDAY", _("Thursday")
        FRIDAY = "FRIDAY", _("Friday")
        SATURDAY = "SATURDAY", _("Saturday")
        SUNDAY = "SUNDAY", _("Sunday")
        WEEKENDS = "WEEKENDS", _("Weekends")
        MONDAY_TO_FRIDAY = "MONDAY_TO_FRIDAY", _("Monday to friday")

    type_vehicle = models.CharField(
        max_length=5,
        choices=TypeVehicle.choices,
        default='CAR'
    )

    contact_days = models.JSONField(
        verbose_name="Contact days",
        help_text=_("JSON Array of contact days, ex: [\"monday\", \"tuesday\"]"),
    )

    contact_hour_from = models.TimeField(
        verbose_name=_("Contact hour from"),
    )

    contact_hour_to = models.TimeField(
        verbose_name=_("Contact hour to"),
    )

    year = models.DateField(
        verbose_name=_("Vehicle Year"),
    )

    contract_type = models.CharField(
        max_length=11,
        choices=ContractType.choices,
    )
    status = models.CharField(
        choices=Status.choices,
        max_length=4,
    )

    details = models.TextField(
        blank=True, 
        verbose_name=_("Details"),
    )

    accessories = models.TextField(
        verbose_name=_("Accessories "),
        blank=True, 
    )
    services = models.TextField(
        verbose_name=_("Services to date"),
        blank=True, 
    )

    location_city = models.ForeignKey(
        to="country.City",
        on_delete=models.CASCADE,
        verbose_name=_("Location City"),
        related_name="vehicles",
        blank=True,
        null=True
    )

    location_zone = models.TextField(
        verbose_name=_("Location Zone"),
        blank=True,
    )

    exact_location = models.TextField(
        verbose_name=_("Exact location"),
        blank=True,
    )

    rental_price = models.FloatField(
        verbose_name=_("Rental price of the vehicle"),
        blank=True,
        null=True,
    )

    sale_price = models.FloatField(
        verbose_name=_("Sale price of the vehicle"),
        blank=True, 
        null=True, 
    )

    owner = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        verbose_name=_("Vehicle owner"),
        on_delete=models.CASCADE,
        related_name="vehicles",
    )

    model = models.ForeignKey(
        verbose_name=_("Vehicle Model"),
        to="VehicleModel",
        on_delete=models.CASCADE,
        related_name="vehicles",
    )

    brand = models.ForeignKey(
        verbose_name=_("Vehicle Brand"),
        to="VehicleBrand",
        on_delete=models.CASCADE,
        related_name="vehicles",
    )

    currency = models.ForeignKey(
        verbose_name=_("Currency for prices"),
        to="finance.Currency",
        related_name="+",
        null=True,
        on_delete=models.SET_NULL
    )

    contact_first_name = models.CharField(
        verbose_name=_("Contact First Name"),
        max_length=255,
        blank=True,
    )

    contact_last_name = models.CharField(
        verbose_name=_("Contact Last Name"),
        max_length=255,
        blank=True,
    )

    contact_email = models.EmailField(
        verbose_name=_("Contact Email"),
        blank=True,
    )
    # t = Telephone(...)
    # vehicle.contact_phone_numbers.add(t)
    contact_phone_numbers  = GenericRelation(
        to="misc.Telephone",
        blank=True,
        null=True,
        related_query_name="pub_phone_numbers"
    )

    def __str__(self) -> str:
        return f"{self.model.brand.name} {self.model.name} {self.year}"
