import React, { useState } from 'react';
import type { ApplicationItem } from '../../types';
import { Search } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

export const MyApplicationsView: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const applications: ApplicationItem[] = [
    {
      id: 'app-1',
      company: 'Google',
      role: 'Software Engineer',
      status: 'Applied',
      date: '20 May 2024',
      logo: 'G',
      logoBg: '#ffffff',
      location: 'Bangalore, India',
      ctc: 'Rs. 24 LPA'
    },
    {
      id: 'app-2',
      company: 'Microsoft',
      role: 'Frontend Developer',
      status: 'In-Progress',
      date: '18 May 2024',
      logo: 'MS',
      logoBg: '#ffffff',
      location: 'Hyderabad, India',
      ctc: 'Rs. 22 LPA'
    },
    {
      id: 'app-3',
      company: 'Infosys',
      role: 'System Engineer',
      status: 'Selected',
      date: '15 May 2024',
      logo: 'INF',
      logoBg: '#ffffff',
      location: 'Pune, India',
      ctc: 'Rs. 9.5 LPA'
    },
    {
      id: 'app-4',
      company: 'Goldman Sachs',
      role: 'Engineering Analyst',
      status: 'In-Progress',
      date: '12 May 2024',
      logo: 'GS',
      logoBg: '#ffffff',
      location: 'Bangalore, India',
      ctc: 'Rs. 20 LPA'
    },
    {
      id: 'app-5',
      company: 'Amazon',
      role: 'SDE-1',
      status: 'Rejected',
      date: '02 May 2024',
      logo: 'AMZ',
      logoBg: '#ffffff',
      location: 'Gurgaon, India',
      ctc: 'Rs. 26 LPA'
    }
  ];

  const filtered = applications.filter(app => {
    const matchesStatus = filterStatus === 'All' || app.status === filterStatus || (filterStatus === 'In Progress' && app.status === 'In-Progress');
    const matchesSearch = app.company.toLowerCase().includes(search.toLowerCase()) || app.role.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="view-container">
      {/* Top Filter Tabs */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['All', 'Applied', 'In Progress', 'Selected', 'Rejected'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filterStatus === status ? '#2563eb' : '#f1f5f9',
                color: filterStatus === status ? '#ffffff' : '#475569',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="search-box" style={{ maxWidth: '280px' }}>
          <Search size={16} color="#64748b" />
          <input 
            type="text" 
            placeholder="Search company..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="section-card">
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <th style={{ padding: '12px 16px' }}>Company & Role</th>
                <th style={{ padding: '12px 16px' }}>Location</th>
                <th style={{ padding: '12px 16px' }}>Package (CTC)</th>
                <th style={{ padding: '12px 16px' }}>Applied Date</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        color: '#2563eb'
                      }}>
                        {app.logo}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{app.company}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{app.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: '#475569' }}>{app.location}</td>
                  <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>{app.ctc}</td>
                  <td style={{ padding: '16px', color: '#64748b' }}>{app.date}</td>
                  <td style={{ padding: '16px' }}>
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
