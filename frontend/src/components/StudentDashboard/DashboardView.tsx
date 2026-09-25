import React, { useState, useEffect } from 'react';
import { WelcomeBanner } from './WelcomeBanner';
import { StatCards } from './StatCards';
import { ProfileCompletion } from './ProfileCompletion';
import { RecentApplications } from './RecentApplications';
import type { ActiveTab, ApplicationItem } from '../../types';
import { api } from '../../services/api';

interface DashboardViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  onSelectApplication: (app: ApplicationItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  setActiveTab, 
  onSelectApplication 
}) => {
  const [stats, setStats] = useState<{
    jobsApplied: number;
    inProgress: number;
    offersReceived: number;
  }>({ jobsApplied: 5, inProgress: 2, offersReceived: 1 });

  const [recentApps, setRecentApps] = useState<ApplicationItem[]>([]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.getDashboardStats();
      if (res.data) {
        if (res.data.stats) {
          setStats(res.data.stats);
        }
        if (res.data.recentApplications) {
          const mapped = res.data.recentApplications.map((app: any) => ({
            id: app._id,
            company: app.company,
            role: app.role,
            status: app.status,
            date: app.appliedDate || new Date(app.createdAt).toLocaleDateString('en-GB'),
            logo: app.logo || app.company.slice(0, 2).toUpperCase(),
            logoBg: app.logoBg || '#ffffff',
            location: app.location || 'India',
            ctc: app.ctc || 'Competitive',
          }));
          setRecentApps(mapped);
        }
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    }
  };

  return (
    <div className="view-container">
      {/* 1. Welcome Banner */}
      <WelcomeBanner onCheckMatches={() => setActiveTab('recommendations')} />

      {/* 2. Three Metric Stat Cards */}
      <StatCards 
        counts={stats}
        onCardClick={(tab) => {
          if (tab === 'jobs-applied' || tab === 'in-progress' || tab === 'offers-received') {
            setActiveTab('my-applications');
          }
        }} 
      />

      {/* 3. Bottom Grid: Profile Completion (Left) & Recent Applications (Right) */}
      <div className="dashboard-grid">
        <ProfileCompletion />
        <RecentApplications 
          applications={recentApps}
          onViewAll={() => setActiveTab('my-applications')}
          onSelectApplication={onSelectApplication}
        />
      </div>
    </div>
  );
};
