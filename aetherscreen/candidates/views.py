from rest_framework import viewsets, status, permissions, generics
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from .models import CandidateProfile
from .serializers import CandidateProfileSerializer, ResumeUploadSerializer
from resumes.models import Resume
from common.services.resume_extractor import ResumeExtractor


class IsCandidate(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'candidate'


class CandidateProfileViewSet(viewsets.ModelViewSet):
    serializer_class = CandidateProfileSerializer
    permission_classes = [IsCandidate]

    def get_queryset(self):
        return CandidateProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResumeUploadView(generics.CreateAPIView):
    serializer_class = ResumeUploadSerializer
    permission_classes = [IsCandidate]
    parser_classes = (MultiPartParser, FormParser)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        candidate_profile = get_object_or_404(CandidateProfile, user=request.user)
        
        resume = serializer.save(candidate=candidate_profile)
        
        try:
            extracted_text = ResumeExtractor.extract_text(resume.file.path)
            resume.extracted_text = extracted_text
            resume.file_size = resume.file.size
            resume.save()
            
            return Response({
                "message": "Resume uploaded and text extracted successfully",
                "extracted_text_length": len(extracted_text) if extracted_text else 0,
                "resume_id": resume.id
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            resume.file_size = resume.file.size
            resume.save()
            return Response({
                "message": "Resume uploaded but text extraction failed",
                "warning": str(e),
                "resume_id": resume.id
            }, status=status.HTTP_201_CREATED)