import React, { useState, useEffect } from 'react';
import { 
  Mail, Phone, MapPin, Download, Edit3, BookOpen, Code, 
  Loader2, CheckCircle2, Globe, 
  Briefcase, Compass, Plane, Heart, X, Save, Sparkles, ExternalLink
} from 'lucide-react';
import { api } from '../../services/api';

const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const ProfileView: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit state
  const [editForm, setEditForm] = useState({
    phone: '',
    location: '',
    willingToRelocate: true,
    willingToTravel: true,
    preferredWorkMode: 'Flexible (Hybrid / On-site / Remote)',
    careerObjective: '',
    hobbies: '',
    languages: '',
    githubUrl: '',
    linkedinUrl: '',
    portfolioUrl: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getProfile();
      if (res.data) {
        setProfile(res.data);
        const s = res.data.studentDetails || {};
        setEditForm({
          phone: res.data.phone || '+91 98765 43210',
          location: res.data.location || 'Delhi, India',
          willingToRelocate: s.willingToRelocate ?? true,
          willingToTravel: s.willingToTravel ?? true,
          preferredWorkMode: s.preferredWorkMode || 'Flexible (Hybrid / On-site / Remote)',
          careerObjective: s.careerObjective || '',
          hobbies: Array.isArray(s.hobbies) ? s.hobbies.join(', ') : '',
          languages: Array.isArray(s.languages) ? s.languages.join(', ') : '',
          githubUrl: s.githubUrl || 'https://github.com/its5zoo',
          linkedinUrl: s.linkedinUrl || 'https://linkedin.com/in/faizaan-khan',
          portfolioUrl: s.portfolioUrl || 'https://faizaan.dev',
        });
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateProfile({
        phone: editForm.phone,
        location: editForm.location,
        studentDetails: {
          willingToRelocate: editForm.willingToRelocate,
          willingToTravel: editForm.willingToTravel,
          preferredWorkMode: editForm.preferredWorkMode,
          careerObjective: editForm.careerObjective,
          hobbies: editForm.hobbies.split(',').map(h => h.trim()).filter(Boolean),
          languages: editForm.languages.split(',').map(l => l.trim()).filter(Boolean),
          githubUrl: editForm.githubUrl,
          linkedinUrl: editForm.linkedinUrl,
          portfolioUrl: editForm.portfolioUrl,
        }
      });
      await loadProfile();
      setIsEditModalOpen(false);
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePrintResume = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#64748B' }}>
        <Loader2 size={22} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Loading institutional placement profile...</span>
      </div>
    );
  }

  const name = profile?.name || 'Faizaan';
  const email = profile?.email || '231cs001.faizaan@giet.edu';
  const phone = profile?.phone || '+91 98765 43210';
  const location = profile?.location || 'Delhi, India';
  const avatar = profile?.avatar || '/doraemon.png';
  const student = profile?.studentDetails || {};

  const willingToRelocate = student.willingToRelocate ?? true;
  const willingToTravel = student.willingToTravel ?? true;
  const preferredWorkMode = student.preferredWorkMode || 'Flexible (Hybrid / On-site / Remote)';
  
  const hobbiesList = Array.isArray(student.hobbies) && student.hobbies.length > 0
    ? student.hobbies
    : [
        'Traveling & Exploring New Places & Cultures',
        'Open Source Contributing',
        'Competitive Programming & DSA (LeetCode 1850+)',
        'Technical Writing & Engineering Blogs',
        'Photography & City Walks'
      ];

  const languagesList = Array.isArray(student.languages) && student.languages.length > 0
    ? student.languages
    : ['English (Professional Working)', 'Hindi (Native)', 'Odia (Conversational)'];

  const projectsList = Array.isArray(student.projects) && student.projects.length > 0
    ? student.projects
    : [
        {
          title: 'Placement Management System (PMS)',
          description: 'Full-stack enterprise recruitment suite built with MERN stack, automated criteria validation, multi-role ecosystem, and live drive orchestration.',
          techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
          link: 'https://github.com/its5zoo/PLACEMENT-MANAGEMENT-SYSTEM'
        },
        {
          title: 'Distributed Event Streaming Engine',
          description: 'High-throughput fault-tolerant message streaming pipeline handling 50k+ events/sec with concurrent worker pools and telemetry dashboards.',
          techStack: ['Go', 'Docker', 'Redis', 'Kafka'],
          link: 'https://github.com/its5zoo'
        },
        {
          title: 'AI Resume Gap Analyzer',
          description: 'Intelligent skill extraction and alignment engine that cross-checks student credentials against dynamic recruiter requirements.',
          techStack: ['Python', 'FastAPI', 'Scikit-learn'],
          link: 'https://github.com/its5zoo'
        }
      ];

  const experienceList = Array.isArray(student.experience) && student.experience.length > 0
    ? student.experience
    : [
        {
          role: 'Software Engineering Intern',
          company: 'Cognitive Labs',
          duration: 'May 2024 - July 2024 (Summer Internship)',
          description: 'Engineered high-throughput REST APIs, optimized database indexes, and reduced query latency by 32%. Automated continuous deployment pipelines using GitHub Actions & Docker containers.'
        }
      ];

  const objective = student.careerObjective || 
    'Passionate and detail-oriented Computer Science undergraduate with a strong foundation in full-stack web development, distributed systems, and data structures. Eager to contribute to high-impact software engineering teams at leading technology organizations with high adaptability, cultural curiosity, and zeal to learn.';

  return (
    <div className="view-container">
      {/* 1. TOP PROFILE HEADER BANNER */}
      <div className="section-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', gap: '22px', alignItems: 'center', flexWrap: 'wrap' }}>
          <img 
            src={avatar} 
            alt={`${name} Profile`} 
            style={{ 
              width: '88px', 
              height: '88px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '3px solid #2563EB',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
            }}
          />

          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>{name}</h2>
                  <span style={{ 
                    backgroundColor: '#ECFDF5', 
                    color: '#065F46', 
                    fontSize: '0.74rem', 
                    fontWeight: 700, 
                    padding: '3px 10px', 
                    borderRadius: '999px', 
                    border: '1px solid #A7F3D0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle2 size={12} color="#059669" />
                    <span>TNP Verified • Active Candidate</span>
                  </span>
                </div>
                <p style={{ color: '#2563EB', fontWeight: 700, fontSize: '0.92rem', margin: '4px 0 2px 0' }}>
                  {student.program || 'B.Tech'} {student.branch || 'Computer Science & Engineering'}
                </p>
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 500 }}>
                  Roll No: <strong>{student.rollNumber || student.rollNo || '231CS001'}</strong> • Batch: <strong>{student.batch || '2023–2027'}</strong> • GIET University
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button 
                  type="button"
                  className="btn-secondary" 
                  onClick={handlePrintResume}
                  style={{ padding: '8px 16px', fontSize: '0.84rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={15} color="#2563EB" />
                  <span>Download Resume</span>
                </button>
                <button 
                  type="button"
                  className="btn-primary" 
                  onClick={() => setIsEditModalOpen(true)}
                  style={{ 
                    padding: '8px 16px', 
                    fontSize: '0.84rem', 
                    backgroundColor: '#2563EB', 
                    color: '#FFFFFF',
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    boxShadow: '0 3px 10px rgba(37, 99, 235, 0.25)'
                  }}
                >
                  <Edit3 size={15} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* CONTACT & SOCIAL STRIP */}
            <div style={{ 
              display: 'flex', 
              gap: '18px', 
              marginTop: '16px', 
              fontSize: '0.82rem', 
              color: '#475569', 
              flexWrap: 'wrap', 
              borderTop: '1px solid #E2E8F0', 
              paddingTop: '12px' 
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#2563EB" /> {email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} color="#2563EB" /> {phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} color="#2563EB" /> {location}
              </span>
              {student.githubUrl && (
                <a 
                  href={student.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}
                >
                  <GithubIcon size={14} /> GitHub
                </a>
              )}
              {student.linkedinUrl && (
                <a 
                  href={student.linkedinUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#0A66C2', textDecoration: 'none', fontWeight: 600 }}
                >
                  <LinkedinIcon size={14} /> LinkedIn
                </a>
              )}
              {student.portfolioUrl && (
                <a 
                  href={student.portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#059669', textDecoration: 'none', fontWeight: 600 }}
                >
                  <Globe size={14} /> Portfolio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. CAREER OBJECTIVE */}
      <div className="section-card" style={{ marginTop: '16px', padding: '20px 24px' }}>
        <h3 className="card-title" style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={16} color="#2563EB" />
          <span>Professional Career Objective</span>
        </h3>
        <p style={{ margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.65 }}>
          {objective}
        </p>
      </div>

      {/* 3. MOBILITY, TRAVEL & HOBBIES (FEATURED HIGHLIGHT SECTION) */}
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* MOBILITY & RELOCATION CARD */}
        <div className="section-card" style={{ padding: '20px 24px' }}>
          <h3 className="card-title" style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Compass size={17} color="#2563EB" />
            <span>Mobility, Travel & Work Preferences</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plane size={15} color="#2563EB" />
                <span>Willingness to Relocate:</span>
              </span>
              <strong style={{ color: willingToRelocate ? '#047857' : '#DC2626', backgroundColor: willingToRelocate ? '#ECFDF5' : '#FEF2F2', padding: '3px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                {willingToRelocate ? '✓ Yes, Open to Relocate Anywhere' : 'No (Home Region Only)'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={15} color="#2563EB" />
                <span>Willing to Travel for Work / Clients:</span>
              </span>
              <strong style={{ color: willingToTravel ? '#047857' : '#DC2626', backgroundColor: willingToTravel ? '#ECFDF5' : '#FEF2F2', padding: '3px 10px', borderRadius: '6px', fontSize: '0.82rem' }}>
                {willingToTravel ? '✓ Yes, 100% Flexible to Travel' : 'No Corporate Travel'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={15} color="#2563EB" />
                <span>Preferred Work Environment:</span>
              </span>
              <strong style={{ color: '#0F172A' }}>
                {preferredWorkMode}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748B' }}>Joining Timeline:</span>
              <strong style={{ color: '#0F172A' }}>Immediate upon 2027 Graduation</strong>
            </div>
          </div>
        </div>

        {/* HOBBIES & PERSONAL INTERESTS CARD */}
        <div className="section-card" style={{ padding: '20px 24px' }}>
          <h3 className="card-title" style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Heart size={17} color="#2563EB" />
            <span>Interests & Personal Hobbies</span>
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
            {hobbiesList.map((hobby: string, idx: number) => (
              <span 
                key={idx}
                style={{
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  border: '1px solid #CBD5E1',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>✦</span>
                <span>{hobby}</span>
              </span>
            ))}
          </div>

          <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              Languages Known:
            </span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {languagesList.map((lang: string, idx: number) => (
                <span 
                  key={idx}
                  style={{
                    backgroundColor: '#EFF6FF',
                    color: '#1D4ED8',
                    border: '1px solid #BFDBFE',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 600
                  }}
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. WORK EXPERIENCE & INTERNSHIPS */}
      <div className="section-card" style={{ marginTop: '16px', padding: '22px 24px' }}>
        <h3 className="card-title" style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Briefcase size={17} color="#2563EB" />
          <span>Industrial Experience & Internships</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {experienceList.map((exp: any, idx: number) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                    {exp.role}
                  </h4>
                  <div style={{ fontSize: '0.84rem', color: '#2563EB', fontWeight: 700, marginTop: '2px' }}>
                    {exp.company}
                  </div>
                </div>
                <span style={{
                  fontSize: '0.76rem',
                  color: '#64748B',
                  backgroundColor: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  border: '1px solid #E2E8F0',
                  fontWeight: 600
                }}>
                  {exp.duration}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#475569', lineHeight: 1.55 }}>
                {exp.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. KEY TECHNICAL PROJECTS */}
      <div className="section-card" style={{ marginTop: '16px', padding: '22px 24px' }}>
        <h3 className="card-title" style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Code size={17} color="#2563EB" />
          <span>Featured Software Projects</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {projectsList.map((proj: any, idx: number) => (
            <div 
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#0F172A' }}>
                    {proj.title}
                  </h4>
                  {proj.link && (
                    <a 
                      href={proj.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: '#2563EB' }}
                      title="View Project Source / Demo"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
                  {proj.description}
                </p>
              </div>

              {proj.techStack?.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {proj.techStack.map((tech: string, tIdx: number) => (
                    <span 
                      key={tIdx}
                      style={{
                        backgroundColor: '#F1F5F9',
                        color: '#1E293B',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. ACADEMIC & VERIFIED SKILLS GRID */}
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        
        {/* ACADEMIC PERFORMANCE */}
        <div className="section-card" style={{ padding: '20px 24px' }}>
          <h3 className="card-title" style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <BookOpen size={16} color="#2563EB" />
            <span>Academic Performance Record</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748B' }}>Cumulative CGPA (B.Tech)</span>
              <strong style={{ color: '#0F172A', fontWeight: 800 }}>8.85 / 10.0 (Rank: Top 5%)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748B' }}>Class 12th (Senior Secondary)</span>
              <strong style={{ color: '#0F172A' }}>92.4% (CBSE)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748B' }}>Class 10th (Secondary)</span>
              <strong style={{ color: '#0F172A' }}>94.0% (CBSE)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px' }}>
              <span style={{ color: '#64748B' }}>Institutional Attendance</span>
              <strong style={{ color: '#059669' }}>88.0% Verified</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748B' }}>Active Academic Backlogs</span>
              <strong style={{ color: '#059669' }}>0 Backlogs (Clean Record)</strong>
            </div>
          </div>
        </div>

        {/* TECHNICAL SKILLS MATRIX */}
        <div className="section-card" style={{ padding: '20px 24px' }}>
          <h3 className="card-title" style={{ fontSize: '0.94rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Code size={16} color="#2563EB" />
            <span>Verified Technical Skills Matrix</span>
          </h3>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              'React.js', 'Node.js', 'TypeScript', 'JavaScript (ES6+)', 
              'C++', 'Python', 'Go', 'SQL & PostgreSQL', 'MongoDB', 
              'Data Structures & Algorithms', 'Docker', 'Git & GitHub', 
              'Tailwind CSS', 'REST APIs', 'Microservices'
            ].map(skill => (
              <span key={skill} style={{
                backgroundColor: '#F8FAFC',
                color: '#0F172A',
                border: '1px solid #CBD5E1',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {skill}
              </span>
            ))}
          </div>

          <div style={{ marginTop: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
              Certifications:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '0.82rem', color: '#0F172A' }}>
                <strong>• AWS Certified Cloud Practitioner</strong> (Amazon Web Services • 2024)
              </div>
              <div style={{ fontSize: '0.82rem', color: '#0F172A' }}>
                <strong>• Meta Front-End Developer Specialization</strong> (Coursera • 2023)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. INSTITUTIONAL PLACEMENT VERIFICATION */}
      <div className="section-card" style={{ marginTop: '16px', padding: '18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            backgroundColor: '#059669',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0F172A' }}>
              GIET University Training & Placement Cell Endorsement
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>
              Student record, academic credentials, marksheets, and code portfolio have been authenticated by the TNP Verification Officer for the 2026–2027 placement cycle.
            </div>
          </div>
        </div>
      </div>

      {/* 8. EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div 
          className="modal-backdrop" 
          onClick={() => setIsEditModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(15, 27, 51, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div 
            className="modal-content drive-modal-responsive"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '620px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #E2E8F0',
              overflow: 'hidden'
            }}
          >
            {/* MODAL HEADER */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                Edit Student Profile & Preferences
              </h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM BODY */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
              <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Contact & Location */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Phone Number
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      Current City / Location
                    </label>
                    <input 
                      type="text"
                      className="form-input"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* MOBILITY & TRAVEL PREFERENCES */}
                <div style={{ backgroundColor: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0F172A', display: 'block', marginBottom: '10px' }}>
                    ✈️ Mobility & Travel Preferences
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={editForm.willingToRelocate}
                        onChange={(e) => setEditForm({ ...editForm, willingToRelocate: e.target.checked })}
                      />
                      <span><strong>Willing to relocate anywhere</strong> (Pan-India & International Opportunities)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox"
                        checked={editForm.willingToTravel}
                        onChange={(e) => setEditForm({ ...editForm, willingToTravel: e.target.checked })}
                      />
                      <span><strong>Willing to travel for work / client engagements</strong> (100% Flexible)</span>
                    </label>

                    <div style={{ marginTop: '4px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                        Preferred Work Mode:
                      </label>
                      <select 
                        value={editForm.preferredWorkMode}
                        onChange={(e) => setEditForm({ ...editForm, preferredWorkMode: e.target.value })}
                        style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                      >
                        <option value="Flexible (Hybrid / On-site / Remote)">Flexible (Hybrid / On-site / Remote)</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Career Objective */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Career Objective
                  </label>
                  <textarea 
                    rows={3}
                    className="form-input"
                    value={editForm.careerObjective}
                    onChange={(e) => setEditForm({ ...editForm, careerObjective: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Hobbies */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Personal Hobbies & Interests (Comma separated)
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editForm.hobbies}
                    onChange={(e) => setEditForm({ ...editForm, hobbies: e.target.value })}
                    placeholder="Traveling, Open source, Tech blogging, Photography"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Languages */}
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Languages Known (Comma separated)
                  </label>
                  <input 
                    type="text"
                    className="form-input"
                    value={editForm.languages}
                    onChange={(e) => setEditForm({ ...editForm, languages: e.target.value })}
                    placeholder="English, Hindi, Odia"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Profile Links */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      GitHub URL
                    </label>
                    <input 
                      type="url"
                      value={editForm.githubUrl}
                      onChange={(e) => setEditForm({ ...editForm, githubUrl: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                      LinkedIn URL
                    </label>
                    <input 
                      type="url"
                      value={editForm.linkedinUrl}
                      onChange={(e) => setEditForm({ ...editForm, linkedinUrl: e.target.value })}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div style={{
                padding: '16px 24px',
                backgroundColor: '#F8FAFC',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                >
                  Cancel
                </button>

                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={saving}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {saving ? (
                    <>
                      <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={15} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
