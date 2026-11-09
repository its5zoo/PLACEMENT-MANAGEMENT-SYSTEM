from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.style import WD_STYLE_TYPE

OUT = r"C:\Users\MDFAIZAANRAZAKHAN\Downloads\TNP project\TNP_Frontend_Deep_Dive_Guide.docx"
doc = Document()
section = doc.sections[0]
section.top_margin = Inches(0.7); section.bottom_margin = Inches(0.7)
section.left_margin = Inches(0.75); section.right_margin = Inches(0.75)
styles = doc.styles
styles['Normal'].font.name = 'Aptos'; styles['Normal']._element.rPr.rFonts.set(qn('w:ascii'), 'Aptos')
styles['Normal'].font.size = Pt(10.5); styles['Normal'].paragraph_format.space_after = Pt(6)
for name, size in [('Title', 24), ('Heading 1', 16), ('Heading 2', 12)]:
    styles[name].font.name = 'Aptos Display'; styles[name]._element.rPr.rFonts.set(qn('w:ascii'), 'Aptos Display')
    styles[name].font.size = Pt(size); styles[name].font.color.rgb = RGBColor(0, 0, 0)
style = styles.add_style('Code Block', WD_STYLE_TYPE.PARAGRAPH)
style.font.name = 'Consolas'; style._element.rPr.rFonts.set(qn('w:ascii'), 'Consolas'); style.font.size = Pt(8.5)
style.paragraph_format.left_indent = Inches(.18); style.paragraph_format.space_after = Pt(6)

def shade(cell, color):
    pr = cell._tc.get_or_add_tcPr(); el = OxmlElement('w:shd'); el.set(qn('w:fill'), color); pr.append(el)
def ct(cell, text, bold=False, color=None):
    cell.text = ''; p = cell.paragraphs[0]; p.paragraph_format.space_after = Pt(0)
    r = p.add_run(str(text)); r.bold = bold; r.font.size = Pt(8.5)
    if color: r.font.color.rgb = RGBColor(*color)
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers)); t.style='Table Grid'; t.alignment=WD_TABLE_ALIGNMENT.CENTER
    for i,h in enumerate(headers):
        ct(t.rows[0].cells[i],h,True,(255,255,255)); shade(t.rows[0].cells[i],'1F4E78')
        if widths: t.rows[0].cells[i].width=Inches(widths[i])
    for ri,row in enumerate(rows):
        cells=t.add_row().cells
        for i,v in enumerate(row):
            ct(cells[i],v)
            if ri%2: shade(cells[i],'EAF2F8')
            if widths: cells[i].width=Inches(widths[i])
    doc.add_paragraph()
def para(text='', style=None): return doc.add_paragraph(text, style)
def bullets(items):
    for x in items: doc.add_paragraph(x, style='List Bullet')
def code(text): doc.add_paragraph(text, style='Code Block')
def pb(): doc.add_page_break()

p=doc.add_paragraph(style='Title'); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.add_run('TNP Frontend Deep Dive Guide')
p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; r=p.add_run('React TypeScript Vite User Interface'); r.bold=True; r.font.size=Pt(14)
p=doc.add_paragraph(); p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.add_run('Portal navigation, components, state, API integration, UI workflow, and presentation notes').italic=True
doc.add_paragraph()
table(['Use this guide for','What it explains'],[
 ('Project understanding','How React starts, selects a portal, renders screens, stores session state, and calls the backend.'),
 ('PPT preparation','A slide-ready architecture narrative for the student, TNP, and company portals.'),
 ('Report preparation','Technology rationale, component design, user flows, API layer, UI testing, and improvement ideas.'),
],[2.0,4.9])
para('Main conclusion: the frontend is a single-page React application with three role-aware portals. App.tsx acts as the central shell and lightweight router. It chooses a view from activeTab, while reusable components provide login, navigation, header, status badges, notifications, and modal behavior.')
pb()

