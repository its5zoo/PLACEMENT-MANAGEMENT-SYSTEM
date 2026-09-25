import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';

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
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #bbf7d0',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          color: '#15803d'
        }}>
          <ShieldCheck size={16} />
          <span>TNP Verified • Drive Eligible</span>
        </div>

        {onCheckMatches && (
          <button 
            className="btn-primary" 
            onClick={onCheckMatches}
            style={{ fontSize: '0.82rem', padding: '7px 14px' }}
          >
            <span>Smart Matches</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
