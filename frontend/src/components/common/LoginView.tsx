import React, { useState } from 'react';
import { GraduationCap, ShieldCheck, Building2, Lock, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { api, normalizeRole } from '../../services/api';
import type { PortalMode } from '../../types';

interface LoginViewProps {
  onLoginSuccess: (user: any, mode: PortalMode) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<PortalMode>('STUDENT');
  const [email, setEmail] = useState('231cs001.faizaan@giet.edu');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-configured role profiles
  const rolePresets = {
    STUDENT: {
      roleTitle: 'Student Portal',
      email: '231cs001.faizaan@giet.edu',
      password: 'password123',
      icon: GraduationCap,
      color: '#2563eb',
      bgLight: '#eff6ff',
      description: 'Access smart drive matches, 6-pillar readiness score, verify marksheets & accept offers.',
    },
    TNP: {
      roleTitle: 'TNP Cell Admin',
      email: 'tnp@giet.edu',
      password: 'admin123',
      icon: ShieldCheck,
      color: '#0284c7',
      bgLight: '#f0f9ff',
      description: 'Review company drive requests, override academic records, audit funnel & manage policy.',
    },
    COMPANY: {
      roleTitle: 'Corporate Recruiter',
      email: 'recruiter@google.com',
      password: 'password123',
      icon: Building2,
      color: '#0d9488',
      bgLight: '#f0fdfa',
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
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const currentPreset = rolePresets[selectedRole];
  const IconComponent = currentPreset.icon;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: `linear-gradient(rgba(11, 19, 43, 0.65), rgba(11, 19, 43, 0.80)), url('/campus-flower-building.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      padding: '24px 16px',
      fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: '980px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        overflow: 'hidden'
      }}>
        {/* Left Side: Original Institutional Campus Banner with Blue Building (jo pehle tha img usko rehne diya) */}
        <div style={{
          position: 'relative',
          backgroundImage: `linear-gradient(180deg, rgba(11, 19, 43, 0.85) 0%, rgba(15, 23, 42, 0.95) 100%), url('/campus-building.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#ffffff',
          padding: '36px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div>
              {/* Logo and University Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  padding: '4px',
                  flexShrink: 0
                }}>
                  <img 
                    src="/gietu_logo.png" 
                    alt="GIET University Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.02em', color: '#ffffff' }}>
                    GIET UNIVERSITY
                  </h2>
                  <div style={{ fontSize: '0.76rem', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                    Training & Placement Cell
                  </div>
                </div>
              </div>

              {/* Simple Title & Description */}
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1.35, marginBottom: '12px', color: '#ffffff' }}>
                Campus Placement Portal
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '28px' }}>
                A unified platform connecting students, recruiters, and placement officers for smooth and transparent campus hiring.
              </p>

              {/* Simple Feature Highlights */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: '#f8fafc' }}>
                  <CheckCircle2 size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
                  <span>Simple Campus Drive Applications</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: '#f8fafc' }}>
                  <CheckCircle2 size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
                  <span>Verified Student Profiles & Marksheets</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: '#f8fafc' }}>
                  <CheckCircle2 size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
                  <span>Live Application Status & Drive Schedules</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.86rem', color: '#f8fafc' }}>
                  <CheckCircle2 size={18} color="#60a5fa" style={{ flexShrink: 0 }} />
                  <span>Direct Placement Offers & Communication</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.12)', fontSize: '0.76rem', color: '#94a3b8' }}>
              Secure Institutional Portal • GIET University Gunupur
            </div>
          </div>
        </div>

        {/* Right Side: Clean Login Form Div */}
        <div style={{
          backgroundColor: '#ffffff',
          padding: '36px 30px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 10px',
              borderRadius: '20px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              marginBottom: '10px'
            }}>
              <img src="/gietu_logo.png" alt="GIET Logo" style={{ width: '18px', height: '18px', objectFit: 'contain' }} />
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#334155', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                GIET University Official Portal
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              Select Portal & Sign In
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
              Authenticate with your assigned institutional or corporate credentials.
            </p>
          </div>

          {/* Role Switcher Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '6px',
            marginBottom: '18px',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '12px'
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
                    gap: '4px',
                    padding: '9px 4px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#ffffff' : 'transparent',
                    color: isSelected ? item.color : '#64748b',
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: '0.78rem',
                    boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ItemIcon size={18} />
                  <span>{item.roleTitle}</span>
                </button>
              );
            })}
          </div>

          {/* Role Overview Callout */}
          <div style={{
            backgroundColor: currentPreset.bgLight,
            border: `1px solid ${currentPreset.color}35`,
            borderRadius: '10px',
            padding: '11px 14px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ color: currentPreset.color, flexShrink: 0 }}>
              <IconComponent size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: currentPreset.color }}>
                {currentPreset.roleTitle} Access
              </div>
              <div style={{ fontSize: '0.74rem', color: '#475569' }}>
                {currentPreset.description}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={(e) => handleSubmit(e)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                Official Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '5px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 38px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#ffffff'
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
                padding: '11px 16px',
                borderRadius: '8px',
                backgroundColor: currentPreset.color,
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'opacity 0.2s',
                marginTop: '4px'
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to {currentPreset.roleTitle}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