doc.add_heading('1 Frontend at a Glance',level=1)
para('The frontend is built with React 19, TypeScript, and Vite. It does not use React Router or a global state library. Instead, navigation is managed in App.tsx through activeTab state. Data fetching uses the browser fetch API through one shared service file, services/api.ts.')
table(['Layer','Responsibility','Main files'],[
 ('Entry point','Mounts React in StrictMode and imports global CSS.','src/main.tsx'),
 ('App shell','Stores user, portal mode, active view, sidebar state, and selected application.','src/App.tsx'),
 ('Shared UI','Login, Sidebar, Header, StatusBadge, ApplicationModal.','src/components/common'),
 ('Student portal','Dashboard and placement activities for students.','src/components/StudentDashboard'),
 ('TNP portal','Institutional management and operational monitoring views.','src/components/TnpPortal'),
 ('Company portal','Recruiter dashboard, drive creation, applicants, shortlist, offers.','src/components/CompanyPortal'),
 ('API layer','Fetch wrappers, headers, token persistence, and all backend endpoint calls.','src/services/api.ts'),
 ('Types and CSS','Shared TypeScript unions/interfaces and the visual design system.','src/types/index.ts and src/index.css'),
],[1.2,3.95,1.75])

doc.add_heading('2 Dependencies and Tooling',level=1)
table(['Package','Purpose in frontend'],[
 ('react and react-dom','Component rendering, hooks, StrictMode, and DOM mounting.'),
 ('typescript','Compile-time typing for views, active tabs, data shapes, and API code.'),
 ('vite','Fast local development server, production bundling, and backend proxy during development.'),
 ('@vitejs/plugin-react','Makes React JSX/TSX work with Vite.'),
 ('lucide-react','Icon library used throughout dashboard cards, navigation, action buttons, and status UI.'),
 ('eslint and TypeScript ESLint','Static code checks, React Hook checks, and consistent development quality.'),
],[2.15,4.75])
para('The project uses CSS classes from src/index.css and component-level class names. It currently does not depend on a component framework, router, Redux, React Query, Axios, or a charting package.')

doc.add_heading('3 Folder Map',level=1)
code('frontend/\n  src/\n    main.tsx                    React bootstrap\n    App.tsx                     authenticated app shell and view switch\n    index.css                   global visual styles\n    App.css                     app-level styles\n    services/api.ts             shared HTTP client\n    types/index.ts              ActiveTab and shared interfaces\n    components/common/          reusable shell components\n    components/StudentDashboard student-facing screens\n    components/TnpPortal/       TNP administration screens\n    components/CompanyPortal/   recruiter screens\n  public/                       logo and campus image assets\n  vite.config.ts                dev port and /api proxy')
pb()

doc.add_heading('4 Application Startup and Navigation',level=1)
para('main.tsx finds the root HTML element and renders App inside StrictMode. StrictMode helps expose unsafe component side effects during development. Global CSS is imported once from index.css.')
code('index.html\n  -> src/main.tsx\n     -> createRoot(root).render(StrictMode(App))\n        -> LoginView if no current user\n        -> Sidebar + Header + active portal screen if authenticated')
para('App.tsx is the control center. It initializes currentUser from localStorage via api.getCurrentUser. It derives portalMode from the saved user role. When the user changes, a useEffect selects the correct default tab for STUDENT, TNP, or COMPANY.')

table(['App state','Type / example','Why it exists'],[
 ('currentUser','Logged-in user object or null','Decides whether LoginView or the protected app shell is shown.'),
 ('portalMode','STUDENT | TNP | COMPANY','Controls role-aware navigation and the visible portal context.'),
 ('activeTab','dashboard, tnp-dashboard, company-dashboard, etc.','Acts as the application navigation state.'),
 ('isSidebarOpen','boolean','Controls sidebar visibility, especially for responsive layout.'),
 ('selectedApp','ApplicationItem or null','Opens ApplicationModal for a selected dashboard application.'),
],[1.45,2.3,3.15])

doc.add_heading('4.1 View Selection Logic',level=2)
para('renderActiveView uses a switch statement. Each ActiveTab value maps to one React component. For example, dashboard maps to DashboardView, tnp-documents maps to TnpDocumentsView, and company-create-drive maps to CreateDriveView. This is a simple custom router: it does not change the URL, but it changes the main content area.')
code('activeTab -> renderActiveView() -> screen component\n\nStudent: dashboard | profile | job-listings | documents | offers ...\nTNP:     tnp-dashboard | tnp-requests | tnp-students | tnp-documents ...\nCompany: company-dashboard | company-create-drive | company-applicants ...')

