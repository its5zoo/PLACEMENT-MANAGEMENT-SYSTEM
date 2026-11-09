# TNP Project Audit and Remediation Report

**Audit date:** 9 November 2026  
**Scope:** React/Vite frontend, Express API, MongoDB connectivity and integrity, authentication/authorization, CRUD flows, seed data, API integration, build and lint checks.

## Outcome

The application builds successfully, the backend starts only after MongoDB is ready, and the isolated API smoke suite passes all **37 checks**. The configured `tnp_database` was audited after cleanup with no duplicate applications or orphaned application, drive, company, student, or notification references.

## Fixed anomalies

### Database and startup

- The API previously listened before MongoDB connected; it now awaits the database and fails startup cleanly if the connection cannot be established.
- `/api/health` previously reported `ok` regardless of persistence state; it now returns database-aware `200`/`503` health.
- Added graceful MongoDB disconnection on `SIGINT`/`SIGTERM`.
- Standardized `MONGODB_URI` while retaining `MONGO_URI` compatibility in the connector.
- Added repeatable database audit, index synchronization, and legacy repair commands.
- Rebuilt the application uniqueness indexes as partial indexes so both Job-backed and Drive-backed applications work correctly.
- Linked all five legacy Job records to Company records. One missing directory record (Adobe) was created from its existing Job data.
- Removed three explicitly named `codex-smoke-*` notification fixtures left by failed test attempts.

### Authentication and authorization

- Removed the hard-coded JWT fallback; `JWT_SECRET` must be configured.
- Public registration can no longer request `SUPER_ADMIN`, TNP, or company privileges.
- Registration and student profile updates can no longer write institution-controlled CGPA, attendance, backlog, or placement fields.
- Disabled header-based role impersonation by default. It is available only with `ALLOW_DEMO_AUTH=true` outside production.
- Added active/deleted-account checks during authentication.
- Corrected modern TNP/TNP_ADMIN to legacy TPO/ADMIN authorization compatibility.
- Restricted student placement and student dashboard endpoints to students.
- Restricted company portal endpoints to company accounts and removed the unsafe “first company” fallback.
- Added company ownership checks for drive resubmission, applicant access, shortlisting, and offer release.

### CRUD and business logic

- Added complete Company update/archive and Drive read/update/archive routes.
- Changed Job deletion to a recoverable archive so application references are not orphaned.
- Added soft-delete filtering and hid internal TNP review fields from public drive responses.
- Reworked applications to support either a legacy Job or a Placement Drive reference.
- Fixed duplicate application detection for both reference types.
- Added drive status/deadline and eligibility enforcement during application submission.
- Fixed application filtering for the actual uppercase state machine values.
- Fixed `currentRound` updates writing to a nonexistent field; updates now persist to `currentRoundName`.
- Fixed dashboard counters that searched for `Selected`/`In-Progress` values not used by the main state machine.
- Added offer uniqueness, company ownership, candidate-state checks, and repeated-response protection.
- Added explicit validation for offer actions, TNP review decisions, and document verification states.
- Replaced dangerous mass assignment in company profiles, drive resubmission, placement policy, and student profile updates with field allowlists.
- Improved API errors for invalid IDs, schema validation, and duplicate keys (`400`/`409` instead of generic `500`).

### Notifications

- The Notification service wrote `recipient`, role, type, and priority fields that the schema silently discarded. The schema now persists all targeting metadata.
- Personal notifications are now visible only to their recipient.
- Role notifications are now visible only to the appropriate role.
- Mark-as-read now enforces ownership and returns `404` for inaccessible notifications.

### Seed data and frontend integration

- Seed data now recreates Jobs from Drives and supplies `companyRef`, preventing an empty jobs page after reseeding.
- Seed logging no longer prints the full MongoDB URI.
- Added `VITE_API_BASE_URL` support for deployments where frontend and backend use different origins.
- Frontend API helpers now surface resubmit and shortlist failures instead of treating error JSON as success.
- Frontend production build and TypeScript compilation pass.
- ESLint completes with zero errors. Seven existing exhaustive-dependency warnings remain; see limitations below.

## Verification evidence

| Check | Result |
|---|---:|
| Frontend TypeScript + Vite production build | Pass |
| Frontend ESLint | Pass (0 errors, 7 warnings) |
| Backend JavaScript syntax checks | Pass |
| MongoDB connection to `tnp_database` | Pass |
| MongoDB index synchronization | Pass |
| End-to-end API smoke checks | **37/37 pass** |
| Duplicate applications | 0 |
| Orphan application drive refs | 0 |
| Orphan application student refs | 0 |
| Orphan drive company refs | 0 |
| Orphan notification user refs | 0 |
| Jobs missing company refs | 0 |

The smoke suite creates uniquely marked temporary records and removes them in a `finally` block. It verifies health, unauthenticated rejection, three-role login, privilege-escalation prevention, academic-field protection, public reads, Company/Drive/Job CRUD, Job application and duplicate prevention, application status update, all three dashboards, notification isolation, and notification ownership.

## Commands

```bash
# Frontend
cd frontend
npm run build
npm run lint

# Backend database checks
cd backend
npm run audit:db
npm run db:sync-indexes
npm run db:repair-legacy

# API smoke suite (requires the documented SMOKE_* credentials and a running API)
npm run smoke:api
```

## Remaining limitations and operational notes

- Seven React `exhaustive-deps` warnings remain in existing portal loading effects. They do not fail lint or the production build, but should be addressed during a focused UI refactor with stable callbacks.
- The Vercel configuration builds only the frontend. Production needs a separately hosted Node API and MongoDB, with `VITE_API_BASE_URL`, `CLIENT_URL`, `MONGODB_URI`, and `JWT_SECRET` configured correctly.
- Document uploads are currently JSON/data-URL based with a 25 MB request limit. Production should use object storage, MIME/content inspection, and signed URLs.
- The original worktree already contained many frontend/backend edits and five deleted documentation files (`API.md`, `ARCHITECTURE.md`, `BUSINESS_RULES.md`, `DATABASE.md`, `TESTING.md`). They were preserved as user-owned changes and were not restored.

