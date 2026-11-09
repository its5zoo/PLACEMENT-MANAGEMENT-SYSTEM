import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Calendar, Filter, CheckCircle, Loader2, Eye, X, ShieldCheck, GraduationCap } from 'lucide-react';
import type { JobListing, PortalMode } from '../../types';
import { api } from '../../services/api';

interface JobListingsViewProps {
  portalMode?: PortalMode;
}

export const JobListingsView: React.FC<JobListingsViewProps> = ({ portalMode = 'STUDENT' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  const isTnp = portalMode === 'TNP';
  const isCompany = portalMode === 'COMPANY';

  useEffect(() => {
    loadJobsAndApplications();
  }, [portalMode]);

  const loadJobsAndApplications = async () => {
    try {
      setLoading(true);
      const jobsRes = await api.getJobs();

      if (jobsRes.data) {
        const mappedJobs: JobListing[] = jobsRes.data.map((j: any) => ({
          id: j._id,
          company: j.company,
          role: j.role,
          location: j.location,
          ctc: j.ctc,
          deadline: j.deadline,
          logoBg: j.logoBg || '#F1F5F9',
          logoText: j.logoText || j.company.slice(0, 2).toUpperCase(),
          tags: j.tags || [],
          eligibility: j.eligibility,
          description: j.description,
        }));
        setJobs(mappedJobs);
      }

      // Only fetch student's applied applications if in STUDENT mode
      if (portalMode === 'STUDENT') {
        const myAppsRes = await api.getMyApplications();
        if (myAppsRes.data && jobsRes.data) {
          const applied = myAppsRes.data.map((app: any) => app.job?._id || app.job || app._id);
          const appliedCompanyRoles = myAppsRes.data.map((app: any) => `${app.company}-${app.role}`);
          
          const appliedIds = jobsRes.data
            .filter((j: any) => applied.includes(j._id) || appliedCompanyRoles.includes(`${j.company}-${j.role}`))
            .map((j: any) => j._id);
          setAppliedJobIds(appliedIds);
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApply = async (id: string) => {
    if (appliedJobIds.includes(id)) return;
    try {
      setApplyingId(id);
      await api.applyJob(id);
      setAppliedJobIds(prev => [...prev, id]);
      alert('Application submitted successfully to database!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="view-container">
      {/* Notice Banner for TNP Admin */}
      {isTnp && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '10px',
          padding: '12px 18px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#111827',
          fontSize: '0.88rem'
        }}>
          <ShieldCheck size={20} color="#0F1B33" style={{ flexShrink: 0 }} />
          <div>
            <strong>TNP Cell Campus Drive Monitor:</strong> Showing all active placement drives currently published on campus. As TNP Admin, you oversee eligibility criteria, branch permissions, and student registrations.
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} color="#64748B" />
          <input 
            type="text" 
            placeholder="Search by company, role, or skill tag..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-secondary">
          <Filter size={15} />
          <span>Filters</span>
        </button>
      </div>

      {/* Jobs / Drives List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
            <Loader2 size={22} className="spin" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Loading drives from server...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="section-card" style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            No campus drives found matching your criteria.
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isApplied = appliedJobIds.includes(job.id);
            const isSubmitting = applyingId === job.id;
            return (
              <div key={job.id} className="section-card" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#111827'
                    }}>
                      {job.logoText}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{job.role}</h3>
                      <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600 }}>{job.company}</div>
                    </div>
                  </div>

                  {/* ACTION SECTION BASED ON ROLE */}
                  {isTnp || isCompany ? (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: '#F8FAFC',
                        color: '#15803D',
                        border: '1px solid #E2E8F0',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        <CheckCircle size={14} /> Active Drive
                      </span>
                      <button 
                        className="btn-secondary"
                        onClick={() => setSelectedJob(job)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.82rem',
                          padding: '6px 12px',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={14} /> View Criteria
                      </button>
                    </div>
                  ) : (
                    /* STUDENT ACTION BUTTONS */
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => setSelectedJob(job)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '0.82rem',
                          padding: '7px 12px',
                          cursor: 'pointer'
                        }}
                      >
                        <Eye size={14} /> View Criteria
                      </button>
                      <button 
                        className={isApplied ? "btn-secondary" : "btn-primary"}
                        disabled={isApplied || isSubmitting}
                        onClick={() => handleApply(job.id)}
                        style={{
                          backgroundColor: isApplied ? '#F8FAFC' : '#2563EB',
                          color: isApplied ? '#15803D' : '#FFFFFF',
                          borderColor: isApplied ? '#E2E8F0' : '#2563EB',
                          cursor: isApplied ? 'default' : 'pointer',
                          opacity: isSubmitting ? 0.7 : 1,
                          fontSize: '0.82rem',
                          padding: '7px 14px'
                        }}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle size={15} />
                            <span>Applied</span>
                          </>
                        ) : isSubmitting ? (
                          <span>Submitting...</span>
                        ) : (
                          <span>Apply Now</span>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '20px', margin: '16px 0 12px 0', fontSize: '0.85rem', color: '#64748B', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} /> {job.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DollarSign size={15} /> {job.ctc}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} /> Deadline: {job.deadline}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {job.tags.map((tag, idx) => (
                    <span key={idx} style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '3px 10px',
                      borderRadius: '6px'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CRITERIA & DRIVE DETAILS MODAL FOR TNP / ADMIN */}
      {selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 27, 51, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            width: '100%',
            maxWidth: '560px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#111827' }}>
                  {selectedJob.role}
                </h3>
                <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                  {selectedJob.company} • Campus Placement Drive
                </div>
              </div>
              <button 
                onClick={() => setSelectedJob(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                backgroundColor: '#F1F5F9',
                padding: '14px',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                fontSize: '0.85rem'
              }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.78rem' }}>Package / CTC</span>
                  <strong style={{ color: '#111827' }}>{selectedJob.ctc}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.78rem' }}>Location</span>
                  <strong style={{ color: '#111827' }}>{selectedJob.location}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.78rem' }}>Application Deadline</span>
                  <strong style={{ color: '#111827' }}>{selectedJob.deadline}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.78rem' }}>Status</span>
                  <span style={{ color: '#15803D', fontWeight: 700 }}>Active Campus Drive</span>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <GraduationCap size={16} color="#2563EB" /> Institutional Eligibility Rules
                </h4>
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '0.84rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Minimum CGPA Cutoff:</span>
                    <strong>{selectedJob.eligibility?.minCgpa ?? '7.0'} / 10.0</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Allowed Active Backlogs:</span>
                    <strong>{selectedJob.eligibility?.backlogsAllowed ?? 0} max</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Eligible Branches:</span>
                    <strong>{selectedJob.eligibility?.allowedBranches?.join(', ') || 'CSE, IT, ECE'}</strong>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                  Targeted Skills & Tags
                </h4>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedJob.tags.map((t, idx) => (
                    <span key={idx} style={{
                      backgroundColor: '#F1F5F9',
                      color: '#2563EB',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0'
                    }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {selectedJob.description && (
                <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5 }}>
                  <span style={{ fontWeight: 600, color: '#111827' }}>Job Overview: </span>
                  {selectedJob.description}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 24px',
              backgroundColor: '#F8FAFC',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px'
            }}>
              <button 
                className="btn-secondary"
                onClick={() => setSelectedJob(null)}
                style={{ padding: '7px 16px', fontSize: '0.85rem' }}
              >
                Close
              </button>
              {!isTnp && !isCompany && !appliedJobIds.includes(selectedJob.id) && (
                <button 
                  className="btn-primary"
                  onClick={() => {
                    const id = selectedJob.id;
                    setSelectedJob(null);
                    handleApply(id);
                  }}
                  style={{ padding: '7px 16px', fontSize: '0.85rem' }}
                >
                  Apply to this Drive
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
