import React, { useState, useEffect } from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import type { ActiveTab, PortalMode } from '../../types';
import { api } from '../../services/api';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  toggleSidebar: () => void;
  portalMode: PortalMode;
  currentUser?: any;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab,
  toggleSidebar,
  portalMode,
  currentUser,
  onLogout 
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [notifList, setNotifList] = useState<any[]>([]);

  useEffect(() => {
    loadNotifications();
  }, [portalMode]);

  const loadNotifications = async () => {
    try {
      const res = await api.getNotifications();
      if (res.data) {
        setNotifList(res.data);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const getPageTitle = (tab: ActiveTab) => {
    switch (tab) {
      case 'dashboard': return 'Student Dashboard';
      case 'profile': return 'My Student Profile';
      case 'recommendations': return 'Smart Drive Recommendations';
      case 'readiness': return 'Placement Readiness Score (6 Pillars)';
      case 'job-listings': return portalMode === 'TNP' ? 'Active Campus Placement Drives' : 'Campus Job & Drive Listings';
      case 'my-applications': return 'My Applications Status';
      case 'documents': return 'Verified Placement Documents';
      case 'offers': return 'Placement Offers & Letters';
      case 'companies': return 'Recruiting Companies';
      case 'placement-drive': return 'Placement Drive Schedule';
      case 'resources': return 'Interview & Study Resources';
      case 'training-skills': return 'Training & Skill Courses';
      case 'messages': return 'Messages & Announcements';
      case 'settings': return 'Account Settings';
      case 'tnp-dashboard': return 'TNP Central Command & Analytics';
      case 'tnp-requests': return 'Company Drive Verification Requests';
      case 'tnp-students': return 'Student Placement Master Directory';
      case 'tnp-documents': return 'Student Paperwork Approvals';
      case 'tnp-cases': return 'Placement Issue Resolution Cases';
      case 'tnp-policy': return 'Institutional Placement Policy Rules';
      case 'tnp-audit': return 'Immutable Institutional Audit Trail';
      case 'company-dashboard': return 'Recruiter Operations Dashboard';
      case 'company-profile': return 'Corporate Hiring Profile';
      case 'company-create-drive': return 'Post New Campus Placement Drive';
      case 'company-applicants': return 'Drive Applicants Review & Shortlist';
      default: return 'Placement Management System';
    }
  };

  const unreadCount = notifList.filter(n => n.unread).length;

  const defaultProfiles = {
    STUDENT: {
      name: currentUser?.name || 'Faizaan',
      role: 'B.Tech CSE',
      roll: currentUser?.studentDetails?.rollNumber ? `Roll No: ${currentUser.studentDetails.rollNumber}` : 'Roll No: 231CS001',
      avatar: currentUser?.avatar || '/doraemon.png'
    },
    TNP: {
      name: currentUser?.name || 'Prof. Rajesh Mohanty',
      role: 'Head, TNP Cell',
      roll: 'Designation: TNP_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    },
    COMPANY: {
      name: currentUser?.name || 'Sneha Sharma',
      role: 'Google Campus Talent Acquisition',
      roll: 'Entity: Google India Pvt Ltd',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150'
    }
  };

  const userProfile = defaultProfiles[portalMode];

  return (
    <header className="top-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexWrap: 'wrap', gap: '12px' }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="menu-toggle" onClick={toggleSidebar} title="Toggle Sidebar">
          <Menu size={22} />
        </button>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #E2E8F0',
          padding: '2px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          flexShrink: 0
        }}>
          <img src="/gietu_logo.png" alt="GIET Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <h1 className="page-title" style={{ margin: 0, fontSize: '1.2rem' }}>{getPageTitle(activeTab)}</h1>
          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
            GIET University Placement Portal • Unified Operations
          </div>
        </div>
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            className="notification-btn" 
            onClick={() => setShowNotifications(!showNotifications)}
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '50px',
              width: '320px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
              border: '1px solid #E2E8F0',
              padding: '16px',
              zIndex: 50
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <strong style={{ fontSize: '0.95rem', color: '#111827' }}>Placement Alerts</strong>
                <span 
                  style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600, cursor: 'pointer' }}
                  onClick={() => {
                    notifList.forEach(n => api.markNotificationRead(n._id));
                    setNotifList(prev => prev.map(n => ({ ...n, unread: false })));
                  }}
                >
                  Mark all read
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                {notifList.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'center', padding: '12px' }}>
                    No alerts yet
                  </div>
                ) : (
                  notifList.map(n => (
                    <div key={n._id || n.id} style={{ display: 'flex', gap: '12px', padding: '8px', borderRadius: '8px', backgroundColor: n.unread ? '#F1F5F9' : '#FFFFFF', border: '1px solid #E2E8F0' }}>
                      <div style={{ color: n.unread ? '#2563EB' : '#64748B', marginTop: '2px' }}>
                        <Bell size={16} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{n.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{n.time || n.createdAt?.substring(0, 10) || 'Recently'}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div style={{ position: 'relative' }}>
          <div 
            className="user-profile-menu"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 8px', borderRadius: '8px', border: '1px solid transparent' }}
          >
            <img 
              src={userProfile.avatar} 
              alt="User Profile" 
              className="avatar" 
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div className="user-details" style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="user-name" style={{ fontWeight: 600, fontSize: '0.85rem' }}>{userProfile.name}</span>
              <span className="user-role" style={{ fontSize: '0.72rem', color: '#64748B' }}>{userProfile.role}</span>
            </div>
            <ChevronDown size={16} style={{ color: '#64748B' }} />
          </div>

          {showUserDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '52px',
              width: '220px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
              border: '1px solid #E2E8F0',
              padding: '8px',
              zIndex: 50
            }}>
              <div style={{ padding: '8px 12px', fontSize: '0.78rem', color: '#64748B', borderBottom: '1px solid #E2E8F0' }}>
                {userProfile.roll}
              </div>
              <button 
                onClick={() => { 
                  setShowUserDropdown(false); 
                  if (portalMode === 'STUDENT') setActiveTab('profile');
                  else if (portalMode === 'TNP') setActiveTab('tnp-policy');
                  else setActiveTab('company-profile');
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#111827' }}
              >
                View Profile & Settings
              </button>
              <button 
                onClick={() => { 
                  setShowUserDropdown(false); 
                  onLogout();
                }}
                style={{ width: '100%', textAlign: 'left', padding: '10px 12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#DC2626', fontWeight: 600 }}
              >
                Sign Out / Switch Role
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

