from django.db import models
from jobs.models import Job
from candidates.models import CandidateProfile

class Application(models.Model):
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('screened', 'Screened'),
        ('shortlisted', 'Shortlisted'),
        ('rejected', 'Rejected'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    candidate = models.ForeignKey(
        CandidateProfile, 
        on_delete=models.CASCADE, 
        related_name='applications'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    applied_at = models.DateTimeField(auto_now_add=True)
    screening_score = models.FloatField(null=True, blank=True)
    shortlisted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('job', 'candidate')
        ordering = ['-applied_at']

    def __str__(self):
        return f"{self.candidate.full_name} → {self.job.title}"