from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.
class Country(models.Model):
    name = models.CharField(
        verbose_name=_("Name"),
        max_length=100
    )

    iso3 = models.CharField(
        verbose_name=_("iso3 abbreviation code"),
        max_length=3,
        blank=True,
    )

    numeric_code = models.CharField(
        verbose_name=_("Numeric code "),
        max_length=100,
        blank=True,
    )

    iso2 = models.CharField(
        verbose_name=_("iso2 abbreviation"),
        max_length=2,
        blank=True,
    )

    phonecode = models.CharField(
        verbose_name=_("Phone code "),
        max_length=255,
        blank=True,
    )

    capital = models.CharField(
        max_length=255,
        blank=True,
    )

    # Continent
    continent=models.CharField(
        verbose_name=_("Continent"),
        max_length=255,
        blank=True,
    )

    subregion=models.CharField(
        verbose_name=_("Sub region"),
        max_length=255,
        blank=True,
    )
    def __str__(self) -> str:
        return f"{self.continent} > {self.name}"

class State(models.Model):

    name = models.CharField(
        verbose_name=_("Name"),
        max_length=255,
    )

    iso2 = models.CharField(
        verbose_name=_("iso2 abbreviation"),
        max_length=255,
        blank=True,
    )
    country = models.ForeignKey(
        to="Country",
        verbose_name=_("Country"),
        on_delete=models.CASCADE,
        related_name="states",
    )

    def __str__(self) -> str:
        return f"{self.country.name} > {self.name}"

class City(models.Model):

    name = models.CharField(
        verbose_name=_("Name"),
        max_length=255,
    )

    state = models.ForeignKey(
        to="State",
        verbose_name=_("City"),
        on_delete=models.CASCADE,
        related_name="cities",
    )

    def __str__(self) -> str:
        return f"{self.state.country.name} > {self.state.name} > {self.name}"
