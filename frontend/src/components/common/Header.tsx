import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { ActiveTab } from '../../types';

interface HeaderProps {
  activeTab: ActiveTab;
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Student Dashboard';
      case 'profile': return 'My Student Profile';
      case 'job-listings': return 'Campus Job Listings';
      case 'my-applications': return 'My Applications Status';
      case 'companies': return 'Recruiting Companies';
      case 'placement-drive': return 'Placement Drive Schedule';
      case 'resources': return 'Interview & Study Resources';
      case 'training-skills': return 'Training & Skill Courses';
      case 'messages': return 'Messages & Announcements';
      case 'settings': return 'Account Settings';
      default: return 'Student Dashboard';
    }
  };

  const notifications = [
    { id: 1, title: 'Google Shortlist Released', time: '10 mins ago', icon: Sparkles, color: '#3b82f6' },
    { id: 2, title: 'Microsoft Technical Interview Tomorrow', time: '1 hour ago', icon: AlertCircle, color: '#d97706' },
    { id: 3, title: 'Infosys Offer Letter Received!', time: 'Yesterday', icon: CheckCircle2, color: '#16a34a' }
  ];

  return (
    <header className="top-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
          <Menu size={22} />
        </button>
        <h1 className="page-title">{getPageTitle(activeTab)}</h1>
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="notification-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="notif-badge">3</span>
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '320px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0',
              padding: '16px',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.95rem' }}>Placement Alerts</strong>
                <span style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}>Mark all read</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {notifications.map(n => {
                  const Icon = n.icon;
                  return (
                    <div key={n.id} style={{ display: 'flex', gap: '12px', padding: '8px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                      <div style={{ color: n.color, marginTop: '2px' }}><Icon size={18} /></div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{n.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{n.time}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <div 
            className="user-profile-menu"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <img 
              src="/doraemon.png" 
              alt="Doraemon Profile" 
              className="avatar" 
            />
            <div className="user-details">
              <span className="user-name">Faizaan</span>
              <span className="user-role">B.Tech CSE</span>
            </div>
            <ChevronDown size={16} style={{ color: '#64748b' }} />
          </div>

          {showUserDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '52px',
              width: '200px',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              padding: '8px',
              zIndex: 50
            }}>
              <div style={{ padding: '8px 12px', fontSize: '0.8rem', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                Roll No: 21CSE1042
              </div>
              <button 
                onClick={() => { setShowUserDropdown(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', color: '#0f172a' }}
              >
                View Profile
              </button>
              <button 
                onClick={() => { setShowUserDropdown(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.88rem', color: '#ef4444' }}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
