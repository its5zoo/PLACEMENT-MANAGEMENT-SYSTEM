from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.style import WD_STYLE_TYPE

OUT = r"C:\Users\MDFAIZAANRAZAKHAN\Downloads\TNP project\TNP_Backend_Deep_Dive_Guide.docx"

doc = Document()
sec = doc.sections[0]
sec.top_margin = Inches(0.7)
sec.bottom_margin = Inches(0.7)
sec.left_margin = Inches(0.75)
sec.right_margin = Inches(0.75)

styles = doc.styles
styles['Normal'].font.name = 'Aptos'
styles['Normal']._element.rPr.rFonts.set(qn('w:ascii'), 'Aptos')
styles['Normal'].font.size = Pt(10.5)
styles['Normal'].paragraph_format.space_after = Pt(6)
for name, size in [('Title', 24), ('Heading 1', 16), ('Heading 2', 12), ('Heading 3', 11)]:
    styles[name].font.name = 'Aptos Display' if name != 'Normal' else 'Aptos'
    styles[name]._element.rPr.rFonts.set(qn('w:ascii'), styles[name].font.name)
    styles[name].font.size = Pt(size)
    styles[name].font.color.rgb = RGBColor(0, 0, 0)

code_style = styles.add_style('Code Block', WD_STYLE_TYPE.PARAGRAPH)
code_style.font.name = 'Consolas'
code_style._element.rPr.rFonts.set(qn('w:ascii'), 'Consolas')
code_style.font.size = Pt(8.5)
code_style.paragraph_format.space_before = Pt(4)
code_style.paragraph_format.space_after = Pt(6)
code_style.paragraph_format.left_indent = Inches(0.18)

def shade(cell, color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:fill'), color)
    tc_pr.append(shd)

def set_cell_text(cell, text, bold=False, color=None):
    cell.text = ''
    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(0)
    r = p.add_run(str(text))
    r.bold = bold
    r.font.size = Pt(8.5)
    if color:
        r.font.color.rgb = RGBColor(*color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER

def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers))
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    t.style = 'Table Grid'
    for i, h in enumerate(headers):
        set_cell_text(t.rows[0].cells[i], h, True, (255, 255, 255))
        shade(t.rows[0].cells[i], '1F4E78')
        if widths: t.rows[0].cells[i].width = Inches(widths[i])
    for ri, row in enumerate(rows):
        cells = t.add_row().cells
        for i, value in enumerate(row):
            set_cell_text(cells[i], value)
            if ri % 2 == 1: shade(cells[i], 'EAF2F8')
            if widths: cells[i].width = Inches(widths[i])
    doc.add_paragraph().paragraph_format.space_after = Pt(3)
    return t

def para(text='', style=None, bold_lead=None):
    p = doc.add_paragraph(style=style)
    if bold_lead and text.startswith(bold_lead):
        p.add_run(bold_lead).bold = True
        p.add_run(text[len(bold_lead):])
    else:
        p.add_run(text)
    return p

def bullets(items, level=0):
    for item in items:
        p = doc.add_paragraph(style='List Bullet' if level == 0 else 'List Bullet 2')
        p.add_run(item)

def code(lines):
    p = doc.add_paragraph(style='Code Block')
    p.add_run(lines)

def page_break():
    doc.add_page_break()

# Cover
p = doc.add_paragraph(style='Title')
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run('TNP Backend Deep Dive Guide')
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = p.add_run('Training and Placement Management System')
r.bold = True; r.font.size = Pt(14)
p = doc.add_paragraph()
p.alignment = WD_ALIGN_PARAGRAPH.CENTER
p.add_run('Backend architecture, APIs, database, workflows, security, and presentation notes').italic = True
doc.add_paragraph()
table(['Use this guide for', 'What it gives you'], [
    ('Project understanding', 'How every backend folder, route, controller, model, and service fits together.'),
    ('PPT preparation', 'Architecture narrative, request flows, role matrix, and slide-ready talking points.'),
    ('Report preparation', 'Technology rationale, database design, workflow descriptions, and test evidence.'),
], [2.0, 4.9])
para('Main conclusion: this is a modular Express and MongoDB backend for three users - Student, TNP Cell, and Company Recruiter. It manages the full placement lifecycle from company drive creation and eligibility to application, shortlisting, offer response, document verification, policy control, notifications, and audit records.')
page_break()

