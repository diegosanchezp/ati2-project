from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.response import Response

from django.core.mail import send_mail

from drf_spectacular.utils import extend_schema

# Create your views here.

class SendMailReq(serializers.Serializer):
    message = serializers.CharField()
    firstname_lastname = serializers.CharField()
    to_mail = serializers.EmailField()

class SendMailView(APIView):
    """
    Send a simple text email
    """

    @extend_schema(
        request=SendMailReq,
        auth=None,
    )
    def post(self, request, format=None):
        req_body = SendMailReq(data=request.data)
        req_body.is_valid(raise_exception=True)
        req_data = req_body.data

        send_mail(
            subject=f'Mensaje de {req_data["firstname_lastname"]}',
            message=req_data["message"],
            from_email='contact@company.com',
            recipient_list=[req_data["to_mail"]],
        )

        return Response(data={"message": "Email sent"})
