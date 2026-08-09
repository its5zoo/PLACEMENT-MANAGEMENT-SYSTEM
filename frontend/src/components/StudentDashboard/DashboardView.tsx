import React from 'react';
import { WelcomeBanner } from './WelcomeBanner';
import { StatCards } from './StatCards';
import { ProfileCompletion } from './ProfileCompletion';
import { RecentApplications } from './RecentApplications';
import type { ActiveTab, ApplicationItem } from '../../types';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectApplication: (app: ApplicationItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  setActiveTab, 
  onSelectApplication 
}) => {
  return (
    <div className="view-container">
      {/* 1. Welcome Banner */}
      <WelcomeBanner />

      {/* 2. Three Metric Stat Cards */}
      <StatCards onCardClick={(tab) => {
        if (tab === 'jobs-applied' || tab === 'in-progress' || tab === 'offers-received') {
          setActiveTab('my-applications');
        }
      }} />

      {/* 3. Bottom Grid: Profile Completion (Left) & Recent Applications (Right) */}
      <div className="dashboard-grid">
        <ProfileCompletion />
        <RecentApplications 
          onViewAll={() => setActiveTab('my-applications')}
          onSelectApplication={onSelectApplication}
        />
      </div>
    </div>
  );
};
