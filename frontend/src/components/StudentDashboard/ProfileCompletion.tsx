import React from 'react';
import { User, FileText, Code2, Award } from 'lucide-react';

interface CompletionItem {
  id: number;
  name: string;
  percentage: number;
  icon: any;
  colorScheme: 'cobalt' | 'emerald' | 'indigo' | 'amber';
}

export const ProfileCompletion: React.FC = () => {
  const completionItems: CompletionItem[] = [
    {
      id: 1,
      name: 'Academic Profile',
      percentage: 85,
      icon: User,
      colorScheme: 'cobalt',
    },
    {
      id: 2,
      name: 'Resume & Verified Marksheets',
      percentage: 75,
      icon: FileText,
      colorScheme: 'emerald',
    },
    {
      id: 3,
      name: 'Technical Skills Matrix',
      percentage: 65,
      icon: Code2,
      colorScheme: 'indigo',
    },
    {
      id: 4,
      name: 'Certifications & Projects',
      percentage: 50,
      icon: Award,
      colorScheme: 'amber',
    }
  ];

  const schemeStyles: Record<string, { iconBg: string; iconColor: string; iconBorder: string; fillGradient: string }> = {
    cobalt: {
      iconBg: '#2563EB',
      iconColor: '#FFFFFF',
      iconBorder: '#1D4ED8',
      fillGradient: 'linear-gradient(90deg, #3B82F6 0%, #2563EB 100%)',
    },
    emerald: {
      iconBg: '#059669',
      iconColor: '#FFFFFF',
      iconBorder: '#047857',
      fillGradient: 'linear-gradient(90deg, #10B981 0%, #059669 100%)',
    },
    indigo: {
      iconBg: '#4F46E5',
      iconColor: '#FFFFFF',
      iconBorder: '#4338CA',
      fillGradient: 'linear-gradient(90deg, #818CF8 0%, #6366F1 100%)',
    },
    amber: {
      iconBg: '#D97706',
      iconColor: '#FFFFFF',
      iconBorder: '#B45309',
      fillGradient: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 100%)',
    },
  };

  return (
    <div className="section-card">
      <div className="card-header">
        <h3 className="card-title">Placement Profile Completion</h3>
        <span style={{
          fontSize: '0.78rem',
          color: '#1E293B',
          fontWeight: 700,
          backgroundColor: '#F1F5F9',
          padding: '3px 10px',
          borderRadius: '999px',
          border: '1px solid #CBD5E1'
        }}>
          Overall: 72%
        </span>
      </div>

      <div className="progress-list">
        {completionItems.map((item) => {
          const Icon = item.icon;
          const style = schemeStyles[item.colorScheme];
          return (
            <div key={item.id} className="progress-item">
              <div className="progress-header">
                <div className="progress-label-box">
                  <div 
                    className="progress-icon" 
                    style={{ 
                      backgroundColor: style.iconBg, 
                      color: style.iconColor, 
                      border: `1px solid ${style.iconBorder}` 
                    }}
                  >
                    <Icon size={15} />
                  </div>
                  <span className="progress-name">{item.name}</span>
                </div>
                <span className="progress-percentage">{item.percentage}%</span>
              </div>

              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{ 
                    width: `${item.percentage}%`, 
                    background: style.fillGradient,
                    boxShadow: `0 1px 3px ${style.iconColor}33`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};