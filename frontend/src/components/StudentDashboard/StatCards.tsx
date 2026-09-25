import React from 'react';
import { Send, Hourglass, Medal, TrendingUp } from 'lucide-react';

interface StatCardsProps {
  onCardClick?: (tab: string) => void;
  counts?: {
    jobsApplied?: number;
    inProgress?: number;
    offersReceived?: number;
  };
}

export const StatCards: React.FC<StatCardsProps> = ({ onCardClick, counts }) => {
  const stats = [
    {
      id: 'jobs-applied',
      label: 'Jobs Applied',
      value: counts?.jobsApplied !== undefined ? String(counts.jobsApplied) : '5',
      icon: Send,
      color: 'blue',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      value: counts?.inProgress !== undefined ? String(counts.inProgress) : '2',
      icon: Hourglass,
      color: 'amber',
    },
    {
      id: 'offers-received',
      label: 'Offers Received',
      value: counts?.offersReceived !== undefined ? String(counts.offersReceived) : '1',
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
