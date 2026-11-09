import React, { useState } from 'react';
import { 
  Building2, 
  GraduationCap, 
  ShieldCheck, 
  Mail, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  LockKeyhole
} from 'lucide-react';
import type { PortalMode } from '../../types';
import { api } from '../../services/api';

interface LoginViewProps {
  onLoginSuccess: (user: any, mode: PortalMode) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<PortalMode>('STUDENT');
  const [email, setEmail] = useState('231cs001.faizaan@giet.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rolePresets: Record<PortalMode, {
    roleTitle: string;
    roleTag: string;
    email: string;
    password: string;
    icon: any;
    color: string;
    description: string;
  }> = {
    STUDENT: {
      roleTitle: 'Student',
      roleTag: 'Placement Portal',
      email: '231cs001.faizaan@giet.edu',
      password: 'password123',
      icon: GraduationCap,
      color: '#2563EB',
      description: 'Access smart drive matches, 6-pillar readiness score, verify marksheets & accept offers.',
    },
    TNP: {
      roleTitle: 'TNP Cell',
      roleTag: 'Admin Control',
      email: 'tnp@giet.edu',
      password: 'admin123',
      icon: ShieldCheck,
      color: '#0284C7',
      description: 'Review company drive requests, override academic records, audit funnel & manage policy.',
    },
    COMPANY: {
      roleTitle: 'Recruiter',
      roleTag: 'Corporate Portal',
      email: 'recruiter@google.com',
      password: 'password123',
      icon: Building2,
      color: '#0D9488',
      description: 'Post campus hiring drives, define eligibility cutoffs, review candidate fit & release offers.',
    }
  };

  const handleRoleSelect = (role: PortalMode) => {
    setSelectedRole(role);
    setEmail(rolePresets[role].email);
    setPassword(rolePresets[role].password);
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await api.login(customEmail || email, customPass || password);
      if (res.data) {
        const mode = normalizeRole(res.data.role);
        onLoginSuccess(res.data, mode);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const normalizeRole = (role: string): PortalMode => {
    const r = role?.toUpperCase();
    if (r === 'TNP' || r === 'TNP_ADMIN' || r === 'TPO' || r === 'ADMIN' || r === 'SUPER_ADMIN') {
      return 'TNP';
    }
    if (r === 'COMPANY' || r === 'RECRUITER') {
      return 'COMPANY';
    }
    return 'STUDENT';
  };

  const currentPreset = rolePresets[selectedRole];

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      backgroundImage: `
        radial-gradient(ellipse at center, rgba(15, 23, 42, 0.68) 0%, rgba(9, 14, 26, 0.88) 100%),
        url('/giet-campus.jpg')
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      padding: '24px 16px',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    }}>
      {/* Main Glassmorphic Login Card */}
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        padding: '36px 32px 28px 32px',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 10
      }}>
        {/* University Header with Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          paddingBottom: '20px',
          borderBottom: '1px solid #E2E8F0',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1.5px solid #E2E8F0',
            padding: '4px',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.12)'
          }}>
            <img 
              src="/gietu_logo.png" 
              alt="GIET University Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.28rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
              color: '#0F172A'
            }}>
              GIET UNIVERSITY
            </h2>
            <div style={{
              fontSize: '0.75rem',
              color: '#64748B',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginTop: '2px'
            }}>
              Training & Placement Cell
            </div>
          </div>
        </div>

        {/* Portal Greeting */}
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#0F172A',
            margin: '0 0 4px 0'
          }}>
            Select Portal & Sign In
          </h3>
          <p style={{
            margin: 0,
            fontSize: '0.82rem',
            color: '#64748B',
            lineHeight: 1.45
          }}>
            Authenticate with your institutional or corporate credentials.
          </p>
        </div>

        {/* 3-Role Switcher Tabs */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '6px',
          marginBottom: '16px',
          backgroundColor: '#F1F5F9',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid #E2E8F0'
        }}>
          {(['STUDENT', 'TNP', 'COMPANY'] as PortalMode[]).map((mode) => {
            const item = rolePresets[mode];
            const isSelected = selectedRole === mode;
            const ItemIcon = item.icon;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => handleRoleSelect(mode)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '3px',
                  padding: '9px 4px',
                  borderRadius: '9px',
                  border: isSelected ? '1px solid #DBEAFE' : '1px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                  color: isSelected ? '#1D4ED8' : '#64748B',
                  fontWeight: isSelected ? 700 : 500,
                  fontSize: '0.78rem',
                  boxShadow: isSelected ? '0 2px 6px rgba(37, 99, 235, 0.12)' : 'none',
                  transition: 'all 0.18s ease'
                }}
              >
                <ItemIcon size={18} color={isSelected ? '#2563EB' : '#64748B'} />
                <span>{item.roleTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Student Switcher for Demo */}
        {selectedRole === 'STUDENT' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '14px',
            flexWrap: 'wrap'
          }}>
            <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Quick Student Demo:</span>
            {[
              { name: 'Faizaan (Complete)', email: '231cs001.faizaan@giet.edu' },
              { name: 'Dilip (Unfilled)', email: '231cs088.dilip@giet.edu' },
              { name: 'Sravan (Unfilled)', email: '231cs092.sravan@giet.edu' }
            ].map(s => {
              const isActive = email === s.email;
              return (
                <button
                  key={s.email}
                  type="button"
                  onClick={() => {
                    setEmail(s.email);
                    setPassword('password123');
                  }}
                  style={{
                    backgroundColor: isActive ? '#EFF6FF' : '#F8FAFC',
                    border: `1px solid ${isActive ? '#BFDBFE' : '#E2E8F0'}`,
                    color: isActive ? '#1D4ED8' : '#475569',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.73rem',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#DC2626',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            marginBottom: '16px',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={(e) => handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '6px'
            }}>
              Official Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail 
                size={17} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '11px',
                  color: '#94A3B8'
                }} 
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#F8FAFC';
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#334155',
              marginBottom: '6px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <LockKeyhole 
                size={17} 
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '11px',
                  color: '#94A3B8'
                }} 
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '0.88rem',
                  outline: 'none',
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  transition: 'all 0.15s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.borderColor = '#2563EB';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = '#F8FAFC';
                  e.target.style.borderColor = '#E2E8F0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
              transition: 'all 0.15s ease',
              marginTop: '6px'
            }}
          >
            {loading ? (
              <>
                <Loader2 size={17} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to {currentPreset.roleTitle} Portal</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* Institutional Card Footer */}
        <div style={{
          marginTop: '22px',
          paddingTop: '16px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '0.74rem',
          color: '#64748B'
        }}>
          <CheckCircle2 size={14} color="#10B981" />
          <span>Secure Institutional Sign In • GIET University</span>
        </div>
      </div>
    </div>
  );
};