import { useState } from 'react';
import { Sidebar, Header, ApplicationModal } from './components/common';
import { 
  DashboardView, 
  ProfileView, 
  JobListingsView, 
  MyApplicationsView, 
  CompaniesView, 
  PlacementDriveView, 
  ResourcesView, 
  TrainingSkillsView, 
  MessagesView, 
  SettingsView 
} from './components/StudentDashboard';
import type { ActiveTab, ApplicationItem } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            setActiveTab={setActiveTab} 
            onSelectApplication={(app) => setSelectedApp(app)} 
          />
        );
      case 'profile':
        return <ProfileView />;
      case 'job-listings':
        return <JobListingsView />;
      case 'my-applications':
        return <MyApplicationsView />;
      case 'companies':
        return <CompaniesView />;
      case 'placement-drive':
        return <PlacementDriveView />;
      case 'resources':
        return <ResourcesView />;
      case 'training-skills':
        return <TrainingSkillsView />;
      case 'messages':
        return <MessagesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView 
            setActiveTab={setActiveTab} 
            onSelectApplication={(app) => setSelectedApp(app)} 
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Reusable Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Reusable Header */}
        <Header 
          activeTab={activeTab} 
          toggleSidebar={toggleSidebar} 
        />

        {/* Student Dashboard Dynamic Content */}
        <main className="content-body">
          {renderActiveView()}
        </main>
      </div>

      {/* Reusable Application Modal */}
      <ApplicationModal 
        app={selectedApp} 
        onClose={() => setSelectedApp(null)} 
      />
    </div>
  );
}

export default App;
