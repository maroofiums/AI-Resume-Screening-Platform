from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CandidateProfileViewSet, ResumeUploadView

router = DefaultRouter()
router.register(r'profile', CandidateProfileViewSet, basename='candidateprofile')

urlpatterns = [
    path('', include(router.urls)),
    path('resume/upload/', ResumeUploadView.as_view(), name='resume-upload'),
]