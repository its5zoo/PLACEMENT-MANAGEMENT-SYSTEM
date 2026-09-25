# Security & Compliance Specification

## 1. Role-Based Access Control (RBAC) Architecture
The system enforces strict multi-tier RBAC across all controllers via `authMiddleware.js`:
* `STUDENT`: Read/write personal profile, view eligible/recommended drives, submit applications, upload own documents, respond to personal offers. Restriced from viewing other candidates' records, modifying academic credentials (CGPA, backlogs, attendance), or accessing recruiter/TNP endpoints.
* `COMPANY`: Create/edit own drives, review applicants applying to their drives, shortlist candidates, release formal offers. Restricted from modifying institutional student profiles, viewing drives of rival companies, or altering TNP approval states.
* `TNP` & `TNP_ADMIN`: Full operational authority over drive reviews, company verification, student academic overrides, document verification, policy parameters, and broadcast announcements.
* `SUPER_ADMIN`: Unrestricted platform access including system-wide audit inspections and database configuration.

---

## 2. Server-Side Enforcement (Never Trust the Client)
1. **Academic Credential Lockdown:** Students cannot edit `cgpa`, `activeBacklogs`, `attendancePercentage`, `branch`, or `placementStatus`. Any attempt to mutate these fields in student profile update endpoints is stripped on the backend. Only TNP Officers can perform academic overrides via `/api/tnp/students/:id/academics`.
2. **Mandatory Rejection Reasons:** 
   - A drive **cannot** be rejected or set to `DECLINE` without a non-empty `rejectionReason` string.
   - A document **cannot** be marked `REJECTED` without an explanatory reason.
   - The backend validates this strictly: if reason is missing, the API rejects the request with HTTP 400 (`REASON_REQUIRED`).
3. **Internal TNP Notes Privacy:** Drives contain an `internalTnpNotes` field. This field is projected out and never serialized when queried by Students or Company recruiters.

---

## 3. Data Protection & Cryptography
* **Password Hashing:** Implemented with `bcryptjs` using 10 salt rounds prior to persistence (`pre('save')` hook). Passwords are never returned in JSON projections (`select: false` or omitted).
* **Token Security:** JWT tokens signed with `JWT_SECRET` with configurable expiration. Refresh token rotation support.
* **NoSQL Injection Defense:** Mongoose schema casting and input validation sanitize parameters to prevent operator injection (`$gt`, `$ne`, etc.).
* **Cross-Site Scripting (XSS) & Header Security:** Express security headers with sanitization of rich-text inputs.

---

## 4. Immutable Audit Trail
* Sensitive actions (approvals, overrides, shortlisting, rejections) call `AuditService.logAction()`.
* Audit log records are stored in a dedicated collection without update or delete endpoints exposed in the API.
