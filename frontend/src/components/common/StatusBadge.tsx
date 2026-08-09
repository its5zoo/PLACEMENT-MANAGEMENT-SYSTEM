import React from 'react';

interface StatusBadgeProps {
  status: 'Applied' | 'In-Progress' | 'Selected' | 'Rejected' | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status === 'In-Progress' ? 'In-Progress' : status.replace(/\s+/g, '-');
  const displayStatus = status === 'In-Progress' ? 'In Progress' : status;

  return (
    <span className={`status-badge ${normalizedStatus}`}>
      {displayStatus}
    </span>
  );
};
