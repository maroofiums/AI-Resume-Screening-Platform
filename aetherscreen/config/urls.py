from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Apps
    path('api/users/', include('users.urls')),
    path('api/candidates/', include('candidates.urls')),
    path('api/employers/', include('employers.urls')),

    path('api/jobs/', include('jobs.urls')),
    path('api/applications/', include('applications.urls')),
]