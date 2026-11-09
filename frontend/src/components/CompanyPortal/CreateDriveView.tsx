import React, { useState } from 'react';
import { PlusCircle, Send } from 'lucide-react';
import { api } from '../../services/api';
import type { ActiveTab } from '../../types';

interface CreateDriveProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const CreateDriveView: React.FC<CreateDriveProps> = ({ setActiveTab }) => {
  const [role, setRole] = useState('Software Engineer - Cloud');
  const [ctc, setCtc] = useState('Rs. 18 - 22 LPA');
  const [baseSalary, setBaseSalary] = useState('Rs. 16 LPA');
  const [location, setLocation] = useState('Bengaluru, India');
  const [workMode, setWorkMode] = useState('Hybrid');
  const [minCgpa, setMinCgpa] = useState('7.0');
  const [maxBacklogs, setMaxBacklogs] = useState('0');
  const [minAttendance, setMinAttendance] = useState('75');
  const [branches, setBranches] = useState('CSE, IT, ECE');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (submitNow: boolean) => {
    try {
      setSubmitting(true);
      await api.createCompanyDrive({
        role,
        ctc,
        baseSalary,
        location,
        workMode,
        eligibility: {
          minCgpa: Number(minCgpa),
          maxActiveBacklogs: Number(maxBacklogs),
          minAttendance: Number(minAttendance),
          allowedBranches: branches.split(',').map((b) => b.trim()),
        },
        rounds: [
          { roundIndex: 1, name: 'Online Assessment Challenge', type: 'Coding Test' },
          { roundIndex: 2, name: 'Technical Round 1', type: 'Technical Interview' },
          { roundIndex: 3, name: 'HR & Culture Fit', type: 'HR Interview' },
        ],
        submitNow,
      });

      alert(submitNow ? '🎉 Campus drive submitted to TNP Cell for approval!' : 'Drive saved as draft.');
      setActiveTab('company-dashboard');
    } catch (err: any) {
      alert(err.message || 'Failed to create drive');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="view-container">
      <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={22} color="#2563EB" />
            Create Campus Placement Drive
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
            Define hiring requirements, academic eligibility thresholds, and multi-stage selection rounds for university review.
          </p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '24px' }}>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Basic Info */}
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>1. Role & Compensation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Job Role / Title</label>
                <input 
                  type="text" value={role} onChange={(e) => setRole(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Package (Total CTC)</label>
                <input 
                  type="text" value={ctc} onChange={(e) => setCtc(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Base Salary</label>
                <input 
                  type="text" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Work Location</label>
                <input 
                  type="text" value={location} onChange={(e) => setLocation(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Work Mode</label>
                <select 
                  value={workMode} onChange={(e) => setWorkMode(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#111827' }}
                >
                  <option value="Hybrid">Hybrid</option>
                  <option value="On-site">On-site</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '14px' }}>2. Deterministic Eligibility Thresholds</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Minimum Cutoff CGPA</label>
                <input 
                  type="number" step="0.1" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Max Active Backlogs Allowed</label>
                <input 
                  type="number" value={maxBacklogs} onChange={(e) => setMaxBacklogs(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Minimum Attendance Required (%)</label>
                <input 
                  type="number" value={minAttendance} onChange={(e) => setMinAttendance(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>Eligible Branches (comma separated)</label>
                <input 
                  type="text" value={branches} onChange={(e) => setBranches(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button 
              type="button" 
              onClick={() => handleSubmit(false)} 
              disabled={submitting} 
              className="btn-primary" 
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569' }}
            >
              Save as Draft
            </button>
            <button 
              type="submit" 
              disabled={submitting} 
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={16} />
              <span>{submitting ? 'Submitting...' : 'Submit to TNP for Approval'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
