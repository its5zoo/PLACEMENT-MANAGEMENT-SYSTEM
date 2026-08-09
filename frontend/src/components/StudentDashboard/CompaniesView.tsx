import React, { useState } from 'react';
import type { Company } from '../../types';
import { Search, ExternalLink } from 'lucide-react';

export const CompaniesView: React.FC = () => {
  const [search, setSearch] = useState('');

  const companies: Company[] = [
    { id: '1', name: 'Google India', industry: 'Technology & Cloud', activeDrives: 2, avgPackage: 'Rs. 24.5 LPA', logoBg: '#eff6ff', logoText: 'G' },
    { id: '2', name: 'Microsoft Corporation', industry: 'Software & Cloud Solutions', activeDrives: 1, avgPackage: 'Rs. 22.0 LPA', logoBg: '#fffbeb', logoText: 'MS' },
    { id: '3', name: 'Infosys Limited', industry: 'IT Services & Consulting', activeDrives: 3, avgPackage: 'Rs. 9.5 LPA', logoBg: '#f0fdf4', logoText: 'INF' },
    { id: '4', name: 'Amazon Web Services', industry: 'E-commerce & Cloud Computing', activeDrives: 1, avgPackage: 'Rs. 28.0 LPA', logoBg: '#fef2f2', logoText: 'AMZ' },
    { id: '5', name: 'Goldman Sachs', industry: 'Investment Banking & Fintech', activeDrives: 2, avgPackage: 'Rs. 22.5 LPA', logoBg: '#faf5ff', logoText: 'GS' },
    { id: '6', name: 'Adobe Inc.', industry: 'Digital Media & Software', activeDrives: 1, avgPackage: 'Rs. 21.0 LPA', logoBg: '#eff6ff', logoText: 'ADB' },
  ];

  const filtered = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="view-container">
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} color="#64748b" />
          <input 
            type="text" 
            placeholder="Search participating companies..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map(c => (
          <div key={c.id} className="section-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
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
                fontSize: '1rem',
                color: '#2563eb'
              }}>
                {c.logoText}
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.industry}</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Active Drives</span>
                <strong style={{ color: '#2563eb' }}>{c.activeDrives} Drives</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.75rem' }}>Avg Package</span>
                <strong style={{ color: '#16a34a' }}>{c.avgPackage}</strong>
              </div>
            </div>

            <button className="link-btn" style={{ justifyContent: 'center', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
              <span>View Company Profile</span>
              <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
