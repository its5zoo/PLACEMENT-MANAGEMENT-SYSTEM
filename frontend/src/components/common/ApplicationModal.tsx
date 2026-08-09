import React from 'react';
import { X, MapPin, DollarSign, Calendar, CheckCircle, Clock } from 'lucide-react';
import type { ApplicationItem } from '../../types';

interface ApplicationModalProps {
  app: ApplicationItem | null;
  onClose: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({ app, onClose }) => {
  if (!app) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              color: '#2563eb'
            }}>
              {app.logo}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{app.company}</h3>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{app.role}</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.88rem', color: '#64748b' }}>Application Status:</span>
            <span className={`status-badge ${app.status.replace(/\s+/g, '-')}`}>
              {app.status === 'In-Progress' ? 'In Progress' : app.status}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '10px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
              <MapPin size={16} color="#2563eb" />
              <span>Location: <strong>{app.location || 'Bangalore, India'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
              <DollarSign size={16} color="#16a34a" />
              <span>Package: <strong>{app.ctc || 'Rs. 24 LPA'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
              <Calendar size={16} color="#d97706" />
              <span>Applied On: <strong>{app.date}</strong></span>
            </div>
          </div>

          {/* Interview Stages Timeline */}
          <div>
            <h4 style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '10px' }}>Selection Process Stage</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#16a34a' }}>
                <CheckCircle size={16} /> <span>1. Resume Screening - Cleared</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: app.status === 'Applied' ? '#64748b' : '#16a34a' }}>
                {app.status === 'Applied' ? <Clock size={16} /> : <CheckCircle size={16} />} 
                <span>2. Online Coding Assessment - {app.status === 'Applied' ? 'Pending' : 'Completed'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: app.status === 'Selected' ? '#16a34a' : '#64748b' }}>
                {app.status === 'Selected' ? <CheckCircle size={16} /> : <Clock size={16} />} 
                <span>3. Technical & HR Interview Round - {app.status === 'Selected' ? 'Selected' : 'Upcoming'}</span>
              </div>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
          Close Details
        </button>
      </div>
    </div>
  );
};
