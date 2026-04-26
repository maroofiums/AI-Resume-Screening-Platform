from rest_framework import serializers
from .models import EmployerProfile

class EmployerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployerProfile
        fields = ['id', 'company_name', 'company_website', 'industry', 'location', 'description']
        read_only_fields = ['user']