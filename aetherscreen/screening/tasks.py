from celery import shared_task
from applications.models import Application
from screening.models import ScreeningResult
from resumes.models import Resume
# Import inside the task to avoid import-time loading
from screening.services.ai_scorer import AIScorer

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def screen_application(self, application_id: int):
    """Async AI Resume Screening Task"""
    try:
        application = Application.objects.select_related(
            'job', 'candidate__resume'
        ).get(id=application_id)

        resume = application.candidate.resume
        if not resume or not resume.extracted_text:
            print(f"❌ No resume text for application {application_id}")
            return

        job_text = f"{application.job.description} {application.job.requirements or ''}"

        # Compute embeddings
        resume_embedding = resume.embedding or AIScorer.get_embedding(resume.extracted_text)
        if not resume.embedding:
            resume.embedding = resume_embedding
            resume.save(update_fields=['embedding'])

        job_embedding = AIScorer.get_embedding(job_text)
        score = AIScorer.compute_similarity(resume_embedding, job_embedding)

        # Save result
        ScreeningResult.objects.create(
            application=application,
            similarity_score=score,
        )

        application.screening_score = score
        application.status = 'screened' if score >= 0.65 else 'rejected'
        application.save()

        print(f"✅ Screening done | App {application_id} | Score: {score:.4f}")

    except Exception as exc:
        print(f"❌ Screening error for {application_id}: {exc}")
        raise self.retry(exc=exc)