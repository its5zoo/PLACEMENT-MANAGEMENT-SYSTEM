import React from 'react';
import { Award } from 'lucide-react';

export const TrainingSkillsView: React.FC = () => {
  const courses = [
    { title: 'Fullstack MERN Stack Bootcamp', duration: '6 Weeks', progress: 80, instructor: 'TNP Faculty' },
    { title: 'Aptitude & Logical Reasoning Masterclass', duration: '4 Weeks', progress: 100, instructor: 'Career Services' },
    { title: 'Communication & Mock Interview Skills', duration: '2 Weeks', progress: 45, instructor: 'External Mentor' },
  ];

  return (
    <div className="view-container">
      <div className="section-card">
        <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Award size={20} color="#2563EB" />
          Enrolled Training Programs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {courses.map((c, idx) => (
            <div key={idx} style={{ padding: '16px', border: '1px solid #E2E8F0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{c.title}</h4>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600 }}>{c.duration}</span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill blue" style={{ width: `${c.progress}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748B' }}>
                <span>Instructor: {c.instructor}</span>
                <strong style={{ color: c.progress === 100 ? '#15803D' : '#2563EB' }}>{c.progress}% Completed</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