doc.add_heading('1 Backend at a Glance', level=1)
para('The backend is a Node.js ES module application. Express exposes REST endpoints, Mongoose maps JavaScript objects to MongoDB collections, JWT identifies users, and bcrypt securely stores passwords. The code separates HTTP routing, controller logic, database models, reusable business services, and middleware.')
table(['Layer', 'Responsibility', 'Main location'], [
    ('Server', 'Creates Express app, installs middleware, mounts routes, reports health, starts after MongoDB connects.', 'src/server.js'),
    ('Routes', 'Maps HTTP method and URL to controller functions; attaches authentication and role checks.', 'src/routes'),
    ('Controllers', 'Implements request handling, validation, queries, responses, and workflow transitions.', 'src/controllers'),
    ('Models', 'Defines MongoDB collections, field types, constraints, references, enums, indexes, and timestamps.', 'src/models'),
    ('Services', 'Contains reusable logic for eligibility, recommendations, readiness, notifications, audits, and identity parsing.', 'src/services'),
    ('Middleware', 'Performs JWT authentication, RBAC authorization, 404 handling, and standardized error responses.', 'src/middleware'),
    ('Scripts', 'Seed data, DB integrity audit, index synchronization, legacy repair, and end-to-end smoke tests.', 'scripts and src/seed'),
], [1.0, 4.2, 1.7])

doc.add_heading('2 Dependencies and Why They Are Used', level=1)
table(['Package', 'Why it exists in this backend', 'Where it is used'], [
    ('express', 'HTTP server and REST routing framework.', 'server.js and all route files'),
    ('mongoose', 'MongoDB connection, schema definition, validation, indexes, populate, and queries.', 'config/db.js, models, controllers'),
    ('jsonwebtoken', 'Signs login tokens and verifies Bearer tokens on protected requests.', 'authController.js, authMiddleware.js'),
    ('bcryptjs', 'Hashes passwords before saving and compares login passwords safely.', 'models/User.js'),
    ('dotenv', 'Reads environment variables from backend/.env.', 'server.js and scripts'),
    ('cors', 'Limits browser calls to configured CLIENT_URL origins.', 'server.js'),
    ('morgan', 'Logs API requests during non-production development.', 'server.js'),
], [1.1, 4.45, 1.35])
para('There is no ORM other than Mongoose, no separate cache layer, no message queue, and no file-storage SDK. Documents are currently represented by a file URL/data URL string in MongoDB metadata.')

doc.add_heading('3 Folder Map', level=1)
code('backend/\n  src/\n    config/db.js                 MongoDB connector\n    server.js                    App bootstrap and route mounting\n    middleware/                  protect authorize error handling\n    models/                      13 MongoDB data models\n    routes/                      URL and middleware definitions\n    controllers/                 endpoint behavior\n    services/                    reusable domain logic\n    seed/seedData.js             demo database population\n  scripts/                       audit indexes migration smoke tests')
page_break()

doc.add_heading('4 Startup and Request Lifecycle', level=1)
para('When npm start runs, server.js loads .env, creates the Express application, configures CORS, JSON parsing and request logging, declares the health endpoint, mounts API routers, then installs error handlers. startServer waits for connectDB before opening the network port. This prevents an API from claiming success when MongoDB is unavailable.')
code('Client request\n  -> Express middleware (CORS, JSON parser, morgan)\n  -> Route match (/api/... )\n  -> protect middleware (verify Bearer JWT)\n  -> authorize middleware (role check where required)\n  -> Controller\n  -> Mongoose model query/create/update\n  -> Optional service call (eligibility, notification, audit)\n  -> JSON response\n  -> notFound/errorHandler if any step fails')

