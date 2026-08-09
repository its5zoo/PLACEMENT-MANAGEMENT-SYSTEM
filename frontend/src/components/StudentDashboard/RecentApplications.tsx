import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { ApplicationItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface RecentApplicationsProps {
  onViewAll?: () => void;
  onSelectApplication?: (app: ApplicationItem) => void;
}

export const RecentApplications: React.FC<RecentApplicationsProps> = ({ 
  onViewAll, 
  onSelectApplication 
}) => {
  const applications: ApplicationItem[] = [
    {
      id: 'app-1',
      company: 'Google',
      role: 'Software Engineer',
      status: 'Applied',
      date: '20 May 2024',
      logo: 'G',
      logoBg: '#ffffff',
      location: 'Bangalore, India',
      ctc: 'Rs. 24 LPA'
    },
    {
      id: 'app-2',
      company: 'Microsoft',
      role: 'Frontend Developer',
      status: 'In-Progress',
      date: '18 May 2024',
      logo: 'MS',
      logoBg: '#ffffff',
      location: 'Hyderabad, India',
      ctc: 'Rs. 22 LPA'
    },
    {
      id: 'app-3',
      company: 'Infosys',
      role: 'System Engineer',
      status: 'Selected',
      date: '15 May 2024',
      logo: 'INF',
      logoBg: '#ffffff',
      location: 'Pune, India',
      ctc: 'Rs. 9.5 LPA'
    }
  ];

  const renderLogo = (app: ApplicationItem) => {
    if (app.company === 'Google') {
      return (
        <svg width="22" height="22" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
      );
    }
    if (app.company === 'Microsoft') {
      return (
        <svg width="20" height="20" viewBox="0 0 23 23">
          <path fill="#F25022" d="M1 1h10v10H1z"/>
          <path fill="#7FBA00" d="M12 1h10v10H12z"/>
          <path fill="#00A4EF" d="M1 12h10v10H1z"/>
          <path fill="#FFB900" d="M12 12h10v10H1z"/>
        </svg>
      );
    }
    if (app.company === 'Infosys') {
      return (
        <span style={{ color: '#007cc3', fontWeight: 800, fontSize: '0.9rem' }}>Infosys</span>
      );
    }
    return <span>{app.logo}</span>;
  };

  return (
    <div className="section-card">
      <div className="card-header">
        <h3 className="card-title">Recent Applications</h3>
        <button className="link-btn" onClick={onViewAll}>
          View All
        </button>
      </div>

      <div className="applications-list">
        {applications.map((app) => (
          <div 
            key={app.id} 
            className="application-item"
            onClick={() => onSelectApplication?.(app)}
            style={{ cursor: 'pointer' }}
          >
            <div className="company-info">
              <div className="company-logo">
                {renderLogo(app)}
              </div>
              <div className="company-details">
                <span className="company-name">{app.company}</span>
                <span className="job-role">{app.role}</span>
              </div>
            </div>

            <div className="application-meta">
              <StatusBadge status={app.status} />
              <span className="app-date">{app.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer-link">
        <button 
          className="link-btn" 
          style={{ justifyContent: 'center', width: '100%', padding: '8px 0' }}
          onClick={onViewAll}
        >
          <span>View All Applications</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
