import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ApplicationItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface RecentApplicationsProps {
  onViewAll?: () => void;
  onSelectApplication?: (app: ApplicationItem) => void;
  applications?: ApplicationItem[];
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({ 
  onViewAll, 
  onSelectApplication,
  applications: propApps
}) => {
  const defaultApplications: ApplicationItem[] = [
    {
      id: 'app-1',
      company: 'Microsoft Corporation',
      role: 'Frontend Software Engineer',
      status: 'SHORTLISTED',
      date: '18 May 2027',
      logo: 'MS',
      logoBg: '#ffffff',
      location: 'Hyderabad, India',
      ctc: 'Rs. 22 LPA'
    },
    {
      id: 'app-2',
      company: 'Google India',
      role: 'Software Engineer - Campus 2027',
      status: 'APPLIED',
      date: '20 May 2027',
      logo: 'G',
      logoBg: '#ffffff',
      location: 'Bangalore, India',
      ctc: 'Rs. 24 LPA'
    },
    {
      id: 'app-3',
      company: 'Amazon Web Services',
      role: 'SDE-1 (Graduate Engineer)',
      status: 'APPLIED',
      date: '15 May 2027',
      logo: 'AMZ',
      logoBg: '#ffffff',
      location: 'Bangalore, India',
      ctc: 'Rs. 28 LPA'
    }
  ];

  const applications = (propApps && propApps.length > 0) ? propApps : defaultApplications;

  const renderLogo = (app: ApplicationItem) => {
    const comp = app.company || '';
    if (comp.includes('Google') || app.logo === 'G') {
      return (
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      );
    }
    if (comp.includes('Microsoft') || app.logo === 'MS') {
      return (
        <svg width="18" height="18" viewBox="0 0 23 23">
          <path fill="#F25022" d="M1 1h10v10H1z"/>
          <path fill="#7FBA00" d="M12 1h10v10H12z"/>
          <path fill="#00A4EF" d="M1 12h10v10H1z"/>
          <path fill="#FFB900" d="M12 12h10v10H12z"/>
        </svg>
      );
    }
    if (comp.includes('Amazon') || app.logo === 'AMZ') {
      return (
        <span style={{ color: '#D97706', fontWeight: 800, fontSize: '0.82rem', letterSpacing: '-0.02em' }}>
          AMZ
        </span>
      );
    }
    return <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1E293B' }}>{app.logo || comp.slice(0, 2).toUpperCase()}</span>;
  };

  return (
    <div className="section-card">
      <div className="card-header">
        <h3 className="card-title">Recent Applications</h3>
        <button 
          className="link-btn" 
          onClick={onViewAll}
          style={{
            fontSize: '0.8rem',
            fontWeight: 700,
            color: '#2563EB',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: '2px 6px',
            borderRadius: '6px',
            transition: 'color 0.15s ease'
          }}
        >
          View All
        </button>
      </div>

      <div className="applications-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {applications.map((app) => (
          <div 
            key={app.id} 
            className="application-item"
            onClick={() => onSelectApplication?.(app)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F8FAFC';
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E2E8F0';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div className="company-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                className="company-logo"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  flexShrink: 0
                }}
              >
                {renderLogo(app)}
              </div>
              <div className="company-details" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="company-name" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.25 }}>
                  {app.company}
                </span>
                <span className="job-role" style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                  {app.role}
                </span>
              </div>
            </div>

            <div className="application-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <StatusBadge status={app.status} />
              <span className="app-date" style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 500 }}>
                {app.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer-link" style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
        <button 
          className="link-btn" 
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            padding: '8px 0',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: '#2563EB',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.15s ease'
          }}
          onClick={onViewAll}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#1D4ED8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#2563EB'; }}
        >
          <span>View All Applications</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};