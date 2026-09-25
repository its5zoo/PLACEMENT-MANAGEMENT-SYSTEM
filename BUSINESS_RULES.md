# Institutional Business Rules & Domain Logic

## 1. Application-Time Eligibility Snapshot
* **The Rule:** When a student submits an application to a placement drive, the system captures an immutable `eligibilitySnapshot` containing:
  - CGPA at time of application
  - Backlog count at time of application
  - Attendance % at time of application
  - Matched skills and evaluated pass/fail verdict
* **Rationale:** Even if the student's CGPA or backlog status changes in subsequent semesters, the historical basis upon which they were deemed eligible for that specific drive remains auditable and reproducible.

---

## 2. Institutional Offer & Placement Freeze Policy
* **Policy Settings (`PlacementPolicy`):**
  - `allowMultipleOffers`: If `false`, accepting an offer immediately locks the student profile into `OFFER_ACCEPTED` or `PLACED`.
  - `allowOfferUpgrade`: Configures whether a placed student can apply for a "Dream Company" tier (e.g. CTC $\ge 1.5\times$ existing package).
  - `placementFreezeOnAcceptance`: When enabled, accepting an offer automatically withdraws active pending applications and disables the "Apply" action across all active drives.

---

## 3. Explainable Eligibility & Deficit Clarity
* The system rejects opaque decisions. For every candidate-drive pair:
  - If Eligible: Returns exact thresholds cleared (e.g., `CGPA: 8.85 >= 7.50`, `Attendance: 88% >= 75%`).
  - If Ineligible: Clearly explains the deficits (e.g., `Required CGPA: 7.5, Current: 6.94`, `Active backlogs exceed limit`).

---

## 4. Drive Approval & Correction Loop
* **Approve:** Drive moves to `APPROVED` and can be published to students.
* **Needs Correction:** TNP supplies feedback (e.g., "Clarify selection rounds and base salary"). Company edits and resubmits without having to recreate the drive.
* **Decline:** Strictly requires an institutional justification (`rejectionReason`). Stored in immutable audit logs and communicated to the recruiter.

---

## 5. Document Verification Workflow
* Digital paperwork (Semester Marksheets, Identity Proofs, Degree Certificates) transitions through:
  `UPLOADED` $\to$ `UNDER_REVIEW` $\to$ `VERIFIED` or `REJECTED`.
* Rejection mandates a reason (e.g., "Illegible scan, seal missing"), prompting the student to submit a corrected version (`REPLACEMENT_REQUIRED`).
