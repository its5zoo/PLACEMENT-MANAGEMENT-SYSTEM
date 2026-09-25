import React, { useState, useEffect } from 'react';
import type { Company } from '../../types';
import { Search, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const CompaniesView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.getCompanies();
      if (res.data) {
        const mapped = res.data.map((c: any) => ({
          id: c._id,
          name: c.name,
          industry: c.industry,
          activeDrives: c.activeDrives || 1,
          avgPackage: c.avgPackage,
          logoBg: c.logoBg || '#eff6ff',
          logoText: c.logoText || c.name.slice(0, 2).toUpperCase(),
        }));
        setCompanies(mapped);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

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

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
          <Loader2 size={24} className="spin" style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
          <span>Loading companies from database...</span>
        </div>
      ) : (
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
      )}
    </div>
  );
};
