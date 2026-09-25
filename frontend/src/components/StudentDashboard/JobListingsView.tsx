import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Calendar, Filter, CheckCircle, Loader2 } from 'lucide-react';
import type { JobListing } from '../../types';
import { api } from '../../services/api';

export const JobListingsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    loadJobsAndApplications();
  }, []);

  const loadJobsAndApplications = async () => {
    try {
      setLoading(true);
      const [jobsRes, myAppsRes] = await Promise.all([
        api.getJobs(),
        api.getMyApplications()
      ]);

      if (jobsRes.data) {
        const mappedJobs: JobListing[] = jobsRes.data.map((j: any) => ({
          id: j._id,
          company: j.company,
          role: j.role,
          location: j.location,
          ctc: j.ctc,
          deadline: j.deadline,
          logoBg: j.logoBg || '#eff6ff',
          logoText: j.logoText || j.company.slice(0, 2).toUpperCase(),
          tags: j.tags || [],
        }));
        setJobs(mappedJobs);
      }

      if (myAppsRes.data) {
        // Collect applied job IDs or company/role pairs
        const applied = myAppsRes.data.map((app: any) => app.job?._id || app.job || app._id);
        const appliedCompanyRoles = myAppsRes.data.map((app: any) => `${app.company}-${app.role}`);
        
        // Also match jobs with same company & role
        const appliedIds = jobsRes.data
          ? jobsRes.data
              .filter((j: any) => applied.includes(j._id) || appliedCompanyRoles.includes(`${j.company}-${j.role}`))
              .map((j: any) => j._id)
          : [];
        setAppliedJobIds(appliedIds);
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
      {/* Search & Filter */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} color="#64748b" />
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

      {/* Jobs Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={22} className="spin" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Loading jobs from server...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="section-card" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No jobs found matching your criteria.
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
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1rem',
                      color: '#0f172a'
                    }}>
                      {job.logoText}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{job.role}</h3>
                      <div style={{ fontSize: '0.84rem', color: '#64748b', fontWeight: 600 }}>{job.company}</div>
                    </div>
                  </div>

                  <button 
                    className={isApplied ? "btn-secondary" : "btn-primary"}
                    disabled={isApplied || isSubmitting}
                    onClick={() => handleApply(job.id)}
                    style={{
                      backgroundColor: isApplied ? '#ecfdf5' : '#2563eb',
                      color: isApplied ? '#15803d' : '#ffffff',
                      borderColor: isApplied ? '#bbf7d0' : 'transparent',
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

              <div style={{ display: 'flex', gap: '20px', margin: '16px 0 12px 0', fontSize: '0.85rem', color: '#64748b', flexWrap: 'wrap' }}>
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
                    backgroundColor: '#f1f5f9',
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
    </div>
  );
};
