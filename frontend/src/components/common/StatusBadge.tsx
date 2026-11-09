import React from 'react';

interface StatusBadgeProps {
  status: 'Applied' | 'In-Progress' | 'Selected' | 'Rejected' | 'SHORTLISTED' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const norm = (status || '').toUpperCase().replace(/[\s_-]+/g, '');

  let color = '#475569';

  if (norm.includes('SHORTLIST') || norm.includes('SELECTED') || norm.includes('OFFER') || norm.includes('ACCEPTED') || norm.includes('PLACED') || norm.includes('VERIFIED')) {
    color = '#047857';
  } else if (norm.includes('APPLIED')) {
    color = '#1D4ED8';
  } else if (norm.includes('PROCESS') || norm.includes('PROGRESS') || norm.includes('REVIEW') || norm.includes('PENDING')) {
    color = '#B45309';
  } else if (norm.includes('REJECT') || norm.includes('DECLINE') || norm.includes('WITHDRAW')) {
    color = '#DC2626';
  }

  return (
    <span 
      className="status-label"
      style={{
        display: 'inline-block',
        fontSize: '0.78rem',
        fontWeight: 700,
        color: color,
        letterSpacing: '0.02em',
        lineHeight: 1.2
      }}
    >
      {status}
    </span>
  );
};