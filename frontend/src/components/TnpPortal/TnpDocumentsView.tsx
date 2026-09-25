import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const TnpDocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDocs();
  }, [filter]);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await api.getDocumentRequests(filter);
      if (res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (docId: string, status: 'VERIFIED' | 'REJECTED' | 'REPLACEMENT_REQUIRED', reason = '') => {
    if ((status === 'REJECTED' || status === 'REPLACEMENT_REQUIRED') && (!reason || reason.trim().length < 4)) {
      alert('A mandatory reason is required to reject student paperwork.');
      return;
    }

    try {
      setSubmitting(true);
      await api.verifyDocument(docId, status, reason);
      alert(`Document marked as ${status}!`);
      setSelectedDoc(null);
      setRejectionReason('');
      await loadDocs();
    } catch (err: any) {
      alert(err.message || 'Failed to update document status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="view-container">
      {/* Filter Tabs */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {['ALL', 'UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED'].map((st) => (
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

      {/* Documents Table */}
      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Fetching document verification queue...</span>
          </div>
        ) : documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No documents found in this queue.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Student Roll & Name</th>
                  <th style={{ padding: '14px 20px' }}>Document Name</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>Uploaded Date</th>
                  <th style={{ padding: '14px 20px' }}>Current Status</th>
                  <th style={{ padding: '14px 20px' }}>Verification Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc: any) => {
                  const student = doc.owner || {};
                  const isVerified = doc.status === 'VERIFIED';
                  const isRejected = doc.status === 'REJECTED';

                  return (
                    <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{student.name || 'Student'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#2563eb' }}>{student.studentDetails?.rollNumber || '231CS001'}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{doc.fileName}</div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569' }}>{doc.type}</td>
                      <td style={{ padding: '16px 20px', color: '#64748b' }}>
                        {new Date(doc.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: isVerified ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                          color: isVerified ? '#15803d' : isRejected ? '#b91c1c' : '#b45309',
                        }}>
                          {doc.status}
                        </span>
                        {doc.rejectionReason && (
                          <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px' }}>
                            Reason: {doc.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn-primary"
                            onClick={() => handleVerify(doc._id, 'VERIFIED')}
                            style={{ backgroundColor: '#16a34a', padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            ✓ Verify
                          </button>
                          <button
                            className="btn-primary"
                            onClick={() => setSelectedDoc(doc)}
                            style={{ backgroundColor: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '6px 12px', fontSize: '0.8rem' }}
                          >
                            ✕ Reject
                          </button>
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

      {/* Reject Modal with Mandatory Reason */}
      {selectedDoc && (
        <div className="modal-backdrop" onClick={() => setSelectedDoc(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#dc2626' }}>
              Reject Student Paperwork
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Document: {selectedDoc.title} ({selectedDoc.type})
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleVerify(selectedDoc._id, 'REJECTED', rejectionReason);
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Mandatory Rejection / Defect Reason
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Seal unclear, marks do not match institutional grade ledger, blurry scan..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedDoc(null)} className="btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ backgroundColor: '#dc2626' }}>
                  {submitting ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
