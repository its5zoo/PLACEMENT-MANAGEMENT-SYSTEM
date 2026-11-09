import React, { useState, useEffect } from 'react';
import { Sliders, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const TnpPolicyView: React.FC = () => {
  const [policy, setPolicy] = useState<any>({
    minCgpaForPlacement: 6.5,
    minAttendanceForPlacement: 75.0,
    maxActiveBacklogsAllowed: 0,
    allowMultipleApplications: true,
    allowMultipleOffers: true,
    allowOfferUpgrade: true,
    placementFreezeOnAcceptance: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPolicy();
  }, []);

  const loadPolicy = async () => {
    try {
      setLoading(true);
      const res = await api.getPolicy();
      if (res.data) {
        setPolicy(res.data);
      }
    } catch (err) {
      console.error('Error loading policy:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updatePolicy(policy);
      alert('Institutional placement policy rules successfully updated and logged!');
    } catch (err: any) {
      alert(err.message || 'Failed to update policy');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#64748b' }}>
        <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Loading institutional policy engine...</span>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={22} color="#2563EB" />
            Institutional Placement Policy Configuration
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
            Configure university rules for eligibility thresholds, offer freeze mechanisms, and dream-company upgrade allowances.
          </p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '24px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                Minimum Institutional CGPA for Placement
              </label>
              <input 
                type="number" step="0.1" min="5" max="10"
                value={policy.minCgpaForPlacement || 6.5}
                onChange={(e) => setPolicy({ ...policy, minCgpaForPlacement: Number(e.target.value) })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Students below this cutoff cannot register for campus drives.</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
                Minimum Attendance Percentage Required (%)
              </label>
              <input 
                type="number" step="1" min="50" max="100"
                value={policy.minAttendanceForPlacement || 75}
                onChange={(e) => setPolicy({ ...policy, minAttendanceForPlacement: Number(e.target.value) })}
                required
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
              />
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>Mandatory academic attendance verified across semesters.</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 700, color: '#111827' }}>Offer Lock & Upgrade Policy</h4>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={Boolean(policy.placementFreezeOnAcceptance)}
                onChange={(e) => setPolicy({ ...policy, placementFreezeOnAcceptance: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                <strong style={{ color: '#111827' }}>Placement Freeze on Acceptance:</strong> Automatically freeze student application permissions once an offer is formally accepted.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={Boolean(policy.allowOfferUpgrade)}
                onChange={(e) => setPolicy({ ...policy, allowOfferUpgrade: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                <strong style={{ color: '#111827' }}>Dream Company Upgrade Allowance:</strong> Allow placed students to apply only for "Tier-1 / Dream" companies with &gt;= 30% higher CTC.
              </span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={Boolean(policy.allowMultipleApplications)}
                onChange={(e) => setPolicy({ ...policy, allowMultipleApplications: e.target.checked })}
                style={{ width: '18px', height: '18px' }}
              />
              <span style={{ fontSize: '0.9rem', color: '#475569' }}>
                <strong style={{ color: '#111827' }}>Parallel Drive Applications:</strong> Permit eligible students to apply to concurrent campus drives before offer release.
              </span>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '10px 24px' }}>
              {saving ? 'Saving Policy...' : 'Save & Enforce Policy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
