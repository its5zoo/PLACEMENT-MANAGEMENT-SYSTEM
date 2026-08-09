import React from 'react';
import { 
  GraduationCap, 
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
  LogOut 
} from 'lucide-react';
import type { ActiveTab } from '../../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'job-listings', label: 'Job Listings', icon: Briefcase },
    { id: 'my-applications', label: 'My Applications', icon: FileText },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'placement-drive', label: 'Placement Drive', icon: Calendar },
    { id: 'resources', label: 'Resources', icon: Folder },
    { id: 'training-skills', label: 'Training & Skills', icon: TrendingUp },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 3 },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-icon">
          <GraduationCap size={24} />
        </div>
        <div className="brand-info">
          <span className="brand-title">PMS PORTAL</span>
          <span className="brand-subtitle">Placement Management System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
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
                <span className="badge-count">{item.badge}</span>
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
          onClick={() => alert('Logged out successfully!')}
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
