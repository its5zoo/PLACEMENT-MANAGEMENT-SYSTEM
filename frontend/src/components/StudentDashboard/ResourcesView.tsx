import React from 'react';
import { FileText, Download } from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const resources = [
    { title: 'Top 50 Data Structures & Algorithms Questions', type: 'PDF Guide', category: 'Coding', size: '2.4 MB' },
    { title: 'System Design Interview Handbook 2024', type: 'PDF Guide', category: 'Architecture', size: '4.1 MB' },
    { title: 'HR & Behavioral Interview Sample Answers', type: 'Document', category: 'HR Round', size: '1.2 MB' },
    { title: 'Mock Interview Practice Portal Link', type: 'External Tool', category: 'Practice', size: 'Web Link' },
  ];

  return (
    <div className="view-container">
      <div className="section-card">
        <h3 className="card-title" style={{ marginBottom: '16px' }}>Placement Preparation Material</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
          {resources.map((r, i) => (
            <div key={i} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', color: '#2563EB', padding: '10px', borderRadius: '8px' }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#111827' }}>{r.title}</h4>
                  <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{r.category} • {r.size}</span>
                </div>
              </div>
              <button className="link-btn" style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #E2E8F0', color: '#2563EB' }}>
                <Download size={14} />
                <span>Download File</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
