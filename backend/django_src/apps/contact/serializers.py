from rest_framework import serializers
from django_src.apps.misc.models import Telephone

class phone_number(serializers.ModelSerializer):
  class Meta:
    model= Telephone
    exclude= ['user','content_type','object_id']
  

#Final serializers

class send_email(serializers.Serializer):
  userId=serializers.IntegerField()
  toEmail = serializers.EmailField()
  name = serializers.CharField()
  lastname = serializers.CharField()
  fromEmail = serializers.CharField() 
  message = serializers.CharField()
  fixedPhone = phone_number(required=False)
  mobilePhone = phone_number(required=False)

class send_consult(serializers.Serializer):
  userId=serializers.IntegerField()
  toEmail = serializers.EmailField()
  name = serializers.CharField()
  lastname = serializers.CharField()
  message = serializers.CharField()
  fixedPhone = phone_number(required=False)
  mobilePhone = phone_number(required=False)

class call_me(serializers.Serializer):
  userId=serializers.IntegerField()
  name = serializers.CharField()
  lastname = serializers.CharField()
  contact_days = serializers.JSONField() #["lunes","martes"....]
  contact_hour_from = serializers.TimeField()
  contact_hour_to = serializers.TimeField()
  fixedPhone = phone_number(required=False)
  mobilePhone = phone_number(required=False)

class visit(serializers.Serializer):
  userId=serializers.IntegerField()
  date = serializers.DateField()
  typeVisit = serializers.CharField()
  message = serializers.CharField()
  contact_hour_from = serializers.TimeField(required=False)
  contact_hour_to = serializers.TimeField(required=False)
  fixedPhone = phone_number(required=False)
  mobilePhone = phone_number(required=False)



  