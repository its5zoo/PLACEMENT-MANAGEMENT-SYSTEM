# API Specification & Contracts Reference

All backend API routes are prefixed under `/api`.

Authentication is handled via JWT tokens in the `Authorization: Bearer <token>` header or `x-acting-role` during development/evaluation (`STUDENT`, `TNP`, `COMPANY`).

---

## 1. Student Placement Endpoints (`/api/student`)

### `GET /api/student/recommendations`
* **Permission:** `STUDENT`
* **Description:** Runs the recommendation engine over all published drives and student metrics.
* **Response (200):**
```json
{
  "success": true,
  "data": {
    "recommended": [
      {
        "driveId": "6ab6...",
        "drive": { "role": "Software Engineer", "companyName": "Google India", "ctc": "24 LPA" },
        "matchPercentage": 95,
        "isEligible": true,
        "reasons": ["CGPA: 8.85 meets cutoff", "No backlogs", "Branch matches CSE"]
      }
    ],
    "eligible": [],
    "nearMatch": [],
    "notEligible": []
  }
}
```

### `GET /api/student/eligibility/explain/:driveId`
* **Permission:** `STUDENT`, `TNP`
* **Description:** Produces a deterministic evaluation breakdown against a specific drive.
* **Response (200):**
```json
{
  "success": true,
  "data": {
    "isEligible": true,
    "matchPercentage": 95,
    "passedChecks": [
      "CGPA: 8.85 meets minimum requirement of 7.50",
      "Active Backlogs: 0 (Permitted: <= 0)",
      "Attendance: 88.0% meets minimum requirement of 75.0%"
    ],
    "failedChecks": [],
    "missingRequirements": [],
    "summary": "Student satisfies all academic and policy requirements."
  }
}
```

### `GET /api/student/readiness`
* **Permission:** `STUDENT`
* **Description:** Computes the student's 6-pillar placement readiness diagnostic score (0-100).
* **Response (200):**
```json
{
  "success": true,
  "data": {
    "totalScore": 88,
    "rating": "Placement Ready",
    "breakdown": [
      { "label": "Academic Standing", "score": 20, "max": 20 },
      { "label": "Profile Completeness", "score": 18, "max": 20 },
      { "label": "Resume & Portfolio", "score": 16, "max": 20 },
      { "label": "Verified Documents", "score": 15, "max": 15 },
      { "label": "Technical Skills", "score": 12, "max": 15 },
      { "label": "Preparation & Attendance", "score": 7, "max": 10 }
    ],
    "nextActions": [
      "Upload 6th Semester Marksheet to verify academic credentials",
      "Add 2 more technical skills to increase skill fit"
    ]
  }
}
```

### `GET /api/student/documents` & `POST /api/student/documents`
* **Permission:** `STUDENT`
* **Upload Payload:** `{ "type": "SEMESTER_MARKSHEET", "fileName": "Sem6_Marksheet.pdf", "fileUrl": "..." }`

### `GET /api/student/offers` & `PUT /api/student/offers/:id/respond`
* **Permission:** `STUDENT`
* **Payload:** `{ "action": "ACCEPT" | "DECLINE", "declineReason": "..." }`

---

## 2. TNP Operations Endpoints (`/api/tnp`)

### `GET /api/tnp/dashboard`
* **Permission:** `TNP`, `TNP_ADMIN`, `SUPER_ADMIN`
* **Description:** Returns executive KPIs, placement funnel, missing link analysis, and drive health.
* **Response (200):**
```json
{
  "success": true,
  "data": {
    "kpis": { "totalStudents": 420, "eligibleStudents": 380, "placedStudents": 112, "placementRate": "29.5%" },
    "funnel": { "applied": 320, "shortlisted": 140, "interviewed": 95, "offers": 38, "accepted": 35 },
    "missingLink": {
      "unresolvedShortlists": 3,
      "unprocessedOffers": 2,
      "description": "3 shortlisted students have pending interview results."
    },
    "driveHealth": [
      { "role": "Cloud Engineer", "company": "Microsoft", "healthScore": 92, "bottleneck": "None" }
    ]
  }
}
```

### `GET /api/tnp/company-requests` & `PUT /api/tnp/company-requests/:id/review`
* **Permission:** `TNP`, `TNP_ADMIN`
* **Review Payload:**
```json
{
  "decision": "APPROVE" | "DECLINE" | "NEEDS_CORRECTION",
  "rejectionReason": "Mandatory if DECLINE",
  "correctionComments": "Required if NEEDS_CORRECTION",
  "internalTnpNotes": "Confidential internal note"
}
```

### `GET /api/tnp/students` & `PUT /api/tnp/students/:id/academics`
* **Permission:** `TNP`, `TNP_ADMIN`
* **Override Payload:** `{ "cgpa": 8.5, "activeBacklogs": 0, "attendancePercentage": 82.0, "placementStatus": "IN_PROCESS" }`

### `GET /api/tnp/documents` & `PUT /api/tnp/documents/:id/verify`
* **Permission:** `TNP`, `TNP_ADMIN`
* **Verification Payload:** `{ "action": "VERIFY" | "REJECT", "rejectionReason": "Blurry copy" }`

### `GET /api/tnp/audit-logs`
* **Permission:** `TNP`, `TNP_ADMIN`, `SUPER_ADMIN`
* **Description:** Returns immutable historical audit trail of all institutional actions.

---

## 3. Company Portal Endpoints (`/api/company`)

### `GET /api/company/dashboard`
* **Permission:** `COMPANY`, `TNP`, `SUPER_ADMIN`
* **Description:** Returns recruiter drive overview, applicant pipeline metrics, and registered company data.

### `POST /api/company/drives`
* **Permission:** `COMPANY`, `TNP_ADMIN`
* **Payload:**
```json
{
  "role": "Full Stack Engineer",
  "ctc": "Rs. 18 LPA",
  "baseSalary": "Rs. 15 LPA",
  "location": "Bengaluru",
  "workMode": "Hybrid",
  "criteria": {
    "minCgpa": 7.0,
    "maxBacklogs": 0,
    "minAttendance": 75.0,
    "allowedBranches": ["CSE", "IT"]
  },
  "submitNow": true
}
```

### `GET /api/company/drives/:id/applicants`
* **Permission:** `COMPANY`, `TNP`
* **Description:** Returns all applicants with calculated profile match percentage, branch, verified CGPA, and status.

### `PUT /api/company/applications/:id/shortlist`
* **Permission:** `COMPANY`, `TNP`
* **Description:** Advances student application status to `SHORTLISTED`.

### `POST /api/company/offers/release`
* **Permission:** `COMPANY`, `TNP`
* **Payload:** `{ "studentId": "...", "driveId": "...", "packageCtc": "Rs. 24 LPA", "baseSalary": "Rs. 20 LPA" }`
