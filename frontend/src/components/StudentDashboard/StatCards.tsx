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
      value: counts?.jobsApplied !== undefined ? String(counts.jobsApplied) : '3',
      icon: Send,
      theme: 'cobalt',
    },
    {
      id: 'in-progress',
      label: 'In Progress',
      value: counts?.inProgress !== undefined ? String(counts.inProgress) : '3',
      icon: Hourglass,
      theme: 'sky',
    },
    {
      id: 'offers-received',
      label: 'Offers Received',
      value: counts?.offersReceived !== undefined ? String(counts.offersReceived) : '0',
      icon: Medal,
      theme: 'emerald',
    },
  ];

  const themeConfig: Record<string, { iconBg: string; iconColor: string; iconBorder: string; trendBg: string; trendColor: string }> = {
    cobalt: {
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      iconBorder: '#BFDBFE',
      trendBg: '#EFF6FF',
      trendColor: '#2563EB',
    },
    sky: {
      iconBg: '#F0F9FF',
      iconColor: '#0284C7',
      iconBorder: '#BAE6FD',
      trendBg: '#F0F9FF',
      trendColor: '#0284C7',
    },
    emerald: {
      iconBg: '#ECFDF5',
      iconColor: '#059669',
      iconBorder: '#A7F3D0',
      trendBg: '#ECFDF5',
      trendColor: '#059669',
    },
  };

  return (
    <div className="metrics-grid">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const config = themeConfig[stat.theme];
        return (
          <div 
            key={stat.id} 
            className="stat-card"
            style={{
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '20px 22px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'transform 0.16s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.16s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.16s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
            onClick={() => onCardClick?.(stat.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 18px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)';
              e.currentTarget.style.borderColor = '#CBD5E1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(15, 23, 42, 0.05)';
              e.currentTarget.style.borderColor = '#E2E8F0';
            }}
          >
            <div className="stat-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div 
                className="stat-icon-wrapper"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: config.iconBg,
                  color: config.iconColor,
                  border: `1px solid ${config.iconBorder}`,
                  flexShrink: 0
                }}
              >
                <Icon size={22} />
              </div>
              <div className="stat-details" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="stat-label" style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginBottom: '2px' }}>
                  {stat.label}
                </span>
                <span className="stat-number" style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                  {stat.value}
                </span>
              </div>
            </div>

            <div 
              className="trend-badge"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: config.trendBg,
                color: config.trendColor,
                border: `1px solid ${config.iconBorder}`
              }}
            >
              <TrendingUp size={16} />
            </div>
          </div>
        );
      })}
    </div>
  );
};