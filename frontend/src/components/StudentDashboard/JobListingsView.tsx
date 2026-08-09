import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Calendar, Filter, CheckCircle } from 'lucide-react';
import type { JobListing } from '../../types';

export const JobListingsView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>(['job-1']);

  const jobs: JobListing[] = [
    {
      id: 'job-1',
      company: 'Google',
      role: 'Software Engineer - Campus 2025',
      location: 'Bangalore, India',
      ctc: 'Rs. 24 - 28 LPA',
      deadline: '25 May 2024',
      logoBg: '#eff6ff',
      logoText: 'G',
      tags: ['C++', 'Python', 'Data Structures', 'Full Time']
    },
    {
      id: 'job-2',
      company: 'Microsoft',
      role: 'Frontend Software Engineer',
      location: 'Hyderabad, India',
      ctc: 'Rs. 22 - 25 LPA',
      deadline: '28 May 2024',
      logoBg: '#fffbeb',
      logoText: 'MS',
      tags: ['React', 'TypeScript', 'System Design']
    },
    {
      id: 'job-3',
      company: 'Amazon',
      role: 'SDE-1 (Graduate Engineer)',
      location: 'Gurgaon, India',
      ctc: 'Rs. 26 - 30 LPA',
      deadline: '02 June 2024',
      logoBg: '#f0fdf4',
      logoText: 'AMZ',
      tags: ['Java', 'AWS', 'Distributed Systems']
    },
    {
      id: 'job-4',
      company: 'Goldman Sachs',
      role: 'Analyst - Engineering',
      location: 'Bangalore, India',
      ctc: 'Rs. 20 - 24 LPA',
      deadline: '05 June 2024',
      logoBg: '#fef2f2',
      logoText: 'GS',
      tags: ['Finance Tech', 'Java', 'Algorithms']
    },
    {
      id: 'job-5',
      company: 'Adobe',
      role: 'Product Development Engineer',
      location: 'Noida, India',
      ctc: 'Rs. 21 - 23 LPA',
      deadline: '10 June 2024',
      logoBg: '#faf5ff',
      logoText: 'ADB',
      tags: ['C++', 'Graphics', 'UI/UX']
    }
  ];

  const filteredJobs = jobs.filter(j => 
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApply = (id: string) => {
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
      alert('Application submitted successfully!');
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
        <button className="btn-primary" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
          <Filter size={16} />
          <span>Filters</span>
        </button>
      </div>

      {/* Jobs Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredJobs.map((job) => {
          const isApplied = appliedJobs.includes(job.id);
          return (
            <div key={job.id} className="section-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#2563eb'
                  }}>
                    {job.logoText}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{job.role}</h3>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>{job.company}</div>
                  </div>
                </div>

                <button 
                  className="btn-primary"
                  onClick={() => handleApply(job.id)}
                  style={{
                    backgroundColor: isApplied ? '#dcfce7' : '#2563eb',
                    color: isApplied ? '#16a34a' : '#ffffff',
                    cursor: isApplied ? 'default' : 'pointer'
                  }}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle size={16} />
                      <span>Applied</span>
                    </>
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
        })}
      </div>
    </div>
  );
};