doc.add_heading('5 Authentication and Session Handling',level=1)
para('LoginView sends email and password through api.login. After a successful backend response, api.login stores tnp_auth_token, tnp_user, and normalized role information in localStorage. App receives the user object through onLoginSuccess, updates state, and redirects to the correct portal default screen.')
table(['Session item','Where stored','How it is used'],[
 ('tnp_auth_token','localStorage','Attached as Authorization: Bearer token by getHeaders for protected API calls.'),
 ('tnp_user','localStorage','Used by App on page refresh to restore the current user display/session shell.'),
 ('tnp_acting_role','localStorage and module variable','Supports the optional development demo role header; normal login still uses real JWT role checks.'),
],[1.65,1.8,3.45])
para('Logout calls api.logout, clears the three localStorage values, sets currentUser to null, and returns the user to LoginView.')
pb()

doc.add_heading('6 API Integration Layer',level=1)
para('services/api.ts is the central HTTP abstraction. Components should call api.getJobs or api.getTnpDashboard rather than constructing fetch URLs themselves. This keeps the backend URL, headers, token handling, error handling, and role normalization consistent.')
table(['API layer capability','How it works'],[
 ('Base URL','Uses VITE_API_BASE_URL when provided; otherwise /api. This supports separate frontend/backend deployments.'),
 ('Development proxy','vite.config.ts proxies /api to http://localhost:5000, avoiding browser cross-origin complexity locally.'),
 ('Headers','getHeaders adds Content-Type, optional x-acting-role, and Authorization bearer token.'),
 ('Error flow','Methods inspect response.ok and throw Error with backend message where available.'),
 ('Role normalization','Legacy values such as TPO, ADMIN, recruiter are mapped to visual modes TNP or COMPANY.'),
],[2.0,4.9])

doc.add_heading('6.1 API Groups Used by the UI',level=2)
table(['UI group','Representative api.ts methods','Screens that use them'],[
 ('Authentication','login, logout, getCurrentUser, getProfile, updateProfile','LoginView, ProfileView, App'),
 ('Student dashboard','getDashboardStats, getJobs, applyJob, getMyApplications','DashboardView, JobListingsView, MyApplicationsView'),
 ('Student placement','checkEligibility, getRecommendations, getReadinessScore, documents, offers','RecommendationsView, ReadinessScoreView, DocumentsView, OffersView'),
 ('TNP operations','getTnpDashboard, company requests, students, document requests, cases, policy, audit logs','TnpDashboardView and related TNP screens'),
 ('Company operations','company dashboard/profile, create/resubmit drive, applicants, shortlist, releaseOffer','CompanyDashboardView, CreateDriveView, CompanyApplicantsView'),
 ('Notifications','getNotifications and markNotificationRead','Header'),
],[1.65,3.35,1.9])

doc.add_heading('7 Reusable Common Components',level=1)
table(['Component','What it does','Where it matters'],[
 ('LoginView','Shows role-aware login UI, sends credentials to api.login, reports loading/error state.','Initial unauthenticated screen.'),
 ('Sidebar','Renders the role-specific navigation menu and emits setActiveTab changes.','Controls all in-app navigation.'),
 ('Header','Shows title/context, user controls, notification indicator/list, sidebar trigger, logout.','Common top bar for authenticated screens.'),
 ('StatusBadge','Turns status text into a consistent visual badge.','Applications, drives, documents, offers, and cases.'),
 ('ApplicationModal','Shows more detail for selected application from the student dashboard.','Opened through selectedApp state in App.'),
],[1.45,3.6,1.85])

doc.add_heading('8 Student Portal Deep Dive',level=1)
para('StudentDashboard contains the largest group of views. Its job is to help a student understand placement readiness, search and apply for opportunities, manage profile/documents, and track application/offer progress.')
table(['View','Primary purpose','Backend connection'],[
 ('DashboardView','Summary cards, recent applications, profile completion, shortcuts.','getDashboardStats'),
 ('JobListingsView','Browse/filter jobs and submit applications; checks already-applied records.','getJobs, getMyApplications, applyJob'),
 ('MyApplicationsView','Shows application pipeline and filtering/search.','getMyApplications'),
 ('RecommendationsView','Shows high-fit, eligible, near-match, and ineligible drives.','getRecommendations, applyJob'),
 ('ReadinessScoreView','Displays six-pillar readiness score and next actions.','getReadinessScore'),
 ('DocumentsView','Lists documents, opens preview, uploads metadata/file URL.','getMyDocuments, uploadDocument'),
 ('OffersView','Displays offers and lets student accept/decline.','getMyOffers, respondToOffer'),
 ('ProfileView','Loads and saves student-editable profile information.','getProfile, updateProfile'),
 ('CompaniesView','Searchable recruiter/company directory.','getCompanies'),
 ('PlacementDriveView','Visual placement-drive information/status display.','Uses presented drive data/status UI'),
 ('Resources, TrainingSkills, Messages, Settings','Supporting static or UI-focused student experience sections.','Some are presentation-focused; Messages has no active backend route yet.'),
],[1.65,2.8,2.25])
pb()

