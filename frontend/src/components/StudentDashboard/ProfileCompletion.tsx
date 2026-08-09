import React from 'react';
import { User, FileText, Code2, Award } from 'lucide-react';

export const ProfileCompletion: React.FC = () => {
  const completionItems = [
    {
      id: 1,
      name: 'Profile Completion',
      percentage: 85,
      icon: User,
      color: 'blue'
    },
    {
      id: 2,
      name: 'Resume Score',
      percentage: 75,
      icon: FileText,
      color: 'green'
    },
    {
      id: 3,
      name: 'Skills Added',
      percentage: 65,
      icon: Code2,
      color: 'purple'
    },
    {
      id: 4,
      name: 'Certifications',
      percentage: 40,
      icon: Award,
      color: 'orange'
    }
  ];

  return (
    <div className="section-card">
      <div className="card-header">
        <h3 className="card-title">Placement Profile Completion</h3>
      </div>

      <div className="progress-list">
        {completionItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="progress-item">
              <div className="progress-header">
                <div className="progress-label-box">
                  <div className={`progress-icon ${item.color}`}>
                    <Icon size={17} />
                  </div>
                  <span className="progress-name">{item.name}</span>
                </div>
                <span className="progress-percentage">{item.percentage}%</span>
              </div>

              <div className="progress-bar-container">
                <div 
                  className={`progress-bar-fill ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
