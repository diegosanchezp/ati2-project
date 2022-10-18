from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    """
    Custom user that fits our needs
    """

    class Types(models.TextChoices):
        """
        User type enumeration
        """
        NATURAL = 'NATURAL', _("Natural")
        ENTERPRISE = 'ENTERPRISE', _("Enterprise")

    email = models.EmailField(_('email address'), unique=True)
    user_type = models.TextField(
        choices=Types.choices,
    )

    # Preferred language
    class Lang(models.TextChoices):
        ES = "ES", "Español"
        EN = "EN", "English"

    language = models.CharField(
        max_length=5,
        choices=Lang.choices,
        default=Lang.ES
    )

    keep_informed = models.BooleanField(
        default=False,
    )

class NaturalPerson(models.Model):
    """
    Used when registering as Natural person
    """
    user = models.OneToOneField(
        to="User",
        on_delete=models.CASCADE,
        related_name="natural_person",
    )
    # cedula/pasaporte/DNI
    id_code = models.TextField(
        unique=True,
        verbose_name=_("Personal Identification code")
    )
    email = models.EmailField(unique=True)

    # country = 
    def __str__(self) -> str:
        return f"{self.id_code} {self.user.first_name}"
    # country =  # Foreing Key
