import base64
from django.core.files.base import ContentFile

def base64ToImageField(image):
        if isinstance(image, str) and image.startswith('data:image'):
            # base64 encoded image - decode
            format, imgstr = image.split(';base64,')  # format ~= data:image/X,
            ext = format.split('/')[-1]  # guess file extension

            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
            return data