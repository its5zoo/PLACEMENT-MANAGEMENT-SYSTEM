const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim();
const API_BASE = (configuredApiBase || '/api').replace(/\/$/, '');

// Current active role for seamless multi-portal demonstration (STUDENT | TNP | COMPANY)
let currentActingRole: string = localStorage.getItem('tnp_acting_role') || 'STUDENT';

export const setActingRole = (role: 'STUDENT' | 'TNP' | 'COMPANY') => {
  currentActingRole = role;
  localStorage.setItem('tnp_acting_role', role);
};

export const getActingRole = (): string => {
  return currentActingRole;
};

const getHeaders = (contentType = 'application/json') => {
  const headers: Record<string, string> = {
    'x-acting-role': currentActingRole,
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = localStorage.getItem('tnp_auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const normalizeRole = (role: string): 'STUDENT' | 'TNP' | 'COMPANY' => {
  const r = (role || '').toUpperCase();
  if (['TNP', 'TNP_ADMIN', 'SUPER_ADMIN', 'ADMIN', 'TPO'].includes(r)) return 'TNP';
  if (['COMPANY', 'RECRUITER'].includes(r)) return 'COMPANY';
  return 'STUDENT';
};

export const api = {
  setActingRole,
  getActingRole,
  normalizeRole,

  // Authentication
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    if (data.data?.token) {
      localStorage.setItem('tnp_auth_token', data.data.token);
      localStorage.setItem('tnp_user', JSON.stringify(data.data));
      const normalized = normalizeRole(data.data.role);
      localStorage.setItem('tnp_acting_role', normalized);
      currentActingRole = normalized;
    }
    return data;
  },

  logout() {
    localStorage.removeItem('tnp_auth_token');
    localStorage.removeItem('tnp_user');
    localStorage.removeItem('tnp_acting_role');
    currentActingRole = 'STUDENT';
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('tnp_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // Base Stats & Health
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/stats/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Jobs / Public Drives
  async getJobs(search = '', tag = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (tag) params.append('tag', tag);
    const res = await fetch(`${API_BASE}/jobs?${params.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  // Student Application flow
  async applyJob(jobId: string) {
    const res = await fetch(`${API_BASE}/applications/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ jobId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to apply');
    return data;
  },

  async getMyApplications(status = 'All', search = '') {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/applications/my?${params.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return res.json();
  },

  // Companies Directory
  async getCompanies(search = '') {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/companies?${params.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch companies');
    return res.json();
  },

  // Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  async updateProfile(profileData: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return res.json();
  },

  async markNotificationRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to update notification');
    return res.json();
  },

  // Drives
  async getDrives() {
    const res = await fetch(`${API_BASE}/drives`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch drives');
    return res.json();
  },

  // ==========================================
  // STUDENT PLACEMENT ENGINES
  // ==========================================
  async checkEligibility(driveId: string) {
    const res = await fetch(`${API_BASE}/student/eligibility/${driveId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to evaluate eligibility');
    return res.json();
  },

  async getRecommendations() {
    const res = await fetch(`${API_BASE}/student/recommendations`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch placement recommendations');
    return res.json();
  },

  async getReadinessScore() {
    const res = await fetch(`${API_BASE}/student/readiness`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to calculate readiness score');
    return res.json();
  },

  async getMyDocuments() {
    const res = await fetch(`${API_BASE}/student/documents`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch student documents');
    return res.json();
  },

  async uploadDocument(data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/student/documents`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit document');
    return res.json();
  },

  async getMyOffers() {
    const res = await fetch(`${API_BASE}/student/offers`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch placement offers');
    return res.json();
  },

  async respondToOffer(offerId: string, action: 'ACCEPT' | 'DECLINE', declineReason = '') {
    const res = await fetch(`${API_BASE}/student/offers/${offerId}/respond`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ action, declineReason }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update offer');
    return json;
  },

  // ==========================================
  // TNP CELL PORTAL ENDPOINTS
  // ==========================================
  async getTnpDashboard() {
    const res = await fetch(`${API_BASE}/tnp/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch TNP dashboard');
    return res.json();
  },

  async getCompanyRequests(status = 'ALL') {
    const res = await fetch(`${API_BASE}/tnp/company-requests?status=${status}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch company requests');
    return res.json();
  },

  async reviewCompanyRequest(driveId: string, decision: 'APPROVE' | 'DECLINE' | 'NEEDS_CORRECTION' | 'PUBLISH', rejectionReason = '', correctionComments = '', internalTnpNotes = '') {
    const res = await fetch(`${API_BASE}/tnp/company-requests/${driveId}/review`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ decision, rejectionReason, correctionComments, internalTnpNotes }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to review request');
    return json;
  },

  async getTnpStudents(branch = 'ALL', search = '', placementStatus = 'ALL', minCgpa = '') {
    const params = new URLSearchParams();
    if (branch && branch !== 'ALL') params.append('branch', branch);
    if (search) params.append('search', search);
    if (placementStatus && placementStatus !== 'ALL') params.append('placementStatus', placementStatus);
    if (minCgpa) params.append('minCgpa', minCgpa);
    const res = await fetch(`${API_BASE}/tnp/students?${params.toString()}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch students list');
    return res.json();
  },

  async updateStudentAcademics(studentId: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/tnp/students/${studentId}/academics`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update student academic record');
    return res.json();
  },

  async getDocumentRequests(status = 'ALL') {
    const res = await fetch(`${API_BASE}/tnp/documents?status=${status}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async verifyDocument(docId: string, status: 'VERIFIED' | 'REJECTED' | 'REPLACEMENT_REQUIRED', rejectionReason = '') {
    const res = await fetch(`${API_BASE}/tnp/documents/${docId}/verify`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status, rejectionReason }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to update document verification');
    return json;
  },

  async getPlacementCases() {
    const res = await fetch(`${API_BASE}/tnp/cases`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch placement cases');
    return res.json();
  },

  async updatePlacementCase(caseId: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/tnp/cases/${caseId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update placement case');
    return res.json();
  },

  async createAnnouncement(data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/tnp/announcements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to publish announcement');
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/tnp/audit-logs`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getPolicy() {
    const res = await fetch(`${API_BASE}/tnp/policy`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch policy');
    return res.json();
  },

  async updatePolicy(data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/tnp/policy`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update policy');
    return res.json();
  },

  // ==========================================
  // COMPANY PORTAL ENDPOINTS
  // ==========================================
  async getCompanyDashboard() {
    const res = await fetch(`${API_BASE}/company/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch company dashboard');
    return res.json();
  },

  async getCompanyProfile() {
    const res = await fetch(`${API_BASE}/company/profile`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch company profile');
    return res.json();
  },

  async updateCompanyProfile(data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/company/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update company profile');
    return res.json();
  },

  async createCompanyDrive(data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/company/drives`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to create drive');
    return json;
  },

  async resubmitDrive(id: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/company/drives/${id}/resubmit`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to resubmit drive');
    return json;
  },

  async getDriveApplicants(driveId: string, status = 'ALL') {
    const res = await fetch(`${API_BASE}/company/drives/${driveId}/applicants?status=${status}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch drive applicants');
    return res.json();
  },

  async getCompanyStudentProfile(studentId: string) {
    const res = await fetch(`${API_BASE}/company/students/${studentId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch student profile');
    return res.json();
  },

  async shortlistApplicant(applicationId: string) {
    const res = await fetch(`${API_BASE}/company/applications/${applicationId}/shortlist`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to shortlist applicant');
    return json;
  },

  async releaseOffer(data: Record<string, unknown>) {
    const res = await fetch(`${API_BASE}/company/offers/release`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || 'Failed to release offer');
    return json;
  },
};
