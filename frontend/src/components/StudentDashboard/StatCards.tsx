import React from 'react';
import { Send, Hourglass, Medal, TrendingUp } from 'lucide-react';

interface StatCardsProps {
  onCardClick?: (tab: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ onCardClick }) => {
  const stats = [
    {
      id: 'jobs-applied',
      label: 'Jobs Applied',
      value: '12',
      icon: Send,
      color: 'blue',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      value: '3',
      icon: Hourglass,
      color: 'amber',
    },
    {
      id: 'offers-received',
      label: 'Offers Received',
      value: '1',
      icon: Medal,
      color: 'green',
    },
  ];

  return (
    <div className="metrics-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div 
            key={stat.id} 
            className="stat-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onCardClick?.(stat.id)}
          >
            <div className="stat-left">
              <div className={`stat-icon-wrapper ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div className="stat-details">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-number">{stat.value}</span>
              </div>
            </div>

            <div className={`trend-badge ${stat.color}`}>
              <TrendingUp size={16} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
