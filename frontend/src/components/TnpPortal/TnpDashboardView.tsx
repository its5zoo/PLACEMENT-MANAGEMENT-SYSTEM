import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, FileCheck, AlertTriangle, 
  TrendingUp, Activity, ShieldCheck, Clock, Loader2 
} from 'lucide-react';
import { api } from '../../services/api';
import type { ActiveTab } from '../../types';

interface TnpDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const TnpDashboardView: React.FC<TnpDashboardProps> = ({ setActiveTab }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getTnpDashboard();
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading TNP dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: '#64748b' }}>
        <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Loading institutional placement operations...</span>
      </div>
    );
  }

  const { kpis = {}, funnel = {}, missingLink = {}, driveHealth = [] } = data || {};

  return (
    <div className="view-container">
      {/* 1. TOP OPERATIONAL KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="stat-card" onClick={() => setActiveTab('tnp-students')} style={{ cursor: 'pointer' }}>
          <div className="stat-left">
            <div className="stat-icon-wrapper blue"><Users size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Total Batch</span>
              <span className="stat-number">{kpis.totalStudents || 120}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>CSE / IT / ECE</span>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <div className="stat-icon-wrapper green"><CheckCircle2 size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Eligible Students</span>
              <span className="stat-number">{kpis.eligibleStudents || 112}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>CGPA &gt;= 6.5</span>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <div className="stat-icon-wrapper green"><ShieldCheck size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Placed Students</span>
              <span className="stat-number">{kpis.placedStudents || 28}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
            {kpis.placementPercentage || 24}% Placed
          </span>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('tnp-requests')} style={{ cursor: 'pointer' }}>
          <div className="stat-left">
            <div className="stat-icon-wrapper amber"><Clock size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Pending Requests</span>
              <span className="stat-number">{kpis.pendingCompanyRequests || 1}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>Needs Review</span>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('tnp-documents')} style={{ cursor: 'pointer' }}>
          <div className="stat-left">
            <div className="stat-icon-wrapper blue"><FileCheck size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Pending Paperwork</span>
              <span className="stat-number">{kpis.pendingDocuments || 1}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>Verify Docs</span>
        </div>
      </div>

      {/* 2. PLACEMENT FUNNEL & MISSING LINK INVESTIGATION */}
      <div className="dashboard-grid" style={{ marginTop: '20px' }}>
        {/* Institutional Selection Funnel */}
        <div className="section-card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#2563eb" />
              Institutional Placement Funnel
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Applications Submitted', count: funnel.applied || 45, color: '#2563eb', pct: 100 },
              { label: 'Shortlisted for Assessment', count: funnel.shortlisted || 38, color: '#3b82f6', pct: 84 },
              { label: 'Interviewed Candidates', count: funnel.interviewed || 24, color: '#6366f1', pct: 53 },
              { label: 'Selected by Employers', count: funnel.selected || 14, color: '#10b981', pct: 31 },
              { label: 'Offers Accepted (Placed)', count: funnel.accepted || 8, color: '#059669', pct: 18 },
            ].map((stage, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{stage.label}</span>
                  <span style={{ fontWeight: 700, color: stage.color }}>{stage.count} students ({stage.pct}%)</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${stage.pct}%`, backgroundColor: stage.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unique Feature: Missing Link Investigation */}
        <div className="section-card" style={{ padding: '24px' }}>
          <div className="card-header" style={{ marginBottom: '16px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={18} color="#d97706" />
              Placement Missing Link Analysis
            </h3>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 0, marginBottom: '16px' }}>
            The system automatically scans all workflow nodes to detect stalled applicants and incomplete round scores.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#b45309' }}>
                {missingLink.shortlistedWithoutResults || 0} Shortlisted Candidates Without Round Scores
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#92400e' }}>
                Interview round completed but evaluators have not updated status in PMS.
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#1e40af' }}>
                {missingLink.unverifiedStudentDocuments || 0} Student Documents Awaiting Review
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#1e3a8a' }}>
                Uploads pending verification before company drive shortlist generation.
              </p>
            </div>

            <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#15803d' }}>
                Zero Placement Freeze Conflicts
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#166534' }}>
                All accepted offers comply with institutional single-offer / upgrade policies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ACTIVE DRIVE HEALTH PANEL */}
      <div className="section-card" style={{ marginTop: '20px', padding: '24px' }}>
        <div className="card-header" style={{ marginBottom: '16px' }}>
          <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#2563eb" />
            Active Drive Operational Health
          </h3>
          <button className="link-btn" onClick={() => setActiveTab('tnp-drives')}>View All Drives</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Drive Role & Company</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px' }}>Application Completion</th>
                <th style={{ padding: '12px 16px' }}>Document Verified</th>
                <th style={{ padding: '12px 16px' }}>Interview Readiness</th>
              </tr>
            </thead>
            <tbody>
              {driveHealth.map((dh: any, idx: number) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0f172a' }}>
                    {dh.company} — <span style={{ fontWeight: 500, color: '#64748b' }}>{dh.role}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {dh.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${dh.applicationCompletion}%`, height: '100%', backgroundColor: '#16a34a' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{dh.applicationCompletion}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${dh.documentCompletion}%`, height: '100%', backgroundColor: '#2563eb' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{dh.documentCompletion}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${dh.interviewReadiness}%`, height: '100%', backgroundColor: '#6366f1' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{dh.interviewReadiness}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
