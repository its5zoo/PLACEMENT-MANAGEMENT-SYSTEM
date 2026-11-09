import React, { useState, useEffect } from 'react';
import { Building2, Users, CheckCircle, Gift, PlusCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import type { ActiveTab } from '../../types';

interface CompanyDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const CompanyDashboardView: React.FC<CompanyDashboardProps> = ({ setActiveTab }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.getCompanyDashboard();
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error loading company dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '350px', color: '#64748B' }}>
        <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Loading corporate recruitment portal...</span>
      </div>
    );
  }

  const { company = {}, metrics = {}, drives = [] } = data || {};

  return (
    <div className="view-container">
      {/* Company Verification Banner */}
      <div className="section-card" style={{
        padding: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        backgroundColor: '#FFFFFF',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', fontWeight: 800, color: '#111827',
          }}>
            {company.logoText || 'CO'}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>{company.name}</h2>
              <span style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                color: company.verificationStatus === 'VERIFIED' ? '#15803D' : '#475569',
                padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
              }}>
                {company.verificationStatus === 'VERIFIED' ? '✓ Verified Partner' : 'Verification Under Review'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
              HR Lead: {company.hrName || 'Campus Talent Acquisition'} ({company.hrEmail || 'recruitment@company.com'})
            </p>
          </div>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setActiveTab('company-create-drive')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <PlusCircle size={16} />
          <span>Post New Campus Drive</span>
        </button>
      </div>

      {/* Recruitment KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
        <div className="stat-card">
          <div className="stat-left">
            <div className="stat-icon-wrapper blue"><Building2 size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Active Drives</span>
              <span className="stat-number">{metrics.activeDrives || 1}</span>
            </div>
          </div>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('company-applicants')} style={{ cursor: 'pointer' }}>
          <div className="stat-left">
            <div className="stat-icon-wrapper blue"><Users size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Total Applicants</span>
              <span className="stat-number">{metrics.totalApplicants || 0}</span>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Review &gt;</span>
        </div>

        <div className="stat-card" onClick={() => setActiveTab('company-applicants')} style={{ cursor: 'pointer' }}>
          <div className="stat-left">
            <div className="stat-icon-wrapper amber"><CheckCircle size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Shortlisted</span>
              <span className="stat-number">{metrics.shortlisted || 0}</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-left">
            <div className="stat-icon-wrapper green"><Gift size={22} /></div>
            <div className="stat-details">
              <span className="stat-label">Offers Released</span>
              <span className="stat-number">{metrics.offersReleased || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Drives Table */}
      <div className="section-card" style={{ marginTop: '20px', padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>Campus Placement Drives</h3>
          <span style={{ fontSize: '0.85rem', color: '#64748B' }}>{drives.length} drives registered</span>
        </div>

        {drives.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            No placement drives posted yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Role / Designation</th>
                  <th style={{ padding: '14px 20px' }}>Package (CTC)</th>
                  <th style={{ padding: '14px 20px' }}>TNP Status</th>
                  <th style={{ padding: '14px 20px' }}>Application Deadline</th>
                  <th style={{ padding: '14px 20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {drives.map((d: any) => (
                  <tr key={d._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#111827' }}>{d.role}</td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#111827' }}>{d.ctc}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                        backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                        color: d.status === 'APPLICATIONS_OPEN' || d.status === 'APPROVED' ? '#15803D' : '#475569',
                      }}>
                        {d.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748B' }}>
                      {new Date(d.applicationDeadline).toLocaleDateString('en-GB')}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => setActiveTab('company-applicants')}
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        View Applicants
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
