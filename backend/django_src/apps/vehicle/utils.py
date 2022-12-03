import base64
from django.core.files.base import ContentFile

def base64ToImageField(image):
        if isinstance(image, str) and image.startswith('data:image'):
            # base64 encoded image - decode
            format, imgstr = image.split(';base64,')  # format ~= data:image/X,
            ext = format.split('/')[-1]  # guess file extension

            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            return data

from django.db.models.fields.files import FileField, ImageFieldFile

def formsetdata_to_dict(formset):
    fields_values = {
        "prefix": formset.prefix
    }

    management_form = formset.management_form

    for field in management_form:
        fields_values[field.html_name] = field.value()

    for form in formset:
        for field in form:
            html_name = field.html_name
            field_value = field.value()
            if isinstance(field_value, ImageFieldFile) or isinstance(field_value, FileField):
                fields_values[html_name] = field_value.url
            else:
                fields_values[html_name] = field_value
    return fields_values
