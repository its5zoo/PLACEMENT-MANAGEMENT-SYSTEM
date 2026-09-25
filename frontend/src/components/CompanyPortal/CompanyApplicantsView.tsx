import React, { useState, useEffect } from 'react';
import { Gift, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const CompanyApplicantsView: React.FC = () => {
  const [drives, setDrives] = useState<any[]>([]);
  const [selectedDriveId, setSelectedDriveId] = useState<string>('');
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);

  // Release offer modal state
  const [offerModalCandidate, setOfferModalCandidate] = useState<any | null>(null);
  const [offerCtc, setOfferCtc] = useState('Rs. 24 LPA');
  const [offerBase, setOfferBase] = useState('Rs. 20 LPA');
  const [releasing, setReleasing] = useState(false);

  useEffect(() => {
    loadDrives();
  }, []);

  const loadDrives = async () => {
    try {
      setLoading(true);
      const res = await api.getCompanyDashboard();
      if (res.data && res.data.drives && res.data.drives.length > 0) {
        setDrives(res.data.drives);
        const firstId = res.data.drives[0]._id;
        setSelectedDriveId(firstId);
        await loadApplicants(firstId);
      }
    } catch (err) {
      console.error('Error loading drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (driveId: string) => {
    try {
      const res = await api.getDriveApplicants(driveId);
      if (res.data) {
        setApplicants(res.data);
      }
    } catch (err) {
      console.error('Error loading applicants:', err);
    }
  };

  const handleDriveChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const driveId = e.target.value;
    setSelectedDriveId(driveId);
    await loadApplicants(driveId);
  };

  const handleShortlist = async (appId: string) => {
    try {
      setShortlistingId(appId);
      await api.shortlistApplicant(appId);
      alert('Candidate shortlisted for Round 1 assessment!');
      await loadApplicants(selectedDriveId);
    } catch (err: any) {
      alert(err.message || 'Failed to shortlist');
    } finally {
      setShortlistingId(null);
    }
  };

  const handleReleaseOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setReleasing(true);
      await api.releaseOffer({
        studentId: offerModalCandidate.student?._id || offerModalCandidate.student,
        driveId: selectedDriveId,
        ctc: offerCtc,
        baseSalary: offerBase,
        role: offerModalCandidate.role,
      });
      alert('🎉 Official placement offer released to candidate!');
      setOfferModalCandidate(null);
      await loadApplicants(selectedDriveId);
    } catch (err: any) {
      alert(err.message || 'Failed to release offer');
    } finally {
      setReleasing(false);
    }
  };

  return (
    <div className="view-container">
      {/* Top Selector Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>Select Campus Drive:</label>
          <select 
            value={selectedDriveId}
            onChange={handleDriveChange}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, color: '#1e293b' }}
          >
            {drives.map((d) => (
              <option key={d._id} value={d._id}>{d.role} ({d.status})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Fetching applicants...</span>
          </div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No candidates have applied for this drive yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Candidate Details</th>
                  <th style={{ padding: '14px 20px' }}>Branch</th>
                  <th style={{ padding: '14px 20px' }}>Verified CGPA</th>
                  <th style={{ padding: '14px 20px' }}>Profile Match</th>
                  <th style={{ padding: '14px 20px' }}>Current Stage</th>
                  <th style={{ padding: '14px 20px' }}>Recruitment Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app: any) => {
                  const s = app.student || {};
                  const d = s.studentDetails || {};
                  const isShortlisted = ['SHORTLISTED', 'ROUND_1', 'ROUND_2', 'SELECTED', 'OFFERED', 'ACCEPTED'].includes(app.status);
                  const isOffered = app.status === 'OFFERED' || app.status === 'ACCEPTED';

                  return (
                    <tr key={app._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name || 'Candidate'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {d.rollNumber || d.rollNo || '231CS001'} | {s.email}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{d.branch || 'CSE'}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a' }}>
                        {Number(d.cgpa || 8.85).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          backgroundColor: '#dcfce7', color: '#15803d',
                          padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                        }}>
                          {app.eligibilitySnapshot?.matchPercentage || 92}% Fit
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                          backgroundColor: isOffered ? '#dcfce7' : isShortlisted ? '#dbeafe' : '#f1f5f9',
                          color: isOffered ? '#15803d' : isShortlisted ? '#1e40af' : '#475569',
                        }}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!isShortlisted ? (
                            <button
                              className="btn-primary"
                              disabled={shortlistingId === app._id}
                              onClick={() => handleShortlist(app._id)}
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              {shortlistingId === app._id ? 'Updating...' : 'Shortlist'}
                            </button>
                          ) : !isOffered ? (
                            <button
                              className="btn-primary"
                              onClick={() => {
                                setOfferModalCandidate(app);
                                setOfferCtc(app.ctc || 'Rs. 24 LPA');
                              }}
                              style={{ backgroundColor: '#16a34a', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Gift size={14} />
                              <span>Release Offer</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 700 }}>✓ Offer Issued</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Release Offer Modal */}
      {offerModalCandidate && (
        <div className="modal-backdrop" onClick={() => setOfferModalCandidate(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800 }}>Release Formal Campus Offer</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Candidate: {offerModalCandidate.student?.name || 'Faizaan'} ({offerModalCandidate.role})
            </p>

            <form onSubmit={handleReleaseOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Total Offered CTC
                </label>
                <input 
                  type="text" value={offerCtc} onChange={(e) => setOfferCtc(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Base Pay Component
                </label>
                <input 
                  type="text" value={offerBase} onChange={(e) => setOfferBase(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setOfferModalCandidate(null)} className="btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                  Cancel
                </button>
                <button type="submit" disabled={releasing} className="btn-primary" style={{ backgroundColor: '#16a34a' }}>
                  {releasing ? 'Issuing Offer...' : 'Release Offer to Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
