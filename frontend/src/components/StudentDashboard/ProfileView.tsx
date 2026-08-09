import React from 'react';
import { Mail, Phone, MapPin, Download, Edit3, Award, BookOpen, Code, FileText } from 'lucide-react';

export const ProfileView: React.FC = () => {
  return (
    <div className="view-container">
      {/* Top Banner Card */}
      <div className="section-card" style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <img 
          src="/doraemon.png" 
          alt="Doraemon Profile" 
          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #eff6ff' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Faizaan</h2>
              <p style={{ color: '#2563eb', fontWeight: 600, fontSize: '0.95rem' }}>B.Tech Computer Science & Engineering</p>
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Roll No: 21CSE1042 | Batch 2021-2025</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-primary" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                <Download size={16} />
                <span>Download Resume</span>
              </button>
              <button className="btn-primary">
                <Edit3 size={16} />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '16px', fontSize: '0.85rem', color: '#475569', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={15} /> faizaan@university.edu</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={15} /> +91 98765 43210</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={15} /> Delhi, India</span>
          </div>
        </div>
      </div>

      {/* Grid details */}
      <div className="dashboard-grid">
        {/* Left Column: Academic & Skills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} color="#2563eb" />
              Academic Performance
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Current CGPA</span>
                <strong style={{ color: '#16a34a', fontWeight: 800 }}>8.85 / 10.0</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <span style={{ color: '#64748b' }}>Class 12th (Senior Sec)</span>
                <strong style={{ color: '#0f172a' }}>92.4%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Class 10th (Secondary)</span>
                <strong style={{ color: '#0f172a' }}>94.0%</strong>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Code size={18} color="#9333ea" />
              Technical Skills
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['React.js', 'Node.js', 'TypeScript', 'C++', 'Python', 'SQL', 'Git', 'Data Structures', 'Tailwind CSS'].map(skill => (
                <span key={skill} style={{
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certifications & Resume Score */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#ea580c" />
              Certifications & Badges
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2563eb' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>AWS Certified Cloud Practitioner</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Issued by Amazon Web Services • 2024</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Meta Front-End Developer Specialization</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>Issued by Coursera • 2023</div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <h3 className="card-title" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} color="#16a34a" />
              Resume Verification Status
            </h3>
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '10px' }}>
              <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.9rem' }}>✓ Verified by T&P Cell</span>
              <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '4px' }}>
                Your updated resume has been reviewed and approved by Training & Placement Officer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
