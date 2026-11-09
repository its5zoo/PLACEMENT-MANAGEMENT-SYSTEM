import React from 'react';
import { 
  LayoutGrid, 
  User, 
  Briefcase, 
  FileText, 
  Building2, 
  Calendar, 
  Folder, 
  MessageSquare, 
  Settings, 
  LogOut,
  Target,
  FileCheck,
  Gift,
  Users,
  PlusCircle
} from 'lucide-react';
import type { ActiveTab, PortalMode } from '../../types';

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | number;
}

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  portalMode: PortalMode;
  setPortalMode?: (mode: PortalMode) => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  portalMode,
  onLogout,
}) => {
  // Student Portal Navigation
  const studentItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'profile', label: 'Student Profile', icon: User },
    { id: 'recommendations', label: 'Smart Matches', icon: Target },
    { id: 'job-listings', label: 'Job Listings', icon: Briefcase },
    { id: 'my-applications', label: 'My Applications', icon: FileText },
    { id: 'documents', label: 'Verified Docs', icon: FileCheck },
    { id: 'offers', label: 'Placement Offers', icon: Gift },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'placement-drive', label: 'Drive Schedule', icon: Calendar },
    { id: 'resources', label: 'Study Resources', icon: Folder },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
  ];

  // TNP Portal Navigation
  const tnpItems: NavItem[] = [
    { id: 'tnp-dashboard', label: 'Command Analytics', icon: LayoutGrid },
    { id: 'tnp-requests', label: 'Drive Approvals', icon: Building2 },
    { id: 'tnp-students', label: 'Student Directory', icon: User },
    { id: 'tnp-documents', label: 'Document Approvals', icon: FileCheck },
    { id: 'job-listings', label: 'Drive Operations', icon: Briefcase },
    { id: 'tnp-cases', label: 'Resolution Cases', icon: MessageSquare },
    { id: 'tnp-policy', label: 'Placement Policy', icon: Settings },
    { id: 'tnp-audit', label: 'Audit Trail', icon: FileText },
  ];

  // Company Portal Navigation
  const companyItems: NavItem[] = [
    { id: 'company-dashboard', label: 'Company Overview', icon: LayoutGrid },
    { id: 'company-profile', label: 'Company Profile', icon: Building2 },
    { id: 'company-create-drive', label: 'Post Campus Drive', icon: PlusCircle },
    { id: 'company-applicants', label: 'Candidate Review', icon: Users },
    { id: 'offers', label: 'Released Offers', icon: Gift },
    { id: 'messages', label: 'TNP Communication', icon: MessageSquare },
  ];

  const currentMenu = portalMode === 'TNP' ? tnpItems : portalMode === 'COMPANY' ? companyItems : studentItems;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div 
        className="sidebar-header" 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          padding: '20px 18px', 
          borderBottom: '1px solid var(--sidebar-border)', 
          marginBottom: '6px' 
        }}
      >
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1.5px solid #E2E8F0',
          padding: '4px',
          overflow: 'hidden',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.06)'
        }}>
          <img 
            src="/gietu_logo.png" 
            alt="GIET University Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className="brand-info" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="brand-title" style={{ fontSize: '0.98rem', fontWeight: 800, letterSpacing: '0.01em', color: 'var(--sidebar-title-color, #FFFFFF)' }}>
            GIET UNIVERSITY
          </span>
          <span className="brand-subtitle" style={{ fontSize: '0.72rem', color: 'var(--sidebar-subtitle-color, #94A3B8)', fontWeight: 600 }}>
            {portalMode === 'TNP' ? 'TNP Cell Admin' : portalMode === 'COMPANY' ? 'Corporate Recruiter' : 'Student Placement Portal'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {currentMenu.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id as ActiveTab)}
            >
              <div className="nav-item-left">
                <Icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge-count">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ padding: '12px 14px', borderTop: '1px solid var(--sidebar-border)' }}>
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <div className="nav-item-left">
            <Settings size={18} />
            <span>Settings</span>
          </div>
        </button>
        <button
          className="nav-item"
          onClick={() => {
            if (onLogout) onLogout();
            else alert('Logged out successfully.');
          }}
        >
          <div className="nav-item-left">
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
};