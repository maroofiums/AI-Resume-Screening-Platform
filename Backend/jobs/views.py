from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Job
from .serializers import JobSerializer

class IsEmployer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'employer'

class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'title']
    filterset_fields = ['location', 'is_active']

    def get_queryset(self):
        if self.request.user.role == 'employer':
            return Job.objects.filter(employer__user=self.request.user)
        return Job.objects.filter(is_active=True)

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEmployer()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        employer_profile = self.request.user.employer_profile
        serializer.save(employer=employer_profile)