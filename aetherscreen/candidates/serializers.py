from rest_framework import serializers
from .models import CandidateProfile
from resumes.models import Resume

class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = ['id', 'full_name', 'phone', 'location', 'linkedin_url', 'bio', 'created_at']
        read_only_fields = ['user']


class ResumeUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['file']