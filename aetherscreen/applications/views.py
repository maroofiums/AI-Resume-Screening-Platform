from rest_framework import viewsets, permissions
from .models import Application
from .serializers import ApplicationSerializer
from screening.tasks import screen_application

class IsCandidateOrEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    permission_classes = [IsCandidateOrEmployer]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'candidate':
            return Application.objects.filter(candidate__user=user)
        elif user.role == 'employer':
            return Application.objects.filter(job__employer__user=user)
        return Application.objects.none()

    def perform_create(self, serializer):
        candidate_profile = self.request.user.candidate_profile
        application = serializer.save(candidate=candidate_profile)
        
        # Trigger AI screening asynchronously
        screen_application.delay(application.id)
        
        return application