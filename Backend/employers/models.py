from django.db import models
from users.models import User

class EmployerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer_profile')
    company_name = models.CharField(max_length=255)
    company_website = models.URLField(blank=True, null=True)
    industry = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Employer Profile"
        verbose_name_plural = "Employer Profiles"

    def __str__(self):
        return self.company_name