doc.add_heading('Health Endpoint', level=2)
para('GET /api/health checks mongoose.connection.readyState. It returns HTTP 200 with database connected when MongoDB is available, otherwise HTTP 503 with degraded status. This is useful for deployment health checks.')

doc.add_heading('4.1 Environment Variables', level=2)
table(['Variable', 'Purpose', 'Example / note'], [
    ('PORT', 'Backend listening port.', '5000 by default'),
    ('MONGODB_URI', 'Primary MongoDB connection string.', 'mongodb://127.0.0.1:27017/tnp_database'),
    ('MONGO_URI', 'Legacy compatible fallback name.', 'Use MONGODB_URI for new setup'),
    ('JWT_SECRET', 'Required secret used to sign and verify access tokens.', 'Keep private and long'),
    ('CLIENT_URL', 'Comma-separated allowed browser origins for CORS.', 'http://localhost:5173'),
    ('ALLOW_DEMO_AUTH', 'Optional development-only role-header demo mode.', 'false by default; never use in production'),
    ('NODE_ENV', 'Controls production behavior and request logging.', 'production or development'),
], [1.35, 3.6, 1.95])

doc.add_heading('5 Authentication and Role Based Access Control', level=1)
para('Authentication uses a normal Bearer token flow. Login checks the supplied password against the bcrypt hash, creates a JWT containing the user id, and returns it to the client. For later requests, the client sends Authorization: Bearer token. protect verifies the JWT and loads an active, non-deleted user without the password field.')
bullets([
    'STUDENT: can use student dashboard, apply to jobs/drives, manage own profile, documents, offers, notifications.',
    'COMPANY: can manage only the company linked through user.companyRef, create/resubmit drives, inspect own applicants, shortlist, and release offers.',
    'TNP and TNP_ADMIN: can manage institutional company requests, academic records, document review, cases, policy, announcements, and audits.',
    'SUPER_ADMIN: explicitly bypasses normal role checks.',
])
table(['Important protection', 'How the code enforces it'], [
    ('No public admin signup', 'registerUser always persists role STUDENT; client-supplied role is ignored.'),
    ('Academic record protection', 'Profile updates whitelist only student-editable fields such as skills, projects, links, and resume URL.'),
    ('Company ownership', 'Company portal resolves the company from req.user.companyRef and filters drives/applications by that company.'),
    ('Demo safety', 'x-acting-role works only if ALLOW_DEMO_AUTH=true outside production.'),
    ('Soft-deleted users', 'JWT middleware loads only isActive true and isDeleted false accounts.'),
], [2.1, 4.8])
page_break()

doc.add_heading('6 Database Design and Relationships', level=1)
para('MongoDB stores each domain entity in its own collection. Mongoose ObjectId references connect records. populate is used when a response needs selected fields from a related entity. Most major models also have createdAt and updatedAt timestamps.')
table(['Model', 'What it represents', 'Key references / important fields'], [
    ('User', 'All authenticated people.', 'role, companyRef for recruiter, nested studentDetails, password hash, active/deleted flags.'),
    ('Company', 'Recruiting organization profile.', 'verification state, HR contacts, logo, soft-delete flag.'),
    ('Drive', 'Modern placement drive and workflow.', 'company, eligibility criteria, rounds, deadline, status, review fields.'),
    ('Job', 'Legacy/simple job-listing representation.', 'companyRef, role, CTC, deadline, simpler eligibility, archive flag.'),
    ('Application', 'Student application to one Job or one Drive.', 'student, job or drive, company snapshot, status, eligibility snapshot, round results.'),
    ('Offer', 'Formal company offer to a student.', 'student, drive, company, CTC, status; unique student plus drive index.'),
    ('Document', 'Student/company document submitted for verification.', 'owner, document type, URL/file metadata, verification status.'),
    ('Notification', 'Personal, role-based, or global message.', 'user/recipient, recipientRole, type, priority, read state.'),
    ('PlacementPolicy', 'Institution-wide placement rules.', 'minimum academic rules and multi-offer/freeze settings.'),
    ('PlacementCase', 'Operational issue or exception case.', 'student, category, priority, assignee, resolution state.'),
    ('Announcement', 'Institution broadcast content.', 'author, audience targeting, category, priority.'),
    ('AuditLog', 'Immutable operational history.', 'actor, action, entity, old/new value, reason.'),
    ('Communication', 'Message thread data model.', 'thread id, sender, receiver, drive, attachments; not yet exposed by routes.'),
], [1.35, 2.45, 3.1])

