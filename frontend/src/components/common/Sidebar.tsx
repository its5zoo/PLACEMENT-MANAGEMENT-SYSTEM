import React from 'react';
import { 
  LayoutGrid, 
  User, 
  Briefcase, 
  FileText, 
  Building2, 
  Calendar, 
  Folder, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  LogOut,
  Target,
  Award,
  FileCheck,
  Gift,
  HelpCircle,
  Sliders,
  History,
  Users,
  PlusCircle,
  Inbox
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
    { id: 'readiness', label: 'Readiness Score', icon: Award },
    { id: 'job-listings', label: 'Job Listings', icon: Briefcase },
    { id: 'my-applications', label: 'My Applications', icon: FileText },
    { id: 'documents', label: 'Verified Docs', icon: FileCheck },
    { id: 'offers', label: 'Placement Offers', icon: Gift },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'placement-drive', label: 'Drive Schedule', icon: Calendar },
    { id: 'resources', label: 'Study Resources', icon: Folder },
    { id: 'training-skills', label: 'Training & Skills', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
  ];

  // TNP Portal Navigation
  const tnpItems: NavItem[] = [
    { id: 'tnp-dashboard', label: 'TNP Overview', icon: LayoutGrid },
    { id: 'tnp-requests', label: 'Company Requests', icon: Inbox, badge: 'Review' },
    { id: 'job-listings', label: 'Active Campus Drives', icon: Briefcase },
    { id: 'tnp-students', label: 'Student Directory', icon: Users },
    { id: 'tnp-documents', label: 'Document Approvals', icon: FileCheck },
    { id: 'tnp-cases', label: 'Placement Cases', icon: HelpCircle },
    { id: 'companies', label: 'Recruiting Partners', icon: Building2 },
    { id: 'tnp-policy', label: 'Policy Settings', icon: Sliders },
    { id: 'tnp-audit', label: 'Audit Logs', icon: History },
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
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 18px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '8px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '3px',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <img 
            src="/gietu_logo.png" 
            alt="GIET University Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
        <div className="brand-info" style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="brand-title" style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>
            GIET UNIVERSITY
          </span>
          <span className="brand-subtitle" style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 500 }}>
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
                <Icon size={19} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="badge-count" style={{
                  backgroundColor: item.badge === 'New' ? '#2563eb' : item.badge === 'Review' ? '#d97706' : '#ef4444'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <div className="nav-item-left">
            <Settings size={19} />
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
            <LogOut size={19} />
            <span>Logout</span>
          </div>
        </button>
      </div>
    </aside>
  );
};
