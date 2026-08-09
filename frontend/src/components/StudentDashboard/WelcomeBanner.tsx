import React from 'react';
import { Briefcase, CheckCircle, FileCheck } from 'lucide-react';

export const WelcomeBanner: React.FC = () => {
  return (
    <div className="welcome-card">
      <div className="welcome-content">
        <div className="wave-icon">👋</div>
        <div className="welcome-text">
          <h2>Welcome back, Faizaan!</h2>
          <p>{"Here's what's happening with your placements."}</p>
        </div>
      </div>

      <div className="welcome-illustration">
        <div className="illustration-box">
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ 
              width: '64px', 
              height: '52px', 
              backgroundColor: '#2563eb', 
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(37, 99, 235, 0.3)'
            }}>
              <Briefcase size={28} color="#ffffff" />
            </div>
            
            <div style={{ 
              position: 'absolute', 
              top: '-12px', 
              right: '-18px', 
              background: '#38bdf8', 
              borderRadius: '6px', 
              padding: '4px',
              color: '#ffffff'
            }}>
              <FileCheck size={14} />
            </div>

            <div style={{ 
              position: 'absolute', 
              bottom: '-10px', 
              left: '-20px', 
              background: '#22c55e', 
              borderRadius: '50%', 
              padding: '4px',
              color: '#ffffff'
            }}>
              <CheckCircle size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