doc.add_heading('6.1 Relationship Diagram', level=2)
code('User (student) 1 ---- * Application * ---- 1 Drive ---- 1 Company\n                              |                   |\n                              |                   * ---- * Offer ---- 1 User (student)\n                              * ---- 1 Job\n\nUser (student) 1 ---- * Document\nUser (TNP)     1 ---- * AuditLog / Announcement\nCompany        1 ---- * Drive')

doc.add_heading('6.2 Important Constraints', level=2)
bullets([
    'An Application must reference at least one listing: either job or drive.',
    'Partial unique indexes block duplicate student plus job and student plus drive applications.',
    'Offer has a unique student plus drive index, so one drive cannot release duplicate offers to the same student.',
    'AuditLog pre-hooks reject updateOne and deleteOne to keep the audit history immutable.',
    'Enums restrict workflow values such as Drive.status, Application.status, Offer.status, and Document.status.',
])

doc.add_heading('7 Main Business Workflows', level=1)
doc.add_heading('7.1 Student Applies to a Listing', level=2)
code('POST /api/applications/apply\n1. protect + authorize STUDENT\n2. Controller accepts jobId or driveId\n3. Finds an active Job or non-deleted Drive\n4. For Drive: checks lifecycle status, deadline, and EligibilityEngine result\n5. Checks duplicate application index/query\n6. Saves application with company/role/CTC and eligibility snapshot\n7. Creates a personal notification\n8. Returns HTTP 201')
para('The eligibility snapshot is important for reporting: even if student profile data changes later, the application retains the evaluated academic and skills context from application time.')

doc.add_heading('7.2 Company Creates and TNP Reviews a Drive', level=2)
code('Company creates Drive -> DRAFT or SUBMITTED\nSUBMITTED -> TNP reviews -> APPROVED / NEEDS_CORRECTION / CANCELLED\nAPPROVED -> TNP can PUBLISH -> APPLICATIONS_OPEN\nApplications move through shortlisting and interview stages -> COMPLETED or ARCHIVED')
para('Company submissions call NotificationService to alert TNP. TNP review requires a meaningful reason for a decline or correction request, saves reviewer metadata, writes an AuditLog, and sends a company-facing notification.')

doc.add_heading('7.3 Offer Lifecycle', level=2)
code('Company shortlist -> SHORTLISTED\nCompany releases offer -> OFFERED application + RELEASED offer\nStudent accepts -> ACCEPTED offer + ACCEPTED application + placement status updated\nStudent declines -> DECLINED offer + DECLINED application')
para('The company controller checks that the application belongs to the company drive and that the candidate has reached an allowed state before release. The student offer endpoint rejects actions other than ACCEPT or DECLINE and prevents repeated responses.')
page_break()

