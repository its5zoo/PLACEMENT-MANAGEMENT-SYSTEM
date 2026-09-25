import React, { useState, useEffect } from 'react';
import type { ApplicationItem } from '../../types';
import { Search, Loader2 } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { api } from '../../services/api';

export const MyApplicationsView: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadApplications();
  }, [filterStatus, search]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await api.getMyApplications(filterStatus, search);
      if (res.data) {
        const mapped = res.data.map((app: any) => ({
          id: app._id,
          company: app.company,
          role: app.role,
          status: app.status,
          date: app.appliedDate || new Date(app.createdAt).toLocaleDateString('en-GB'),
          logo: app.logo || app.company.slice(0, 2).toUpperCase(),
          logoBg: app.logoBg || '#ffffff',
          location: app.location || 'India',
          ctc: app.ctc || 'Competitive',
        }));
        setApplications(mapped);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = applications;

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
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Fetching applications from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    No applications found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map(app => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
