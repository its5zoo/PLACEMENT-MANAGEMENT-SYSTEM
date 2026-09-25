import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docType, setDocType] = useState('Semester Marksheet');
  const [docTitle, setDocTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await api.getMyDocuments();
      if (res.data) {
        setDocuments(res.data);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.uploadDocument({
        title: docTitle || `${docType} Document`,
        type: docType,
        fileName: `${docType.replace(/\s+/g, '_')}_2027.pdf`,
        fileSize: '1.8 MB',
      });
      setShowUploadModal(false);
      setDocTitle('');
      await loadDocs();
      alert('Document uploaded successfully for TNP verification!');
    } catch (err: any) {
      alert(err.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string, reason?: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
            <CheckCircle2 size={14} /> Verified by TNP
          </span>
        );
      case 'REJECTED':
      case 'REPLACEMENT_REQUIRED':
        return (
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              <XCircle size={14} /> Rejected
            </span>
            {reason && (
              <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', maxWidth: '240px' }}>
                Reason: {reason}
              </div>
            )}
          </div>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
            <Clock size={14} /> Under Review
          </span>
        );
    }
  };

  return (
    <div className="view-container">
      {/* Top Banner */}
      <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>
            Institutional Placement Documents
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            All marksheets and identification documents verified by the Training & Placement Officer.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setShowUploadModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Loading verified paperwork...</span>
          </div>
        ) : documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No documents uploaded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Document Name</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>File Size</th>
                  <th style={{ padding: '14px 20px' }}>Upload Date</th>
                  <th style={{ padding: '14px 20px' }}>Verification Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc: any) => (
                  <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          backgroundColor: '#eff6ff', color: '#2563eb',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <FileText size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{doc.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{doc.fileName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{doc.type}</td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>{doc.fileSize || '1.5 MB'}</td>
                    <td style={{ padding: '16px 20px', color: '#64748b' }}>
                      {new Date(doc.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {getStatusBadge(doc.status, doc.rejectionReason)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 800 }}>Upload Document for TNP Verification</h3>
            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Document Category
                </label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="Resume">Updated Placement Resume</option>
                  <option value="10th Marksheet">10th Secondary Marksheet</option>
                  <option value="12th Marksheet">12th Senior Secondary Marksheet</option>
                  <option value="Semester Marksheet">Semester Grade Sheet</option>
                  <option value="Certificate">Technical Certification</option>
                  <option value="Internship Certificate">Internship Completion Letter</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Document Title / Semester Label
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 7th Semester Grade Sheet"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div style={{
                border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '24px', textAlign: 'center',
                backgroundColor: '#f8fafc', marginBottom: '20px', cursor: 'pointer',
              }}>
                <Upload size={24} color="#64748b" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Click to select PDF or Marksheet image</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Max file size: 5MB (PDF, PNG, JPG)</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Submitting...' : 'Submit to TNP'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