doc.add_heading('8 Service Layer Deep Dive', level=1)
table(['Service', 'Role in the backend', 'What to explain in PPT/report'], [
    ('EligibilityEngine', 'Deterministically compares studentDetails against Drive eligibility.', 'Checks CGPA, active backlogs, attendance, branch, Class 10/12 marks, graduation year, and required skills; returns pass/fail reasons and match percentage.'),
    ('RecommendationEngine', 'Classifies drives based on eligibility output.', 'Separates top recommendations, eligible listings, near matches, and ineligible listings for the student portal.'),
    ('ReadinessScoreService', 'Computes a 0-100 placement readiness score.', 'Uses six pillars: academics, profile completeness, resume/portfolio, verified documents, skills, and preparation/attendance.'),
    ('NotificationService', 'Creates personal/role notifications and broadcasts.', 'Persists recipient information, supports idempotency keys, and avoids breaking the main workflow if a notification fails.'),
    ('AuditService', 'Records who changed which entity and why.', 'Audit writes are best-effort and do not block the primary transaction if logging fails.'),
    ('IdentityParser', 'Parses institutional email format.', 'Utility for extracting a roll number and name from email; currently not used by active route flow.'),
], [1.55, 2.35, 3.0])

doc.add_heading('9 API Map by Portal', level=1)
table(['Portal / prefix', 'Representative endpoints', 'Purpose'], [
    ('Public', 'GET /health, /jobs, /companies, /drives', 'Health and public listing read access.'),
    ('Auth /auth', 'POST register, login; GET me; PUT profile', 'Account lifecycle and profile self-service.'),
    ('Student /student', 'eligibility, recommendations, readiness, documents, offers', 'Placement tools restricted to students.'),
    ('Applications /applications', 'POST apply, GET my, PUT :id/status', 'Submit/list applications; status update is TNP-controlled.'),
    ('TNP /tnp', 'dashboard, company-requests, students, documents, cases, policy, audit-logs', 'Institutional command center.'),
    ('Company /company', 'dashboard, profile, drives, applicants, shortlist, offers/release', 'Recruiter workflow for their own company.'),
    ('Administrative CRUD', 'POST/PUT/DELETE /jobs, /companies, /drives', 'TNP/TPO compatible management operations.'),
    ('Notifications /notifications', 'GET /, PUT :id/read', 'Authenticated user-specific and role-specific notification access.'),
], [1.55, 3.55, 1.8])

doc.add_heading('10 Error Handling', level=1)
para('Routes forward errors with next(error). The notFound middleware generates a 404 for unmatched URL paths. errorHandler translates common Mongoose failures into useful API responses: invalid ObjectId as 400, schema validation as 400, and duplicate-key conflicts as 409. In production, stack traces are hidden.')

doc.add_heading('11 Operational Scripts and Testing', level=1)
table(['Command', 'What it does'], [
    ('npm run dev', 'Runs the backend with Node watch mode.'),
    ('npm run seed', 'Clears and repopulates TNP demo collections, including Drives and Jobs.'),
    ('npm run audit:db', 'Read-only integrity check for connection, counts, duplicate applications, and orphan references.'),
    ('npm run db:sync-indexes', 'Synchronizes Application, Job, Notification, and Offer indexes with the schemas.'),
    ('npm run db:repair-legacy', 'Links legacy Job records to Company records and removes only codex-smoke test notifications.'),
    ('npm run smoke:api', 'Runs HTTP end-to-end checks with temporary fixtures and cleans them in a finally block.'),
], [2.2, 4.7])
para('The smoke suite covers health, authentication rejection, three-role login, registration protection, profile-field protection, public reads, Company/Drive/Job CRUD, application duplicate prevention, application status update, all dashboards, and notification isolation/ownership.')
page_break()

