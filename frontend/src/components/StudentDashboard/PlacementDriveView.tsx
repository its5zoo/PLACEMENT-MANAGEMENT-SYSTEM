import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const PlacementDriveView: React.FC = () => {
  const drives = [
    { id: 1, company: 'Microsoft India', date: 'Tomorrow, 10:00 AM', round: 'Technical Interview 1', venue: 'Virtual (Teams)', eligibility: 'CSE & IT • CGPA >= 7.5' },
    { id: 2, company: 'Google India', date: '25 May 2024, 09:00 AM', round: 'Online Coding Assessment', venue: 'Lab 4 & Lab 5, Main Block', eligibility: 'All B.Tech • No Backlogs' },
    { id: 3, company: 'Goldman Sachs', date: '28 May 2024, 02:00 PM', round: 'Pre-Placement Talk & PPT', venue: 'Auditorium Hall B', eligibility: 'Open to All Final Year Students' },
  ];

  return (
    <div className="view-container">
      <div className="welcome-card" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)', borderColor: '#d8b4fe' }}>
        <div>
          <h2 style={{ color: '#6b21a8' }}>Upcoming Campus Drives Schedule</h2>
          <p style={{ color: '#9333ea' }}>Stay prepared for your upcoming interview rounds and online tests.</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {drives.map(d => (
          <div key={d.id} className="section-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{d.company}</h3>
                <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 600 }}>{d.round}</span>
              </div>
              <StatusBadge status="In-Progress" />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '14px', fontSize: '0.85rem', color: '#475569', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} /> {d.venue}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={15} /> {d.eligibility}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
