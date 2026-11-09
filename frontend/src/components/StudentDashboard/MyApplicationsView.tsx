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
      if (res && res.data) {
        const isHexId = (val: any) => typeof val === 'string' && /^[0-9a-fA-F]{24}$/.test(val);
        const mapped = res.data.map((app: any) => {
          let compName = 'Campus Recruiter';
          if (app.companyName && !isHexId(app.companyName)) {
            compName = app.companyName;
          } else if (app.company?.name && !isHexId(app.company.name)) {
            compName = app.company.name;
          } else if (typeof app.company === 'string' && !isHexId(app.company)) {
            compName = app.company;
          } else if (app.drive?.companyName && !isHexId(app.drive.companyName)) {
            compName = app.drive.companyName;
          } else if (app.logo === 'MS') {
            compName = 'Microsoft Corporation';
          } else if (app.logo === 'G') {
            compName = 'Google India';
          } else if (app.logo === 'AMZ') {
            compName = 'Amazon Web Services';
          }

          let logo = app.logo;
          if (!logo || (typeof logo === 'string' && /^[0-9a-fA-F]{2}$/.test(logo))) {
            logo = compName.slice(0, 2).toUpperCase();
          }

          return {
            id: app._id,
            company: compName,
            role: app.role,
            status: app.status,
            date: app.appliedDate || new Date(app.createdAt).toLocaleDateString('en-GB'),
            logo: logo,
            logoBg: app.logoBg || '#ffffff',
            location: app.location || 'India',
            ctc: app.ctc || 'Competitive',
          };
        });
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
                border: `1px solid ${filterStatus === status ? '#0F1B33' : '#E2E8F0'}`,
                backgroundColor: filterStatus === status ? '#0F1B33' : '#FFFFFF',
                color: filterStatus === status ? '#FFFFFF' : '#475569',
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
          <Search size={16} color="#64748B" />
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
              <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
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
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Loader2 size={18} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Fetching applications from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: '#64748B' }}>
                    No applications found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map(app => (
                  <tr key={app.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          backgroundColor: '#F1F5F9',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          color: '#2563EB'
                        }}>
                          {app.logo}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#111827' }}>{app.company}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{app.role}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', color: '#475569' }}>{app.location}</td>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#111827' }}>{app.ctc}</td>
                    <td style={{ padding: '16px', color: '#64748B' }}>{app.date}</td>
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
