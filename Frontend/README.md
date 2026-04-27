# AetherScreen - Frontend

Premium React frontend for the **AetherScreen** AI Resume Screening Platform.
Consumes a Django REST Framework backend (JWT auth) and ships with role-based
dashboards for **candidates**, **employers**, and **admins**.

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS + shadcn/ui (custom themed design system, dark mode)
- React Router v6 (role-protected routes)
- React Query (server state) + Axios (JWT interceptor + auto-refresh)
- Zustand (auth & theme stores, persisted)
- React Hook Form + Zod (typed forms & validation)
- Recharts (analytics) · Framer Motion (animations) · Sonner (toasts)

## Getting started

```bash
# 1. install deps
bun install        # or: npm install

# 2. point at your Django backend (defaults to http://localhost:8000)
cp .env.example .env

# 3. run dev server
bun dev            # or: npm run dev
```

## Backend contract

Set `VITE_API_BASE_URL` in `.env`. Endpoints consumed:

| Area          | Endpoints |
|---------------|-----------|
| Auth          | `POST /api/users/register/`, `POST /api/users/login/`, `POST /api/token/refresh/` |
| Candidates    | `/api/candidates/profile/`, `/api/candidates/profile/{id}/`, `POST /api/candidates/resume/upload/` |
| Employers     | `/api/employers/profile/`, `/api/employers/profile/{id}/` |
| Jobs          | `GET/POST /api/jobs/`, `GET/PUT/PATCH/DELETE /api/jobs/{id}/` |
| Applications  | `GET/POST /api/applications/`, `GET/PATCH/DELETE /api/applications/{id}/` |
| Analytics     | `/api/analytics/funnel_metrics/`, `job_stats/`, `threshold_filter/`, `export_applicants/` |

### Login response shape

The login endpoint must return:

```json
{ "access": "...", "refresh": "...", "user": { "id": 1, "username": "...", "email": "...", "role": "candidate" } }
```

`role` must be one of `candidate | employer | admin` - used for routing.

## Project structure

```
src/
  components/      Reusable UI (StatCard, EmptyState, StatusBadge, …)
  layouts/         AuthLayout, DashboardLayout + role layouts
  pages/           Landing, Login, Register, candidate/, employer/, admin/
  services/        Axios instance + typed API services
  store/           Zustand stores (auth, theme)
  hooks/           Reusable hooks
  utils/           config + shared helpers
```

## Routes

- `/` Landing
- `/login`, `/register`
- `/candidate/*` - candidate dashboard (protected)
- `/employer/*` - employer dashboard (protected)
- `/admin/*` - admin dashboard (protected)
- `*` - beautiful 404

Built with ✦ by the AetherScreen team.
