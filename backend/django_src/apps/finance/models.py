from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.

class PaymentInfo(models.Model):
    origin_bank = models.CharField(
        verbose_name=_("Bank of origin"),
        max_length=255,
    )

    origin_bank_country = models.ForeignKey(
        verbose_name=_("Origin bank country"),
        to="country.Country",
        on_delete=models.CASCADE,
        related_name="payment_infos",
    )

    destination_bank = models.CharField(
        verbose_name=_("Destination bank"),
        max_length=255,
        blank=True,
    )

    def __str__(self) -> str:
        return f"{self.origin_bank} {self.destination_bank}"

class Currency(models.Model):
    name = models.CharField(
        verbose_name=_("Currency name"),
        blank=True,
        max_length=255,
    )
    # ISO 4217
    code = models.CharField(
        verbose_name=_("Currency code"),
        blank=True,
        max_length=255,
    )

    country = models.ForeignKey(
        to="country.Country",
        on_delete=models.CASCADE,
        verbose_name=_("Currency country"),
        related_name="currencies",
    )

    class Meta:
        unique_together = ['name', 'code']

    def __str__(self) -> str:
        return f"{self.code} {self.name}"
