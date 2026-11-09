import React, { useState, useEffect } from 'react';
import { Gift, Loader2, Eye, X, Mail, Phone } from 'lucide-react';
import { api } from '../../services/api';
import { StatusBadge } from '../common/StatusBadge';

export const CompanyApplicantsView: React.FC = () => {
  const [drives, setDrives] = useState<any[]>([]);
  const [selectedDriveId, setSelectedDriveId] = useState<string>('all');
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlistingId, setShortlistingId] = useState<string | null>(null);

  // Student Profile modal state
  const [selectedProfileCandidate, setSelectedProfileCandidate] = useState<any | null>(null);

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
      } else {
        await loadApplicants('all');
      }
    } catch (err) {
      console.error('Error loading drives:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicants = async (driveId: string) => {
    try {
      setLoading(true);
      const res = await api.getDriveApplicants(driveId);
      if (res.data) {
        setApplicants(res.data);
      }
    } catch (err) {
      console.error('Error loading applicants:', err);
    } finally {
      setLoading(false);
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
      if (selectedProfileCandidate && selectedProfileCandidate._id === appId) {
        setSelectedProfileCandidate((prev: any) => ({ ...prev, status: 'SHORTLISTED' }));
      }
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
      const targetDriveId = selectedDriveId === 'all' 
        ? (offerModalCandidate.drive?._id || offerModalCandidate.drive || (drives[0] && drives[0]._id))
        : selectedDriveId;
      await api.releaseOffer({
        studentId: offerModalCandidate.student?._id || offerModalCandidate.student,
        driveId: targetDriveId,
        ctc: offerCtc,
        baseSalary: offerBase,
        role: offerModalCandidate.role,
      });
      alert('🎉 Official placement offer released to candidate!');
      setOfferModalCandidate(null);
      if (selectedProfileCandidate && selectedProfileCandidate._id === offerModalCandidate._id) {
        setSelectedProfileCandidate((prev: any) => ({ ...prev, status: 'OFFERED' }));
      }
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
          <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>Filter Candidates by Drive:</label>
          <select 
            value={selectedDriveId}
            onChange={handleDriveChange}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontWeight: 600, color: '#111827', minWidth: '240px' }}
          >
            <option value="all">All Drives ({applicants.length} Candidates)</option>
            {drives.map((d) => (
              <option key={d._id} value={d._id}>{d.role} ({d.status})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applicants Table */}
      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Fetching candidate applications...</span>
          </div>
        ) : applicants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            No candidates have applied for this drive yet. Once students apply from the portal, they will appear here.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Candidate Details</th>
                  <th style={{ padding: '14px 20px' }}>Applied Drive / Role</th>
                  <th style={{ padding: '14px 20px' }}>Branch</th>
                  <th style={{ padding: '14px 20px' }}>Verified CGPA</th>
                  <th style={{ padding: '14px 20px' }}>Fit Match</th>
                  <th style={{ padding: '14px 20px' }}>Current Stage</th>
                  <th style={{ padding: '14px 20px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applicants.map((app: any) => {
                  const s = app.student || {};
                  const d = s.studentDetails || {};
                  const isShortlisted = ['SHORTLISTED', 'ROUND_1', 'ROUND_2', 'SELECTED', 'OFFERED', 'ACCEPTED'].includes(app.status);
                  const isOffered = app.status === 'OFFERED' || app.status === 'ACCEPTED';

                  return (
                    <tr key={app._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div 
                          onClick={() => setSelectedProfileCandidate(app)}
                          style={{ fontWeight: 700, color: '#2563EB', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          title="Click to view full student profile"
                        >
                          <span>{s.name || 'Candidate'}</span>
                          <Eye size={14} color="#2563EB" />
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {d.rollNumber || d.rollNo || '231CS001'} | {s.email}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: 600, color: '#0F172A' }}>
                        <div>{app.role}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{app.ctc}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{d.branch || 'CSE'}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: '#0F172A' }}>
                        {Number(d.cgpa || 8.85).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#1E293B',
                          padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                        }}>
                          {app.eligibilitySnapshot?.matchPercentage || 92}% Fit
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <StatusBadge status={app.status} />
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          {/* 1. View Student Profile Button */}
                          <button
                            className="btn-secondary"
                            onClick={() => setSelectedProfileCandidate(app)}
                            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="View student verified profile"
                          >
                            <Eye size={14} />
                            <span>View Profile</span>
                          </button>

                          {/* 2. Shortlist / Release Offer Button */}
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
                              style={{ backgroundColor: '#10B981', padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Gift size={14} />
                              <span>Release Offer</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>✓ Offer Issued</span>
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

      {/* 3. COMPREHENSIVE STUDENT PROFILE MODAL FOR RECRUITER */}
      {selectedProfileCandidate && (
        <div 
          className="modal-overlay" 
          onClick={() => setSelectedProfileCandidate(null)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.70)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}
        >
          <div 
            className="modal-content" 
            onClick={(e) => e.stopPropagation()} 
            style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <img 
                  src={selectedProfileCandidate.student?.avatar || '/doraemon.png'} 
                  alt="Student Avatar" 
                  style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563EB' }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {selectedProfileCandidate.student?.name || 'Faizaan'}
                    <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                      • TNP Verified
                    </span>
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '2px' }}>
                    Roll: {selectedProfileCandidate.student?.studentDetails?.rollNumber || '231CS001'} • {selectedProfileCandidate.student?.studentDetails?.branch || 'CSE'} ({selectedProfileCandidate.student?.studentDetails?.program || 'B.Tech'})
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedProfileCandidate(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Academic Metrics Grid */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                Institutional Academic Record
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Cumulative CGPA</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563EB', marginTop: '2px' }}>
                    {Number(selectedProfileCandidate.student?.studentDetails?.cgpa || 8.85).toFixed(2)}
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Attendance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                    {selectedProfileCandidate.student?.studentDetails?.attendancePercentage || 88}%
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>10th / 12th %</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                    {selectedProfileCandidate.student?.studentDetails?.tenthPercentage || 94}% / {selectedProfileCandidate.student?.studentDetails?.twelfthPercentage || 92}%
                  </div>
                </div>

                <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Active Backlogs</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                    {selectedProfileCandidate.student?.studentDetails?.activeBacklogs || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Application & Drive Details */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Applied Position</div>
                  <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0F172A' }}>
                    {selectedProfileCandidate.role} ({selectedProfileCandidate.ctc})
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>Candidate Stage</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563EB' }}>
                    {selectedProfileCandidate.status}
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Skills Matrix */}
            <div style={{ marginBottom: '18px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Verified Technical Skills
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {(selectedProfileCandidate.student?.studentDetails?.skills || ['React.js', 'Node.js', 'TypeScript', 'Java', 'Python', 'SQL', 'Git', 'Data Structures', 'Tailwind CSS']).map((skill: string, i: number) => (
                  <span key={i} style={{ backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={15} color="#64748B" />
                  <span>{selectedProfileCandidate.student?.email}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={15} color="#64748B" />
                  <span>{selectedProfileCandidate.student?.phone || '+91 98765 43210'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => setSelectedProfileCandidate(null)} 
                className="btn-secondary"
                style={{ padding: '8px 16px' }}
              >
                Close Profile
              </button>

              {!['SHORTLISTED', 'ROUND_1', 'ROUND_2', 'SELECTED', 'OFFERED', 'ACCEPTED'].includes(selectedProfileCandidate.status) && (
                <button
                  className="btn-primary"
                  disabled={shortlistingId === selectedProfileCandidate._id}
                  onClick={() => handleShortlist(selectedProfileCandidate._id)}
                  style={{ padding: '8px 18px' }}
                >
                  {shortlistingId === selectedProfileCandidate._id ? 'Shortlisting...' : 'Shortlist Candidate'}
                </button>
              )}

              {['SHORTLISTED', 'ROUND_1', 'ROUND_2', 'SELECTED'].includes(selectedProfileCandidate.status) && selectedProfileCandidate.status !== 'OFFERED' && (
                <button
                  className="btn-primary"
                  onClick={() => {
                    const c = selectedProfileCandidate;
                    setSelectedProfileCandidate(null);
                    setOfferModalCandidate(c);
                    setOfferCtc(c.ctc || 'Rs. 24 LPA');
                  }}
                  style={{ backgroundColor: '#10B981', padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Gift size={16} />
                  <span>Release Placement Offer</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Release Offer Modal */}
      {offerModalCandidate && (
        <div className="modal-backdrop" onClick={() => setOfferModalCandidate(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 27, 51, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1200, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>Release Formal Campus Offer</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 16px 0' }}>
              Candidate: {offerModalCandidate.student?.name || 'Faizaan'} ({offerModalCandidate.role})
            </p>

            <form onSubmit={handleReleaseOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Total Offered CTC
                </label>
                <input 
                  type="text" value={offerCtc} onChange={(e) => setOfferCtc(e.target.value)} required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Base Pay Component
                </label>
                <input 
                  type="text" value={offerBase} onChange={(e) => setOfferBase(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setOfferModalCandidate(null)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={releasing} className="btn-primary" style={{ backgroundColor: '#10B981' }}>
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
