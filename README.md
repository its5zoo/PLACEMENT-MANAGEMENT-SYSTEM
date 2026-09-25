# Institutional Placement Management System (PMS) — MERN Stack Ecosystem

A production-grade, multi-sided institutional **Placement Management System (PMS)** built on the **MERN** stack (MongoDB, Express.js, React 19, Node.js) governing the complete university recruitment lifecycle across three connected domains:
1. **🎓 Student Placement Portal**: Explainable eligibility checks, smart high-fit recommendations, 6-pillar placement readiness diagnostic, paperless document verification, application pipeline, and formal offer management.
2. **🏛️ TNP (Training & Placement) Cell Command Center**: Central institutional control layer for reviewing company drive requests with mandatory rejection reasons, live placement funnel analytics, missing-link bottleneck investigation, drive health monitoring, student academic overrides, placement policy configuration, and immutable audit logs.
3. **🏢 Company / Corporate Recruiter Portal**: Talent acquisition workflow for posting multi-stage campus drives, setting deterministic cutoff criteria, reviewing applicants by profile fit percentage, shortlisting candidates, and releasing formal digital job offers.

---

## 📚 Technical Documentation Suite
- **[ARCHITECTURE.md](file:///c:/Users/MDFAIZAANRAZAKHAN/Downloads/TNP%20project/ARCHITECTURE.md)**: Architectural blueprint, layers, engines, component hierarchy, and services.
- **[DATABASE.md](file:///c:/Users/MDFAIZAANRAZAKHAN/Downloads/TNP%20project/DATABASE.md)**: Schemas, compound indexes, constraints, relationships, and state machines.
- **[API.md](file:///c:/Users/MDFAIZAANRAZAKHAN/Downloads/TNP%20project/API.md)**: Complete RESTful contracts, payloads, and permission specifications.
- **[SECURITY.md](file:///c:/Users/MDFAIZAANRAZAKHAN/Downloads/TNP%20project/SECURITY.md)**: RBAC enforcement, server-side parameter protection, cryptography, and immutable audit trails.
- **[BUSINESS_RULES.md](file:///c:/Users/MDFAIZAANRAZAKHAN/Downloads/TNP%20project/BUSINESS_RULES.md)**: Application-time snapshots, placement freeze policies, and verification lifecycles.
- **[TESTING.md](file:///c:/Users/MDFAIZAANRAZAKHAN/Downloads/TNP%20project/TESTING.md)**: Verification guides, build tests, and automated API suite.

---

## 🏗️ Architecture & Technology Stack
- **Frontend**: React 19, TypeScript, Vite v8, Lucide Icons, Vanilla CSS design system
- **Backend**: Node.js (v24), Express.js (v4), Mongoose (v8), JWT Authentication, bcryptjs
- **Database**: MongoDB (Local `127.0.0.1:27017` with `tnp_database`)

---

## 🚀 Running the Project

### 1. Start MongoDB
Ensure the MongoDB server is running (default `mongodb://127.0.0.1:27017/tnp_database`).

### 2. Populate Database (Seed Data)
To seed initial companies, campus jobs, student profile, and applications:
```bash
npm run seed
# or
cd backend && npm run seed
```

### 3. Start Backend Server
```bash
npm run server
# or
cd backend && npm run dev
```
Backend runs on **http://localhost:5000** (API base: `http://localhost:5000/api`).

### 4. Start Frontend
In a separate terminal:
```bash
npm run client
# or
cd frontend && npm run dev
```
Frontend runs on **http://localhost:5173**.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status check |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user & return JWT token |
| `GET` | `/api/auth/me` | Current authenticated user profile |
| `PUT` | `/api/auth/profile` | Update profile information |
| `GET` | `/api/jobs` | Get all active campus job openings |
| `GET` | `/api/jobs/:id` | Get single job details |
| `POST` | `/api/applications/apply` | Apply to a campus job |
| `GET` | `/api/applications/my` | Get current student applications |
| `GET` | `/api/companies` | Get recruiting companies list |
| `GET` | `/api/stats/dashboard` | Dashboard metrics (Applied, In Progress, Offers) |
| `GET` | `/api/notifications` | Get placement alerts & notifications |
| `PUT` | `/api/notifications/:id/read` | Mark alert as read |
| `GET` | `/api/drives` | Placement drive schedules |
