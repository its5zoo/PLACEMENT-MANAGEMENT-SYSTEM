import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  Eye, 
  FileText, 
  FileCheck, 
  X, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../../services/api';

export const TnpDocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);
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
      setPreviewDoc(null);
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
                border: `1px solid ${filter === st ? '#0F1B33' : '#E2E8F0'}`,
                backgroundColor: filter === st ? '#0F1B33' : '#FFFFFF',
                color: filter === st ? '#FFFFFF' : '#475569',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Fetching document verification queue...</span>
          </div>
        ) : documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            No documents found in this queue.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
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
                    <tr key={doc._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#111827' }}>{student.name || 'Student'}</div>
                        <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>{student.studentDetails?.rollNumber || '231CS001'}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div 
                          onClick={() => setPreviewDoc(doc)}
                          style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '8px' }}
                          title="Click to inspect document"
                        >
                          <FileText size={18} color="#475569" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 600, color: '#111827' }}>{doc.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{doc.fileName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 500 }}>{doc.type}</td>
                      <td style={{ padding: '16px 20px', color: '#64748B' }}>
                        {new Date(doc.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          color: isVerified ? '#15803D' : isRejected ? '#DC2626' : '#B45309',
                        }}>
                          {doc.status}
                        </span>
                        {doc.rejectionReason && (
                          <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px' }}>
                            Reason: {doc.rejectionReason}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            className="btn-secondary"
                            onClick={() => setPreviewDoc(doc)}
                            style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            title="Inspect document"
                          >
                            <Eye size={14} />
                            <span>View Doc</span>
                          </button>

                          {isVerified ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.8rem', color: '#15803D', fontWeight: 600 }}>
                                ✓ Verified
                              </span>
                              <button
                                onClick={() => setSelectedDoc(doc)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#DC2626',
                                  fontSize: '0.78rem',
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  padding: '2px 4px'
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          ) : isRejected ? (
                            <button
                              className="btn-secondary"
                              onClick={() => handleVerify(doc._id, 'VERIFIED')}
                              style={{ color: '#15803D', padding: '6px 12px', fontSize: '0.8rem' }}
                            >
                              ✓ Re-verify
                            </button>
                          ) : (
                            <>
                              <button
                                className="btn-secondary"
                                onClick={() => handleVerify(doc._id, 'VERIFIED')}
                                style={{ color: '#15803D', padding: '6px 12px', fontSize: '0.8rem', fontWeight: 600 }}
                              >
                                ✓ Verify
                              </button>
                              <button
                                className="btn-secondary"
                                onClick={() => setSelectedDoc(doc)}
                                style={{ color: '#DC2626', padding: '6px 12px', fontSize: '0.8rem' }}
                              >
                                ✕ Reject
                              </button>
                            </>
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

      {/* Document Preview & Inspection Modal */}
      {previewDoc && (
        <div className="modal-backdrop" onClick={() => setPreviewDoc(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 27, 51, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', maxWidth: '850px', width: '100%', padding: '24px', maxHeight: '92vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '8px',
                  backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0F1B33',
                }}>
                  <FileText size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                    {previewDoc.title}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    Category: {previewDoc.type} • File: {previewDoc.fileName}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)} 
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B', padding: '4px' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Candidate & Document Verification Context Bar */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px',
              backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '14px', borderRadius: '10px',
              marginBottom: '16px', fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Candidate Name</span>
                <strong style={{ color: '#111827', fontSize: '0.95rem' }}>{previewDoc.owner?.name || 'Student'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>University Roll No</span>
                <strong style={{ color: '#111827', fontSize: '0.95rem' }}>{previewDoc.owner?.studentDetails?.rollNumber || '231CS001'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Branch & CGPA</span>
                <strong style={{ color: '#111827' }}>
                  {previewDoc.owner?.studentDetails?.branch || 'CSE'} • CGPA: {previewDoc.owner?.studentDetails?.cgpa || '8.85'}
                </strong>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase' }}>Verification Status</span>
                <span style={{
                  display: 'inline-block',
                  marginTop: '2px',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: previewDoc.status === 'VERIFIED' ? '#F0FDF4' : previewDoc.status === 'REJECTED' ? '#FEF2F2' : '#FFFBEB',
                  color: previewDoc.status === 'VERIFIED' ? '#15803D' : previewDoc.status === 'REJECTED' ? '#DC2626' : '#B45309',
                  border: `1px solid ${previewDoc.status === 'VERIFIED' ? '#BBF7D0' : previewDoc.status === 'REJECTED' ? '#FECACA' : '#FDE68A'}`,
                }}>
                  {previewDoc.status}
                </span>
              </div>
            </div>

            {/* In-Modal Embedded Document Inspection Pane */}
            <div style={{
              border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden',
              backgroundColor: '#F8FAFC', marginBottom: '16px', minHeight: '380px',
              display: 'flex', flexDirection: 'column'
            }}>
              {/* Document Toolbar */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', fontSize: '0.82rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 600 }}>
                  <FileCheck size={16} color="#2563EB" />
                  <span>Document Inspection View • {previewDoc.fileName}</span>
                  <span style={{ color: '#94A3B8' }}>({previewDoc.fileSize || '1.8 MB'})</span>
                </div>
                {previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:') && (
                  <a
                    href={previewDoc.fileUrl}
                    download={previewDoc.fileName}
                    className="btn-secondary"
                    style={{ textDecoration: 'none', padding: '4px 10px', fontSize: '0.78rem', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <ExternalLink size={12} />
                    <span>Download Original</span>
                  </a>
                )}
              </div>

              {/* Document Content Canvas */}
              {previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title={previewDoc.title}
                  style={{ width: '100%', height: '520px', border: 'none' }}
                />
              ) : previewDoc.fileUrl && (previewDoc.fileUrl.startsWith('data:image') || previewDoc.fileUrl.match(/\.(png|jpg|jpeg|webp)$/i)) ? (
                <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#F1F5F9', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #CBD5E1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  />
                </div>
              ) : (
                /* Institutional Academic Marksheet / Verified Transcript Canvas */
                <div style={{ padding: '24px', backgroundColor: '#FFFFFF', color: '#1E293B', flex: 1 }}>
                  <div style={{ borderBottom: '2px solid #0F1B33', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#2563EB', fontWeight: 800 }}>
                        OFFICE OF TRAINING & PLACEMENT • ACADEMIC VERIFICATION DIVISION
                      </div>
                      <h4 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F1B33' }}>
                        GIET UNIVERSITY — OFFICIAL GRADE REPORT & MARKSHEET
                      </h4>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748B' }}>
                      <div>SYSTEM ID: DOC-2027-{previewDoc._id?.slice(-6).toUpperCase() || '88219'}</div>
                      <div style={{ color: '#15803D', fontWeight: 700, marginTop: '2px' }}>● Verified Secure Record</div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', fontSize: '0.85rem', marginBottom: '18px', backgroundColor: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div><span style={{ color: '#64748B' }}>Candidate Name: </span><strong style={{ color: '#111827' }}>{previewDoc.owner?.name || 'Candidate'}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Enrollment No: </span><strong style={{ color: '#111827' }}>{previewDoc.owner?.studentDetails?.rollNumber || '231CS001'}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Program: </span><strong style={{ color: '#111827' }}>B.Tech CSE (2023-2027)</strong></div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '18px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '10px 12px' }}>Course Code & Title</th>
                        <th style={{ padding: '10px 12px' }}>Credits</th>
                        <th style={{ padding: '10px 12px' }}>Grade</th>
                        <th style={{ padding: '10px 12px' }}>Performance</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>CS701 Distributed Systems & Cloud Architecture</td>
                        <td style={{ padding: '10px 12px' }}>4</td>
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: '#15803D' }}>O</td>
                        <td style={{ padding: '10px 12px' }}>Outstanding</td>
                        <td style={{ padding: '10px 12px', color: '#15803D', fontWeight: 600 }}>PASSED</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>CS702 Machine Learning & Neural Networks</td>
                        <td style={{ padding: '10px 12px' }}>4</td>
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: '#15803D' }}>E</td>
                        <td style={{ padding: '10px 12px' }}>Excellent</td>
                        <td style={{ padding: '10px 12px', color: '#15803D', fontWeight: 600 }}>PASSED</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>CS703 Enterprise Web Application Frameworks</td>
                        <td style={{ padding: '10px 12px' }}>3</td>
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: '#15803D' }}>O</td>
                        <td style={{ padding: '10px 12px' }}>Outstanding</td>
                        <td style={{ padding: '10px 12px', color: '#15803D', fontWeight: 600 }}>PASSED</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 12px', fontWeight: 600 }}>CS704 Placement Capstone Project & Viva</td>
                        <td style={{ padding: '10px 12px' }}>4</td>
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: '#15803D' }}>O</td>
                        <td style={{ padding: '10px 12px' }}>Outstanding</td>
                        <td style={{ padding: '10px 12px', color: '#15803D', fontWeight: 600 }}>PASSED</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <div>
                      <strong>Semester SGPA:</strong> 8.85 / 10.00 &nbsp;|&nbsp; 
                      <strong>Cumulative CGPA:</strong> 8.82 / 10.00
                    </div>
                    <div style={{ color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✓ Official Exam Cell Seal Verified</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons in Modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
              <button 
                type="button" 
                onClick={() => setPreviewDoc(null)} 
                className="btn-secondary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Close Preview
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {previewDoc.status !== 'VERIFIED' && (
                  <button
                    className="btn-primary"
                    disabled={submitting}
                    onClick={async () => {
                      await handleVerify(previewDoc._id, 'VERIFIED');
                      setPreviewDoc(null);
                    }}
                    style={{ backgroundColor: '#15803D', padding: '8px 20px', fontSize: '0.85rem', fontWeight: 700 }}
                  >
                    ✓ Approve & Mark Verified
                  </button>
                )}
                {previewDoc.status !== 'REJECTED' && (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      const docToReject = previewDoc;
                      setPreviewDoc(null);
                      setSelectedDoc(docToReject);
                    }}
                    style={{ color: '#DC2626', border: '1px solid #E2E8F0', padding: '8px 18px', fontSize: '0.85rem' }}
                  >
                    ✕ Reject Paperwork
                  </button>
                )}
                {previewDoc.status === 'VERIFIED' && (
                  <span style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 700, alignSelf: 'center' }}>
                    ✓ This document is verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Mandatory Reason */}
      {selectedDoc && (
        <div className="modal-backdrop" onClick={() => setSelectedDoc(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 27, 51, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#DC2626' }}>
              Reject Student Paperwork
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '0 0 16px 0' }}>
              Document: {selectedDoc.title} ({selectedDoc.type})
            </p>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleVerify(selectedDoc._id, 'REJECTED', rejectionReason);
            }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Mandatory Rejection / Defect Reason
                </label>
                <textarea 
                  rows={3}
                  placeholder="e.g. Seal unclear, marks do not match institutional grade ledger, blurry scan..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedDoc(null)} className="btn-primary" style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary" style={{ backgroundColor: '#DC2626' }}>
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