doc.add_heading('9 TNP Portal Deep Dive',level=1)
para('The TNP portal is an operational command center. It converts the backend institutional workflow into screens for monitoring, review, intervention, and governance.')
table(['View','What the user can do','Backend method'],[
 ('TnpDashboardView','See KPIs, placement funnel, drive health, recent requests/applications.','getTnpDashboard'),
 ('CompanyRequestsView','Filter company drive requests and approve, decline, request correction, or publish.','getCompanyRequests, reviewCompanyRequest'),
 ('TnpStudentsView','Search students and update institution-controlled academics/status.','getTnpStudents, updateStudentAcademics'),
 ('TnpDocumentsView','Review submissions, preview them, verify/reject/request replacement.','getDocumentRequests, verifyDocument'),
 ('TnpCasesView','Track and resolve placement cases.','getPlacementCases, updatePlacementCase'),
 ('TnpPolicyView','View and update placement policy values.','getPolicy, updatePolicy'),
 ('TnpAuditView','Read immutable audit history.','getAuditLogs'),
],[1.65,3.35,1.7])
para('Important architecture point: the frontend shows controls, but the backend remains the source of truth. Buttons cannot bypass authorization because every TNP API endpoint is protected server-side.')

doc.add_heading('10 Company Portal Deep Dive',level=1)
table(['View','What it does','Backend method'],[
 ('CompanyDashboardView','Shows company-specific metrics, drives, applicants, and pipeline context.','getCompanyDashboard'),
 ('CreateDriveView','Builds a drive request with role, CTC, deadline, eligibility, and rounds; can submit to TNP.','createCompanyDrive'),
 ('CompanyApplicantsView','Selects a company drive, loads applicants, shortlists a candidate, releases offer.','getDriveApplicants, shortlistApplicant, releaseOffer'),
 ('Company profile behavior','App currently maps company-profile tab to CompanyDashboardView; API support exists for profile get/update.','getCompanyProfile, updateCompanyProfile'),
],[1.75,3.35,1.6])

doc.add_heading('11 State and Data Flow Examples',level=1)
doc.add_heading('11.1 Applying for a Job',level=2)
code('JobListingsView\n  -> api.getJobs() loads listing cards\n  -> user clicks Apply\n  -> api.applyJob(id) sends POST /applications/apply\n  -> backend validates student, listing, eligibility, deadline, duplicate\n  -> UI refreshes / shows success or error')
doc.add_heading('11.2 Reviewing a Company Request',level=2)
code('CompanyRequestsView\n  -> api.getCompanyRequests(filter)\n  -> TNP chooses approve / decline / correction / publish\n  -> api.reviewCompanyRequest(...) PUT request\n  -> backend updates drive state, audit log, notification\n  -> UI reloads request list')
doc.add_heading('11.3 Notification Interaction',level=2)
code('Header mount or portal change\n  -> api.getNotifications()\n  -> Header displays unread count/list\n  -> user opens notification menu\n  -> api.markNotificationRead(id) for each viewed item')

doc.add_heading('12 Styling and Assets',level=1)
para('index.css contains the core design system and reusable CSS classes such as app-container, main-wrapper, content-body, button styles, cards, modals, badges, responsive rules, and portal layouts. App.css provides app-level styling. Public assets include GIET branding, Doraemon/avatar visuals, and campus images.')
bullets([
 'lucide-react icons make buttons and dashboard actions more recognizable without hand-drawn SVG files.',
 'StatusBadge centralizes the visual language for lifecycle states.',
 'The app uses responsive sidebar and content layout state rather than page reload navigation.',
 'Production build outputs static assets into frontend/dist through Vite.',
])
pb()

doc.add_heading('13 Build Development and Deployment',level=1)
table(['Command','Purpose'],[
 ('npm run dev','Starts Vite development server on port 5173 with /api proxy to backend port 5000.'),
 ('npm run build','Runs TypeScript project build then creates optimized production Vite bundle.'),
 ('npm run preview','Serves the production bundle locally for a deployment-like check.'),
 ('npm run lint','Runs ESLint across TypeScript and TSX files.'),
],[2.0,4.9])
para('For local development, Vite proxy means the browser calls /api and Vite forwards that request to Node/Express. For separate deployment, VITE_API_BASE_URL should point to the deployed backend API base. The backend CORS CLIENT_URL must allow the deployed frontend origin.')