doc.add_heading('12 What to Say in Your PPT', level=1)
table(['Suggested slide', 'Key message', 'Backend evidence'], [
    ('1 Project overview', 'A three-sided placement platform connects students, TNP administrators, and companies.', 'Three portal route groups and role-based access.'),
    ('2 Technology stack', 'MERN-style backend uses Node, Express, MongoDB/Mongoose, JWT, bcrypt.', 'package.json dependencies and architecture.'),
    ('3 Architecture', 'Layered routing -> controller -> service/model architecture keeps concerns separated.', 'src folder layout.'),
    ('4 Database design', 'MongoDB models represent the placement lifecycle with referenced entities and indexes.', 'User, Company, Drive, Job, Application, Offer etc.'),
    ('5 Student workflow', 'Eligibility and application workflow creates an auditable snapshot and avoids duplicates.', 'EligibilityEngine plus Application indexes.'),
    ('6 TNP workflow', 'TNP reviews company drives, verifies documents, changes academic data, manages policy and audits.', 'TNP routes and controllers.'),
    ('7 Company workflow', 'Company users are constrained to their own drives/applicants and can progress candidates.', 'companyRef ownership checks.'),
    ('8 Security', 'JWT, bcrypt, RBAC, field allowlists, CORS, soft deletion, audit logs.', 'middleware and controllers.'),
    ('9 Testing', 'Build checks, database audit, index sync, and 37 passing API smoke checks.', 'scripts and audit results.'),
    ('10 Future scope', 'Object storage, communications routes, stronger transaction boundaries, deployment monitoring.', 'Current limitations below.'),
], [1.25, 2.7, 2.95])

doc.add_heading('13 Points for Your Written Report', level=1)
bullets([
    'Problem statement: campus placement operations need a single system for students, TNP staff, and recruiters.',
    'Objective: digitalize the drive lifecycle, enforce eligibility, make applications traceable, and improve institutional monitoring.',
    'Methodology: REST API with role-based workflows, MongoDB models, validation and indexed constraints.',
    'Database section: explain entity references and state machines instead of only listing collections.',
    'Security section: explain password hashing, JWT authentication, RBAC, ownership filtering, and audit logs.',
    'Testing section: use the smoke-suite coverage and database integrity results as evidence.',
    'Limitations: document files are not yet in object storage; Communication model exists but has no API routes; production needs separately hosted API/database configuration.',
])

doc.add_heading('14 Current Limitations and Improvement Ideas', level=1)
table(['Area', 'Current state', 'Recommended next step'], [
    ('File upload', 'Document fileUrl can contain a URL/data URL.', 'Use S3/Cloudinary/object storage, signed URLs, anti-malware/MIME checks.'),
    ('Transactions', 'Related writes are sequential in several workflows.', 'Use MongoDB sessions for offer + application + student updates where strict atomicity is needed.'),
    ('Communication', 'Communication model exists but route/controller is absent.', 'Add conversation APIs, read receipts, pagination, and attachment storage.'),
    ('Tests', 'Smoke tests cover key HTTP flows.', 'Add unit tests for eligibility/readiness and integration tests in CI.'),
    ('Observability', 'Morgan gives development logs.', 'Add structured logs, error tracking, metrics, and readiness probes in deployment.'),
    ('Deployment', 'Frontend can use VITE_API_BASE_URL for separate API.', 'Deploy Express API and MongoDB separately; configure CLIENT_URL, MONGODB_URI, JWT_SECRET.'),
], [1.35, 2.7, 2.85])

doc.add_heading('15 Fast Revision Notes', level=1)
bullets([
    'Routes decide who can call an endpoint; controllers decide what business operation happens; models define what MongoDB can store.',
    'Drive is the full modern placement workflow. Job is a simpler/legacy listing kept compatible with the frontend.',
    'Application connects a student to one listing and stores a snapshot of eligibility at that moment.',
    'Company ownership is derived from User.companyRef, not from a client-supplied company id.',
    'TNP is the institutional authority for drive review, academics, document verification, policy, and audit inspection.',
    'Notifications are targeted through recipient or recipientRole; mark-as-read checks that the requester can access the notification.',
])

# Footer
for section in doc.sections:
    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    footer.add_run('TNP Backend Deep Dive Guide | Prepared from the current backend codebase')
    for run in footer.runs:
        run.font.size = Pt(8)
        run.font.color.rgb = RGBColor(100, 100, 100)

doc.core_properties.title = 'TNP Backend Deep Dive Guide'
doc.core_properties.subject = 'Backend architecture and workflows'
doc.core_properties.author = 'Codex'
doc.save(OUT)
print(OUT)
