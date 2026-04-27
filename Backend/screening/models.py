from django.db import models
from applications.models import Application

class ScreeningResult(models.Model):
    application = models.OneToOneField(
        Application, 
        on_delete=models.CASCADE, 
        related_name='screening_result'
    )
    similarity_score = models.FloatField()
    ranked_position = models.PositiveIntegerField(null=True, blank=True)
    computed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-similarity_score']

    def __str__(self):
        return f"Score: {self.similarity_score:.2f} - {self.application}"