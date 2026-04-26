from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EmployerProfileViewSet

router = DefaultRouter()
router.register(r'profile', EmployerProfileViewSet, basename='employerprofile')

urlpatterns = [
    path('', include(router.urls)),
]