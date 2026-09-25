import React from 'react';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const PlacementDriveView: React.FC = () => {
  const drives = [
    { 
      id: 1, 
      company: 'Microsoft India', 
      date: 'Tomorrow, 10:00 AM', 
      round: 'Technical Interview Round 1', 
      venue: 'Virtual (Teams Meeting)', 
      eligibility: 'CSE & IT • CGPA >= 7.5',
      status: 'In-Progress' 
    },
    { 
      id: 2, 
      company: 'Google India', 
      date: '25 May 2024, 09:00 AM', 
      round: 'Online Coding Assessment (OA)', 
      venue: 'Lab 4 & Lab 5, Main Computer Center', 
      eligibility: 'All B.Tech • No Active Backlogs',
      status: 'In-Progress' 
    },
    { 
      id: 3, 
      company: 'Goldman Sachs', 
      date: '28 May 2024, 02:00 PM', 
      round: 'Pre-Placement Talk (PPT) & Q&A', 
      venue: 'Auditorium Hall B', 
      eligibility: 'Final Year Registered Students',
      status: 'In-Progress' 
    },
  ];

  return (
    <div className="view-container">
      {/* Top Banner Card */}
      <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Calendar size={18} color="#2563eb" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              Campus Drive Schedule
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b' }}>
            Official dates, assessment venues, and interview rounds managed by the Training & Placement Cell.
          </p>
        </div>

        <span style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '0.8rem', fontWeight: 700, padding: '4px 12px', borderRadius: '16px' }}>
          3 Upcoming Sessions
        </span>
      </div>

      {/* Drives Schedule Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {drives.map(d => (
          <div key={d.id} className="section-card" style={{ padding: '18px 22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{d.company}</h3>
                <span style={{ fontSize: '0.84rem', color: '#2563eb', fontWeight: 600 }}>{d.round}</span>
              </div>
              <StatusBadge status={d.status} />
            </div>

            <div style={{ display: 'flex', gap: '20px', marginTop: '12px', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap', borderTop: '1px solid #f8fafc', paddingTop: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {d.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {d.venue}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={14} /> {d.eligibility}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
