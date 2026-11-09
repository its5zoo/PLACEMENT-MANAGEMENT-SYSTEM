import React from 'react';
import { ArrowRight } from 'lucide-react';

interface WelcomeBannerProps {
  onCheckMatches?: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onCheckMatches }) => {
  return (
    <div className="welcome-card">
      <div className="welcome-content">
        <div className="welcome-text">
          <h2>Welcome back, Faizaan</h2>
          <p>B.Tech Computer Science & Engineering • 2024–2025 Placement Season</p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {onCheckMatches && (
          <button 
            className="btn-primary" 
            onClick={onCheckMatches}
            style={{
              fontSize: '0.84rem',
              padding: '9px 18px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.38)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.28)';
            }}
          >
            <span>Smart Matches</span>
            <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
};