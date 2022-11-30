
from django_typomatic import ts_interface, generate_ts
# Create your views here.
import json
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import Http404

from .serializers import send_email, call_me, send_consult, visit, phone_number

from django.core.mail import send_mail


class sendEmail(APIView):
    def post(self, request, format=None):
        serializer = send_email(data=request.data)
        if serializer.is_valid():
            print('data ',serializer.data)
            phoneData = phone_number(serializer.data["fixedPhone"])
            if "mobilePhone" not in serializer.data:
                print("no exsgdf")
            message = serializer.data["message"]
            toEmail = serializer.data["toEmail"]
            print(message)
            print(toEmail)
            
            return Response(data=serializer.data)
        else:
            return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST) 

class callMe(APIView):
    def post(self, request, format=None):
        serializer = call_me(data=request.data)
        if serializer.is_valid():
            print('data ',serializer.data)
            
            return Response(data=serializer.data)
        else:
            return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST) 

class sendConsult(APIView):
    def post(self, request, format=None):
        serializer = send_consult(data=request.data)
        if serializer.is_valid():
            print('data ',serializer.data)
            phoneData = phone_number(serializer.data["fixedPhone"])
            if "mobilePhone" not in serializer.data:
                print("no exsgdf")
            return Response(data=serializer.data)
        else:
            return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST) 

class visitView(APIView):
    def post(self, request, format=None):
        serializer = visit(data=request.data)
        if serializer.is_valid():
            print('data ',serializer.data)
            phoneData = phone_number(serializer.data["fixedPhone"])
            if "mobilePhone" not in serializer.data:
                print("no exsgdf")
            return Response(data=serializer.data)
        else:
            return Response(data=serializer.errors,status=status.HTTP_400_BAD_REQUEST) 
       
        

    