doc.add_heading('14 PPT Slide Plan',level=1)
table(['Slide','What to say','Proof from frontend'],[
 ('1 UI overview','One application serves Student, TNP Cell, and Company portals after login.','PortalMode and role-aware App shell.'),
 ('2 Technology','React 19 + TypeScript + Vite deliver a fast SPA UI.','package.json and main.tsx.'),
 ('3 Frontend architecture','Central App shell, shared components, portal views, API service layer.','src folder organization.'),
 ('4 Navigation','activeTab works as lightweight in-app routing; sidebar controls it.','App switch and Sidebar props.'),
 ('5 API integration','One api.ts abstracts fetch, tokens, headers, errors, and role normalization.','services/api.ts.'),
 ('6 Student experience','Jobs, eligibility, recommendations, readiness, documents, offers.','StudentDashboard views.'),
 ('7 TNP experience','Drive approval, student operations, documents, cases, policy, audit.','TnpPortal views.'),
 ('8 Company experience','Drive creation, applicants, shortlist, offer release.','CompanyPortal views.'),
 ('9 Security UX','Token stored locally; protected APIs use Authorization header; server is final authority.','api.getHeaders and LoginView.'),
 ('10 Future scope','Use URL routing, richer types, query caching, more test coverage, accessible uploads.','Current architecture limitations.'),
],[1.05,3.1,2.55])

doc.add_heading('15 Report Writing Points',level=1)
bullets([
 'Explain the frontend as a single-page application where components update without full-page reloads.',
 'Describe component reusability: Sidebar, Header, StatusBadge, and ApplicationModal avoid duplicated UI logic.',
 'Explain state management: local useState is sufficient for current screen-level state; localStorage persists session state across refreshes.',
 'Explain separation of concerns: views focus on rendering and interaction, while api.ts owns networking.',
 'Explain TypeScript types: ActiveTab prevents invalid screen names; ApplicationItem, JobListing, Company, and NotificationItem define common UI shapes.',
 'Mention API error handling: user actions use try/catch and show loading/error feedback in data-driven views.',
])

doc.add_heading('16 Limitations and Improvement Ideas',level=1)
table(['Area','Current design','Improvement'],[
 ('Routing','Switch on activeTab; URL does not represent the current screen.','Adopt React Router for deep links, browser history, and guarded routes.'),
 ('State fetching','Views load data with local useEffect/useState.','Use TanStack Query or similar for caching, retries, invalidation, and loading consistency.'),
 ('Types','Some UI data uses flexible any/object shapes.','Create API response DTO interfaces and type every payload.'),
 ('Profile screen','company-profile tab currently renders company dashboard.','Create a dedicated CompanyProfileView wired to existing API methods.'),
 ('Messages','Messages UI exists but backend communication routes are not connected.','Implement backend communication endpoints and real-time updates.'),
 ('Uploads','Document upload uses JSON/file URL pattern.','Use multipart upload or signed object-storage URL flow with progress.'),
 ('Quality','Lint exits with no errors but seven Hook dependency warnings remain.','Refactor loaders with useCallback or effect-local functions.'),
],[1.3,2.85,2.55])

doc.add_heading('17 Fast Revision Notes',level=1)
bullets([
 'App.tsx is the central UI controller; it is not the backend router.',
 'activeTab selects the visible page, while portalMode selects the current user context.',
 'api.ts is the only shared place for HTTP request behavior and session headers.',
 'Student, TNP, and Company components are separated so each portal is easier to maintain.',
 'Vite proxy connects local frontend port 5173 to backend port 5000 during development.',
 'Backend authorization is still essential; frontend navigation only controls what the user sees.',
])

for s in doc.sections:
    foot=s.footer.paragraphs[0]; foot.alignment=WD_ALIGN_PARAGRAPH.CENTER
    run=foot.add_run('TNP Frontend Deep Dive Guide | Prepared from the current frontend codebase'); run.font.size=Pt(8); run.font.color.rgb=RGBColor(100,100,100)
doc.core_properties.title='TNP Frontend Deep Dive Guide'; doc.core_properties.subject='Frontend architecture and workflows'; doc.core_properties.author='Codex'
doc.save(OUT); print(OUT)
