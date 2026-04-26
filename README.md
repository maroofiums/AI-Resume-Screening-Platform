# AetherScreen – AI Resume Screening Platform

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-5.1-green)
![DRF](https://img.shields.io/badge/Django%20REST%20Framework-3.15-red)
![Celery](https://img.shields.io/badge/Celery-5.4-orange)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

**A production-grade AI-powered semantic resume screening SaaS** built with modern Python stack in 2026.

---

## ✨ Features

### For Candidates
- Secure registration & JWT authentication
- Create candidate profile
- Upload resume (PDF/DOCX) with automatic text extraction
- Apply to jobs
- Track application status

### For Employers
- Create, update, and manage job postings
- View all applicants with semantic match scores
- **AI-powered resume screening** using `all-MiniLM-L6-v2`
- Shortlist top candidates based on cosine similarity
- Analytics dashboard (applications per job, shortlist ratio, funnel metrics)
- Export applicants data as CSV

### AI Engine
- Uses **Sentence Transformers** (`all-MiniLM-L6-v2`)
- Semantic matching between resume and job description
- Async processing with **Celery + Redis**
- Configurable similarity threshold

### Tech Stack
- **Backend**: Django 5.1 + Django REST Framework
- **AI**: `sentence-transformers` + `torch` (CPU)
- **Async**: Celery + Redis
- **Database**: PostgreSQL (ready) / SQLite (dev)
- **Deployment**: Docker + Docker Compose + Nginx + Gunicorn
- **Auth**: JWT with refresh tokens + role-based access
- **Documentation**: drf-spectacular (Swagger UI)

---

## 🚀 Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/maroofiums/AI-Resume-Screening-Platform.git
cd AI-Resume-Screening-Platform/aetherscreen
```

### 2. Activate Virtual Environment
```powershell
python -m venv aetherscreen
cd aetherscreen
```

### 3. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 4. Run Migrations
```powershell
python manage.py makemigrations
python manage.py migrate
```

### 5. Run Development Server
```powershell
python manage.py runserver
```

### 6. Start Celery Worker (in separate terminal)
```powershell
celery -A config worker --loglevel=info --pool=solo
```

Open **Swagger UI**: [http://127.0.0.1:8000/api/docs/](http://127.0.0.1:8000/api/docs/)

---

## 🐳 Docker Deployment (Recommended for Production)

```bash
docker-compose up --build
```

Services included:
- Web (Gunicorn)
- Celery Worker
- PostgreSQL
- Redis
- Nginx (reverse proxy)

Access the app at: **http://localhost**

---

## 📋 Test Flow

1. **Register as Candidate** → Create Profile → Upload Resume
2. **Register as Employer** → Create Profile → Post a Job
3. Candidate applies to the job
4. AI screening runs automatically in background
5. Employer views ranked candidates with similarity scores
6. Check analytics at `/api/analytics/`

---

## 📁 Project Structure

```
aetherscreen/
├── config/                 # Django settings, celery, urls
├── users/                  # Custom User + JWT Auth
├── candidates/             # Profile + Resume upload
├── employers/              # Company profile + jobs
├── jobs/                   # Job postings
├── applications/           # Job applications
├── resumes/                # Resume storage & extraction
├── screening/              # AI scoring + Celery tasks
├── analytics/              # Reports & export
├── common/services/        # Reusable services (Extractor, AIScorer)
├── docker/                 # Nginx config
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Technologies Used

- **Backend**: Django 5.1, DRF
- **AI/ML**: sentence-transformers (all-MiniLM-L6-v2)
- **Task Queue**: Celery + Redis
- **Database**: PostgreSQL (production) / SQLite (dev)
- **Deployment**: Docker, Docker Compose, Nginx, Gunicorn
- **Documentation**: drf-spectacular
- **Auth**: djangorestframework-simplejwt

---

## 🔧 Environment Variables

Create `.env` file:

```env
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CELERY_BROKER_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0
```

---

## 📊 Future Enhancements (Bonus)

- Email notifications (Celery + Django email)
- WebSocket live screening progress
- React.js admin dashboard
- Interview scheduling module
- Multi-tenant company support
- pgvector for faster vector search

---

## 📄 License

MIT License – Feel free to use for learning or commercial projects.

---

**Built with ❤️ as a real SaaS product in 2026**

Made by following clean architecture, reusable services, async processing, and production best practices.

---

### How to Contribute
1. Fork the repo
2. Create a feature branch
3. Make changes
4. Submit a Pull Request

---

**Star this repo if you found it helpful!** ⭐

