import React, { useState, useEffect } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const CompanyRequestsView: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedDrive, setSelectedDrive] = useState<any | null>(null);

  // Review modal form state
  const [decision, setDecision] = useState<'APPROVE' | 'DECLINE' | 'NEEDS_CORRECTION'>('APPROVE');
  const [reason, setReason] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const res = await api.getCompanyRequests(filter);
      if (res.data) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Error loading company requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (drive: any) => {
    setSelectedDrive(drive);
    setDecision('APPROVE');
    setReason('');
    setInternalNotes(drive.internalTnpNotes || '');
  };

  const handleSubmitDecision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (decision === 'DECLINE' && (!reason || reason.trim().length < 5)) {
      alert('A mandatory, clear reason is required when declining a company drive.');
      return;
    }
    if (decision === 'NEEDS_CORRECTION' && (!reason || reason.trim().length < 5)) {
      alert('Correction notes are required when requesting changes.');
      return;
    }

    try {
      setSubmitting(true);
      await api.reviewCompanyRequest(
        selectedDrive._id,
        decision,
        decision === 'DECLINE' ? reason : '',
        decision === 'NEEDS_CORRECTION' ? reason : '',
        internalNotes
      );
      alert(`Drive request successfully updated: ${decision}`);
      setSelectedDrive(null);
      await loadRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="view-container">
      {/* Top Filter Bar */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'NEEDS_CORRECTION', 'APPROVED', 'APPLICATIONS_OPEN', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === st ? '#2563eb' : '#f1f5f9',
                color: filter === st ? '#ffffff' : '#475569',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Fetching company placement requests...</span>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No company drive requests in this filter category.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Company & Role</th>
                  <th style={{ padding: '14px 20px' }}>Offered Package (CTC)</th>
                  <th style={{ padding: '14px 20px' }}>Min CGPA</th>
                  <th style={{ padding: '14px 20px' }}>Current Status</th>
                  <th style={{ padding: '14px 20px' }}>Submitted Date</th>
                  <th style={{ padding: '14px 20px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r: any) => (
                  <tr key={r._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{r.companyName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.role}</div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 700, color: '#16a34a' }}>{r.ctc}</td>
                    <td style={{ padding: '16px 20px', color: '#334155' }}>{r.eligibility?.minCgpa || 7.0}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: r.status === 'APPROVED' || r.status === 'APPLICATIONS_OPEN' ? '#dcfce7' : r.status === 'NEEDS_CORRECTION' ? '#fef3c7' : r.status === 'CANCELLED' ? '#fee2e2' : '#dbeafe',
                        color: r.status === 'APPROVED' || r.status === 'APPLICATIONS_OPEN' ? '#15803d' : r.status === 'NEEDS_CORRECTION' ? '#b45309' : r.status === 'CANCELLED' ? '#b91c1c' : '#1e40af',
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {new Date(r.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button 
                        className="btn-primary"
                        onClick={() => handleOpenReview(r)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={14} />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review & Decision Modal */}
      {selectedDrive && (
        <div className="modal-backdrop" onClick={() => setSelectedDrive(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>TNP Institutional Drive Review</h3>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{selectedDrive.companyName} — {selectedDrive.role}</span>
              </div>
              <button onClick={() => setSelectedDrive(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.2rem', color: '#64748b' }}>✕</button>
            </div>

            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Left Side: Drive Criteria & Details */}
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Drive Specifications</h4>
                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Offered CTC:</strong> {selectedDrive.ctc}</div>
                  <div><strong>Base Pay:</strong> {selectedDrive.baseSalary || 'N/A'}</div>
                  <div><strong>Location:</strong> {selectedDrive.location}</div>
                  <div><strong>Work Mode:</strong> {selectedDrive.workMode || 'On-site'}</div>
                  <div><strong>Application Deadline:</strong> {new Date(selectedDrive.applicationDeadline).toLocaleDateString('en-GB')}</div>
                  <div><strong>Minimum CGPA:</strong> {selectedDrive.eligibility?.minCgpa || 7.0}</div>
                  <div><strong>Allowed Branches:</strong> {(selectedDrive.eligibility?.allowedBranches || []).join(', ')}</div>
                  <div><strong>Max Active Backlogs:</strong> {selectedDrive.eligibility?.maxActiveBacklogs ?? 0}</div>
                </div>

                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: '16px 0 8px 0' }}>Selection Rounds</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
                  {(selectedDrive.rounds || []).map((rnd: any, i: number) => (
                    <div key={i} style={{ padding: '8px 12px', backgroundColor: '#f1f5f9', borderRadius: '6px' }}>
                      <strong>Round {rnd.roundIndex || i + 1}:</strong> {rnd.name} ({rnd.type})
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side: TNP Decision Form */}
              <form onSubmit={handleSubmitDecision} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                    TNP Decision
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setDecision('APPROVE')}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #bbf7d0',
                        backgroundColor: decision === 'APPROVE' ? '#dcfce7' : '#ffffff',
                        color: '#15803d', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision('NEEDS_CORRECTION')}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fde68a',
                        backgroundColor: decision === 'NEEDS_CORRECTION' ? '#fef3c7' : '#ffffff',
                        color: '#b45309', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      ✏ Needs Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision('DECLINE')}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #fecaca',
                        backgroundColor: decision === 'DECLINE' ? '#fee2e2' : '#ffffff',
                        color: '#b91c1c', fontWeight: 700, cursor: 'pointer',
                      }}
                    >
                      ✕ Decline
                    </button>
                  </div>
                </div>

                {decision !== 'APPROVE' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginBottom: '6px' }}>
                      {decision === 'DECLINE' ? 'Mandatory Rejection Reason' : 'Required Corrections for Company'}
                    </label>
                    <textarea 
                      rows={3}
                      placeholder={decision === 'DECLINE' ? 'Enter exact institutional reason for declining...' : 'Describe what salary, round, or eligibility fields require correction...'}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Private TNP Internal Notes (Hidden from Company & Students)
                  </label>
                  <textarea 
                    rows={3}
                    placeholder="Internal verification checklist, background check notes..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 'auto' }}>
                  <button type="button" onClick={() => setSelectedDrive(null)} className="btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ backgroundColor: '#2563eb' }}>
                    {submitting ? 'Recording...' : `Submit Decision (${decision})`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
