import { useState, useEffect } from 'react';
import { Sidebar, Header, ApplicationModal, LoginView } from './components/common';
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
  SettingsView,
  RecommendationsView,
  ReadinessScoreView,
  DocumentsView,
  OffersView
} from './components/StudentDashboard';
import {
  TnpDashboardView,
  CompanyRequestsView,
  TnpStudentsView,
  TnpDocumentsView,
  TnpCasesView,
  TnpPolicyView,
  TnpAuditView
} from './components/TnpPortal';
import {
  CompanyDashboardView,
  CreateDriveView,
  CompanyApplicantsView
} from './components/CompanyPortal';
import { api, normalizeRole } from './services/api';
import type { ActiveTab, ApplicationItem, PortalMode } from './types';

export function App() {
  const [currentUser, setCurrentUser] = useState<any>(() => api.getCurrentUser());
  const [portalMode, setPortalMode] = useState<PortalMode>(() => {
    const user = api.getCurrentUser();
    return user ? normalizeRole(user.role) : 'STUDENT';
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);

  useEffect(() => {
    if (currentUser) {
      const mode = normalizeRole(currentUser.role);
      setPortalMode(mode);
      if (mode === 'STUDENT' && activeTab.startsWith('tnp-')) setActiveTab('dashboard');
      if (mode === 'TNP' && !activeTab.startsWith('tnp-')) setActiveTab('tnp-dashboard');
      if (mode === 'COMPANY' && !activeTab.startsWith('company-')) setActiveTab('company-dashboard');
    }
  }, [currentUser]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLoginSuccess = (user: any, mode: PortalMode) => {
    setCurrentUser(user);
    setPortalMode(mode);
    if (mode === 'STUDENT') setActiveTab('dashboard');
    else if (mode === 'TNP') setActiveTab('tnp-dashboard');
    else if (mode === 'COMPANY') setActiveTab('company-dashboard');
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveTab('dashboard');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      // --- Student Portal Views ---
      case 'dashboard':
        return (
          <DashboardView 
            setActiveTab={setActiveTab} 
            onSelectApplication={(app) => setSelectedApp(app)} 
          />
        );
      case 'profile':
        return <ProfileView />;
      case 'recommendations':
        return <RecommendationsView />;
      case 'readiness':
        return <ReadinessScoreView />;
      case 'job-listings':
        return <JobListingsView portalMode={portalMode} />;
      case 'my-applications':
        return <MyApplicationsView />;
      case 'documents':
        return <DocumentsView />;
      case 'offers':
        return <OffersView />;
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

      // --- TNP Cell Portal Views ---
      case 'tnp-dashboard':
        return <TnpDashboardView setActiveTab={setActiveTab} />;
      case 'tnp-requests':
        return <CompanyRequestsView />;
      case 'tnp-students':
        return <TnpStudentsView />;
      case 'tnp-documents':
        return <TnpDocumentsView />;
      case 'tnp-cases':
        return <TnpCasesView />;
      case 'tnp-policy':
        return <TnpPolicyView />;
      case 'tnp-audit':
        return <TnpAuditView />;

      // --- Company Portal Views ---
      case 'company-dashboard':
        return <CompanyDashboardView setActiveTab={setActiveTab} />;
      case 'company-create-drive':
        return <CreateDriveView setActiveTab={setActiveTab} />;
      case 'company-applicants':
        return <CompanyApplicantsView />;
      case 'company-profile':
        return <CompanyDashboardView setActiveTab={setActiveTab} />;

      default:
        return (
          <DashboardView 
            setActiveTab={setActiveTab} 
            onSelectApplication={(app) => setSelectedApp(app)} 
          />
        );
    }
  };

  // If user is not authenticated, present the Role-Based Login Screen
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Reusable Sidebar with authenticated role and onLogout */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen}
        portalMode={portalMode}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Reusable Header with Active Role Badge, User Info & Logout */}
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          toggleSidebar={toggleSidebar}
          portalMode={portalMode}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Dynamic Portal & View Content */}
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

