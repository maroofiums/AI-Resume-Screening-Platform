from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from applications.models import Application
from jobs.models import Job

class IsEmployerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['employer', 'admin']

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsEmployerOrAdmin]

    @action(detail=False, methods=['get'])
    def job_stats(self, request):
        """Applications per job with shortlist ratio"""
        jobs = Job.objects.filter(employer__user=request.user)
        data = []
        for job in jobs:
            total_apps = job.applications.count()
            shortlisted = job.applications.filter(status='shortlisted').count()
            avg_score = job.applications.filter(screening_score__isnull=False).aggregate(Avg('screening_score'))['screening_score__avg']
            
            data.append({
                'job_id': job.id,
                'title': job.title,
                'total_applications': total_apps,
                'shortlisted': shortlisted,
                'shortlist_ratio': round(shortlisted / total_apps * 100, 2) if total_apps > 0 else 0,
                'average_score': round(avg_score, 4) if avg_score else None,
            })
        return Response(data)

    @action(detail=False, methods=['get'])
    def funnel_metrics(self, request):
        """Overall funnel metrics"""
        total_applications = Application.objects.filter(job__employer__user=request.user).count()
        screened = Application.objects.filter(
            job__employer__user=request.user, status='screened'
        ).count()
        shortlisted = Application.objects.filter(
            job__employer__user=request.user, status='shortlisted'
        ).count()

        return Response({
            'total_applications': total_applications,
            'screened': screened,
            'shortlisted': shortlisted,
            'shortlist_rate': round(shortlisted / total_applications * 100, 2) if total_applications > 0 else 0,
        })

    @action(detail=False, methods=['get'])
    def threshold_filter(self, request):
        """Filter applications by similarity score threshold"""
        threshold = float(request.query_params.get('threshold', 0.65))
        applications = Application.objects.filter(
            job__employer__user=request.user,
            screening_score__gte=threshold
        ).select_related('candidate', 'job')
        
        from applications.serializers import ApplicationSerializer
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def export_applicants(self, request):
        """Export applicants as CSV"""
        from django.http import HttpResponse
        import csv
        
        threshold = float(request.query_params.get('threshold', 0.0))
        applications = Application.objects.filter(
            job__employer__user=request.user,
            screening_score__gte=threshold
        ).select_related('candidate', 'job')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="applicants.csv"'

        writer = csv.writer(response)
        writer.writerow(['Candidate Name', 'Job Title', 'Score', 'Status', 'Applied At'])

        for app in applications:
            writer.writerow([
                app.candidate.full_name,
                app.job.title,
                app.screening_score,
                app.status,
                app.applied_at.strftime('%Y-%m-%d %H:%M')
            ])
        return response