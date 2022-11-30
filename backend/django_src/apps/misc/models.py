from django.db import models
#from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation

# Create your models here.
class SocialMedia(models.Model):
    name = models.TextField(
        verbose_name=_("Nombre"),
        unique=True)
    object_id = models.CharField(max_length=255)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    belongs_to = models.CharField(max_length=255, null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

class Medios(models.Model):
    """
    Medio por el cual se puede mantener informado
    un usuario registrado
    """

    class Types(models.TextChoices):
        EMAIL = "EMAIL" ,_("Email")
        SOCIAL_MEDIA_EMPRESA = "SOCIAL_MEDIA_EMPRESA", _("Corporate e-mail")
        MY_SOCIAL_MEDIA = "MY_SOCIAL_MEDIA", _("My social media")
        TEXT_MESSAGE = "TEXT_MESSAGE", _("Text message")
        OTHER = "OTHER", _("Other")
        FB_PRIVATE_MESSAGE= "FB_PRIVATE_MESSAGE", _("Facebook Private Message")

    name = models.CharField(
        max_length=255,
        choices=Types.choices,
    )

    frequency = models.ForeignKey(
        to="Frequency",
        on_delete=models.CASCADE,
        related_name="medios"
    )

    # Use this field for the value of
    # Email
    # Mensaje de texto, Otro(s)
    # Mensaje privado en mi cuenta de Facebook
    value = models.TextField(
        verbose_name=_("Value of informed medium")
    )

    # Reverse relation
    # Redes sociales de la empresa
    social_media = GenericRelation(
        to="misc.SocialMedia",
        blank=True,
        null=True,
        related_query_name="social_media"
    )

    @property
    def my_socialmedia(self):
        return self.social_media.filter(belongs_to=self.Types.MY_SOCIAL_MEDIA)

    @property
    def empresa_socialmedia(self):
        return self.social_media.filter(belongs_to=self.Types.SOCIAL_MEDIA_EMPRESA)

class Frequency(models.Model):
    time = models.DurationField()
    user = models.OneToOneField(
        on_delete=models.CASCADE,
        to=settings.AUTH_USER_MODEL,
        related_name="frequencies",
    )

    def __str__(self) -> str:
        return f"{self.user.email} - {self.time}"

class Telephone(models.Model): 
    """
    Phone Numbers
    """

    # class ScopeChoice(models.TextChoices):
    #     NATURAL_PERSON = "NATURAL_PERSON", _("Natural person")
    #     VEHICLE_PUBLICATION = "VEHICLE_PUBLICATION", _("Vehiclepublication")

    class PType(models.TextChoices):
        FIXED = "FIXED", _("Fixed phone number")
        MOBILE = "MOBILE", _("Mobile phone number")

    number = models.CharField(max_length=255)
    user = models.ForeignKey(
        on_delete=models.CASCADE,
        to=settings.AUTH_USER_MODEL,
        related_name="phone_numbers",
    )

    # belongs_to = models.CharField(
    #     max_length=255,
    #     blank=True,
    #     choices=ScopeChoice.choices,
    #     default=ScopeChoice.NATURAL_PERSON,
    # )


    country_number = models.IntegerField()
    ext = models.CharField(max_length=255, blank=True)
    ptype = models.CharField(
        max_length=255,
        choices=PType.choices,
    )

    object_id = models.CharField(max_length=255)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    content_object = GenericForeignKey(
        'content_type',
        'object_id'
    )

    # @property
    # def natural_person_phones(self):
    #     return self.objects.filter(scope=self.ScopeChoice.NATURAL_PERSON)
    #
    # @property
    # def vehicle_publication_phones(self):
    #     return self.objects.filter(scope=self.ScopeChoice.VEHICLE_PUBLICATION)


    def __str__(self) -> str:
        return f"{self.ptype} {self.country_number} - {self.number}"
    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]

class Empresa(models.Model):
    """
    """
    name=models.CharField(
        verbose_name=_("Name of the company"),
        max_length=255,
    )
    # direccion
    address=models.TextField(
        verbose_name=_("Address")
    )

    # todo
    # country, city

    rif = models.CharField(max_length=255)
    representate = models.OneToOneField(
        verbose_name=_("representative"),
        on_delete=models.CASCADE,
        to=settings.AUTH_USER_MODEL,
        related_name="empresa",
    )

    def __str__(self) -> str:
        return f"{self.name} - {self.rif}"

# class Service(models.Model):
#     """
#     """
#     name = models.TextField()
