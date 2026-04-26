from rest_framework import viewsets, permissions
from .models import EmployerProfile
from .serializers import EmployerProfileSerializer

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employer'

class EmployerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = EmployerProfileSerializer
    permission_classes = [IsEmployer]

    def get_queryset(self):
        return EmployerProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)