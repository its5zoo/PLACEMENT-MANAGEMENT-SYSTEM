import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Download, Edit3, Award, BookOpen, Code, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getProfile();
      if (res.data) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const name = profile?.name || 'Faizaan';
  const email = profile?.email || 'faizaan@university.edu';
  const phone = profile?.phone || '+91 98765 43210';
  const location = profile?.location || 'Delhi, India';
  const avatar = profile?.avatar || '/doraemon.png';
  const student = profile?.studentDetails || {
    rollNo: '21CSE1042',
    branch: 'B.Tech Computer Science & Engineering',
    batch: '2021-2025',
    cgpa: 8.85,
    class12: '92.4%',
    class10: '94.0%',
    skills: ['React.js', 'Node.js', 'TypeScript', 'C++', 'Python', 'SQL', 'Git', 'Data Structures', 'Tailwind CSS'],
    certifications: [
      { title: 'AWS Certified Cloud Practitioner', issuer: 'Amazon Web Services', year: '2024' },
      { title: 'Meta Front-End Developer Specialization', issuer: 'Coursera', year: '2023' },
    ],
    resumeVerified: true,
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#64748b' }}>
        <Loader2 size={22} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Loading profile details...</span>
      </div>
    );
  }

  return (
    <div className="view-container">
      {/* Top Banner Card */}
      <div className="section-card" style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <img 
          src={avatar} 
          alt={`${name} Profile`} 
          style={{ width: '84px', height: '84px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{name}</h2>
                <span style={{ backgroundColor: '#ecfdf5', color: '#15803d', fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
                  Active Student
                </span>
              </div>
              <p style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.9rem', marginTop: '2px' }}>{student.branch}</p>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Roll No: {student.rollNo} • Batch: {student.batch}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-secondary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                <Download size={14} />
                <span>Download Resume</span>
              </button>
              <button className="btn-primary" style={{ padding: '7px 14px', fontSize: '0.82rem' }}>
                <Edit3 size={14} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '14px', fontSize: '0.82rem', color: '#475569', flexWrap: 'wrap', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} color="#64748b" /> {email}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} color="#64748b" /> {phone}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#64748b" /> {location}</span>
          </div>
        </div>
      </div>

      {/* Grid details */}
      <div className="dashboard-grid">
        {/* Left Column: Academic & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={16} color="#2563eb" />
              Academic Performance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Current Cumulative CGPA</span>
                <strong style={{ color: '#0f172a', fontWeight: 700 }}>8.85 / 10.0</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f8fafc', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Class 12th (Senior Secondary)</span>
                <strong style={{ color: '#0f172a' }}>92.4%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px' }}>
                <span style={{ color: '#64748b' }}>Class 10th (Secondary)</span>
                <strong style={{ color: '#0f172a' }}>94.0%</strong>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={16} color="#2563eb" />
              Verified Technical Skills
            </h3>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['React.js', 'Node.js', 'TypeScript', 'C++', 'Python', 'SQL', 'Git', 'Data Structures', 'Tailwind CSS'].map(skill => (
                <span key={skill} style={{
                  backgroundColor: '#f8fafc',
                  color: '#334155',
                  border: '1px solid #e2e8f0',
                  padding: '5px 11px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certifications & Verification Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={16} color="#2563eb" />
              Certifications & Accreditations
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', paddingBottom: '10px', borderBottom: '1px solid #f8fafc' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', marginTop: '6px' }} />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>AWS Certified Cloud Practitioner</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Amazon Web Services • Issued 2024</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2563eb', marginTop: '6px' }} />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Meta Front-End Developer Specialization</div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>Coursera • Issued 2023</div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#16a34a" />
              Placement Officer Verification
            </h3>
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={18} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.86rem' }}>Document Records Verified</span>
                <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  All marksheets, identity credentials, and placement documents have been reviewed and approved by the Training & Placement Cell.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
