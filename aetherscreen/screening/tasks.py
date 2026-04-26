from celery import shared_task
from screening.services.ai_scorer import AIScorer
from applications.models import Application
from screening.models import ScreeningResult
from resumes.models import Resume

@shared_task(bind=True, max_retries=3)
def screen_application(self, application_id):
    try:
        application = Application.objects.select_related(
            'job', 'candidate__resume'
        ).get(id=application_id)

        resume = application.candidate.resume
        job_text = application.job.description + " " + application.job.requirements

        # Get or compute embeddings
        if not resume.embedding:
            resume.embedding = AIScorer.get_embedding(resume.extracted_text)
            resume.save()

        job_embedding = AIScorer.get_embedding(job_text)

        score = AIScorer.compute_similarity(resume.embedding, job_embedding)

        # Save screening result
        ScreeningResult.objects.create(
            application=application,
            similarity_score=score,
        )

        # Update application
        application.screening_score = score
        application.status = 'screened' if score >= 0.65 else 'rejected'
        application.save()

        print(f"✅ Screening completed for application {application_id} | Score: {score:.3f}")

    except Exception as exc:
        print(f"❌ Screening failed for {application_id}: {exc}")
        raise self.retry(exc=exc, countdown=60)