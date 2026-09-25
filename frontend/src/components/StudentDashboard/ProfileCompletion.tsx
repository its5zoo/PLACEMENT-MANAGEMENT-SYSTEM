import React from 'react';
import { User, FileText, Code2, Award } from 'lucide-react';

export const ProfileCompletion: React.FC = () => {
  const completionItems = [
    {
      id: 1,
      name: 'Academic Profile',
      percentage: 85,
      icon: User,
    },
    {
      id: 2,
      name: 'Resume & Verified Marksheets',
      percentage: 75,
      icon: FileText,
    },
    {
      id: 3,
      name: 'Technical Skills Matrix',
      percentage: 65,
      icon: Code2,
    },
    {
      id: 4,
      name: 'Certifications & Projects',
      percentage: 50,
      icon: Award,
    }
  ];

  return (
    <div className="section-card">
      <div className="card-header">
        <h3 className="card-title">Placement Profile Completion</h3>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Overall: 72%</span>
      </div>

      <div className="progress-list">
        {completionItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="progress-item">
              <div className="progress-header">
                <div className="progress-label-box">
                  <div className="progress-icon" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
                    <Icon size={16} />
                  </div>
                  <span className="progress-name">{item.name}</span>
                </div>
                <span className="progress-percentage">{item.percentage}%</span>
              </div>

              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${item.percentage}%`, backgroundColor: '#2563eb' }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
