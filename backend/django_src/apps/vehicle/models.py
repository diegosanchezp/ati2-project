from django.db import models
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Vehicle(models.Model):
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

    contact_days = models.CharField(
        verbose_name=_("Contact days"),
        choices=ContactDays.choices,
        max_length=16
    )

    contact_hour_from = models.TimeField(
        verbose_name=_("Contact hour from"),
    )

    contact_hour_to = models.TimeField(
        verbose_name=_("Contact hour to"),
    )

    year = models.DateField()

    contract_type = models.CharField(
        max_length=11,
        choices=ContractType.choices,
    )
    status = models.CharField(
        choices=Status.choices,
        max_length=4
    )

    details = models.TextField(
        blank=True,
        verbose_name=_("Details"),
    )
    accessories = models.TextField(
        verbose_name=_("Accessories "),
        blank=True
    )
    services = models.TextField(
        verbose_name=_("Services to date"),
        blank=True
    )
    contact_days = models.JSONField(
        verbose_name="Contact days",
    )
    exact_location = models.TextField(
        verbose_name=_("Exact location"),
        blank=True
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
    currency = models.CharField(
        verbose_name=_("Currency for prices"),
        max_length=3
    )
    user_contact = models.ForeignKey(
        to=settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="vehicles",
    )

    # TODO
    # currency = models.OneToOneField(
    #     to="",
    #     on_delete=models.SET_NULL
    # )
