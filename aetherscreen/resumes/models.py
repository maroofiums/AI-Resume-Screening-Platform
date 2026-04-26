from django.db import models
from candidates.models import CandidateProfile

class Resume(models.Model):
    candidate = models.OneToOneField(
        CandidateProfile, 
        on_delete=models.CASCADE, 
        related_name='resume'
    )
    file = models.FileField(
        upload_to='resumes/%Y/%m/%d/',
        help_text="PDF or DOCX only"
    )
    extracted_text = models.TextField(blank=True)
    embedding = models.JSONField(null=True, blank=True)  # Will store list of floats
    file_size = models.PositiveIntegerField(null=True, blank=True)  # in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        return f"Resume of {self.candidate.full_name}"