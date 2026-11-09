import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Loader2, 
  Eye, 
  X, 
  ExternalLink, 
  FileCheck, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';

export const DocumentsView: React.FC = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docType, setDocType] = useState('Semester Marksheet');
  const [docTitle, setDocTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document Viewer State
  const [previewDoc, setPreviewDoc] = useState<any | null>(null);

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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    setUploadError('');
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB limit. Please upload a smaller PDF or image.');
      return;
    }

    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|png|jpg|jpeg|webp)$/i)) {
      setUploadError('Please select a valid PDF document or image file (PDF, PNG, JPG).');
      return;
    }

    setSelectedFile(file);
    if (!docTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setDocTitle(cleanName);
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFileDataUrl(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read document file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !fileDataUrl) {
      setUploadError('Please select a document file to upload for verification.');
      return;
    }

    try {
      setSubmitting(true);
      setUploadError('');
      await api.uploadDocument({
        title: docTitle.trim() || `${docType} Document`,
        type: docType,
        fileName: selectedFile ? selectedFile.name : `${docType.replace(/\s+/g, '_')}_2027.pdf`,
        fileSize: selectedFile ? formatFileSize(selectedFile.size) : '1.8 MB',
        fileUrl: fileDataUrl || '/sample-document.pdf',
        mimeType: selectedFile?.type || 'application/pdf',
      });
      setShowUploadModal(false);
      setDocTitle('');
      setSelectedFile(null);
      setFileDataUrl('');
      await loadDocs();
      alert('Document uploaded successfully for TNP verification!');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload document');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: string, reason?: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#F8FAFC', color: '#15803D', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
            <CheckCircle2 size={14} /> Verified by TNP
          </span>
        );
      case 'REJECTED':
      case 'REPLACEMENT_REQUIRED':
        return (
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#F8FAFC', color: '#DC2626', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
              <XCircle size={14} /> Rejected
            </span>
            {reason && (
              <div style={{ fontSize: '0.75rem', color: '#DC2626', marginTop: '4px', maxWidth: '240px' }}>
                Reason: {reason}
              </div>
            )}
          </div>
        );
      default:
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0' }}>
            Institutional Placement Documents
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
            All marksheets and identification documents verified by the Training & Placement Officer.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => {
            setSelectedFile(null);
            setFileDataUrl('');
            setUploadError('');
            setShowUploadModal(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Upload size={16} />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Documents Table */}
      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Loading verified paperwork...</span>
          </div>
        ) : documents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            No documents uploaded yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>Document Name</th>
                  <th style={{ padding: '14px 20px' }}>Category</th>
                  <th style={{ padding: '14px 20px' }}>File Size</th>
                  <th style={{ padding: '14px 20px' }}>Upload Date</th>
                  <th style={{ padding: '14px 20px' }}>Verification Status</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc: any) => (
                  <tr key={doc._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '36px', height: '36px', borderRadius: '8px',
                          backgroundColor: '#F8FAFC', color: '#0F1B33',
                          border: '1px solid #E2E8F0',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <FileText size={18} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#111827' }}>{doc.title}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{doc.fileName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{doc.type}</td>
                    <td style={{ padding: '16px 20px', color: '#64748B' }}>{doc.fileSize || '1.5 MB'}</td>
                    <td style={{ padding: '16px 20px', color: '#64748B' }}>
                      {new Date(doc.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {getStatusBadge(doc.status, doc.rejectionReason)}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        className="btn-secondary"
                        onClick={() => setPreviewDoc(doc)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={14} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Modal with File Picker */}
      {showUploadModal && (
        <div className="modal-backdrop" onClick={() => setShowUploadModal(false)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 27, 51, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                Upload Document for TNP Verification
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {uploadError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
                color: '#DC2626', padding: '10px 14px', borderRadius: '8px',
                fontSize: '0.82rem', marginBottom: '14px',
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUpload}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Document Category
                </label>
                <select 
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#111827' }}
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
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Document Title / Semester Label
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 7th Semester Grade Sheet"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0', color: '#111827' }}
                />
              </div>

              {/* Real File Input Hidden */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {/* Clickable Drag & Drop Upload Target */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                style={{
                  border: isDragging ? '2px dashed #2563EB' : '2px dashed #CBD5E1',
                  borderRadius: '10px',
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: isDragging ? '#EFF6FF' : selectedFile ? '#F8FAFC' : '#F8FAFC',
                  marginBottom: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {selectedFile ? (
                  <div>
                    <div style={{ display: 'inline-flex', padding: '10px', borderRadius: '50%', backgroundColor: '#EFF6FF', color: '#2563EB', marginBottom: '8px' }}>
                      <FileCheck size={26} />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827' }}>
                      {selectedFile.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '4px' }}>
                      Size: {formatFileSize(selectedFile.size)} • Click to replace file
                    </div>
                    <span style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      backgroundColor: '#F0FDF4',
                      color: '#15803D',
                      border: '1px solid #BBF7D0',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      ✓ File ready to submit
                    </span>
                  </div>
                ) : (
                  <div>
                    <Upload size={28} color="#64748B" style={{ margin: '0 auto 8px auto' }} />
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#1E293B' }}>
                      Click to choose document or drag & drop here
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>
                      Supports PDF, PNG, JPG (up to 15MB)
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowUploadModal(false)} 
                  className="btn-primary" 
                  style={{ backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', color: '#475569' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting} 
                  className="btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  {submitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                  <span>{submitting ? 'Uploading to TNP...' : 'Submit to TNP'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student View Document Modal */}
      {previewDoc && (
        <div className="modal-backdrop" onClick={() => setPreviewDoc(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 27, 51, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', maxWidth: '800px', width: '100%', padding: '24px', maxHeight: '90vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '8px',
                  backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0F1B33',
                }}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#111827' }}>
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
                <X size={20} />
              </button>
            </div>

            {/* Document Meta Row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px',
              marginBottom: '16px', fontSize: '0.85rem'
            }}>
              <div>
                <span style={{ color: '#64748B' }}>File Size: </span>
                <strong style={{ color: '#111827' }}>{previewDoc.fileSize || '1.5 MB'}</strong>
                <span style={{ margin: '0 8px', color: '#CBD5E1' }}>•</span>
                <span style={{ color: '#64748B' }}>Uploaded: </span>
                <strong style={{ color: '#111827' }}>{new Date(previewDoc.createdAt).toLocaleDateString('en-GB')}</strong>
              </div>
              <div>
                {getStatusBadge(previewDoc.status, previewDoc.rejectionReason)}
              </div>
            </div>

            {/* In-Modal Visual Document Viewer */}
            <div style={{
              border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden',
              backgroundColor: '#F8FAFC', minHeight: '360px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              {previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:application/pdf') ? (
                <iframe
                  src={previewDoc.fileUrl}
                  title={previewDoc.title}
                  style={{ width: '100%', height: '480px', border: 'none' }}
                />
              ) : previewDoc.fileUrl && (previewDoc.fileUrl.startsWith('data:image') || previewDoc.fileUrl.match(/\.(png|jpg|jpeg|webp)$/i)) ? (
                <div style={{ padding: '16px', width: '100%', textAlign: 'center' }}>
                  <img
                    src={previewDoc.fileUrl}
                    alt={previewDoc.title}
                    style={{ maxWidth: '100%', maxHeight: '460px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #E2E8F0' }}
                  />
                </div>
              ) : (
                /* Institutional Academic Transcript Canvas */
                <div style={{ width: '100%', padding: '24px', backgroundColor: '#FFFFFF', color: '#1E293B', textAlign: 'left' }}>
                  <div style={{ borderBottom: '2px solid #0F1B33', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', letterSpacing: '1px', textTransform: 'uppercase', color: '#2563EB', fontWeight: 800 }}>
                        OFFICE OF TRAINING & PLACEMENT • ACADEMIC VERIFICATION
                      </div>
                      <h4 style={{ margin: '2px 0 0 0', fontSize: '1.1rem', fontWeight: 800, color: '#0F1B33' }}>
                        GIET UNIVERSITY — OFFICIAL GRADE REPORT
                      </h4>
                    </div>
                    <div style={{ textAlign: 'right', fontSize: '0.75rem', color: '#64748B' }}>
                      DOC ID: {previewDoc._id?.slice(-8).toUpperCase() || 'GIET-88219'}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '0.82rem', marginBottom: '16px' }}>
                    <div><span style={{ color: '#64748B' }}>Document: </span><strong>{previewDoc.title}</strong></div>
                    <div><span style={{ color: '#64748B' }}>Program: </span><strong>B.Tech CSE (2023-2027)</strong></div>
                    <div><span style={{ color: '#64748B' }}>Status: </span><strong style={{ color: '#15803D' }}>PASSED FIRST CLASS</strong></div>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '16px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                        <th style={{ padding: '8px' }}>Course Code & Title</th>
                        <th style={{ padding: '8px' }}>Credits</th>
                        <th style={{ padding: '8px' }}>Grade</th>
                        <th style={{ padding: '8px' }}>Performance</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px' }}>CS701 Distributed Systems & Cloud Architecture</td>
                        <td style={{ padding: '8px' }}>4</td>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#15803D' }}>O</td>
                        <td style={{ padding: '8px' }}>Outstanding</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px' }}>CS702 Machine Learning & Deep Neural Networks</td>
                        <td style={{ padding: '8px' }}>4</td>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#15803D' }}>E</td>
                        <td style={{ padding: '8px' }}>Excellent</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '8px' }}>CS703 Enterprise Full-Stack Web Technologies</td>
                        <td style={{ padding: '8px' }}>3</td>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#15803D' }}>O</td>
                        <td style={{ padding: '8px' }}>Outstanding</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px' }}>CS704 Placement Project & Practical Viva</td>
                        <td style={{ padding: '8px' }}>4</td>
                        <td style={{ padding: '8px', fontWeight: 700, color: '#15803D' }}>O</td>
                        <td style={{ padding: '8px' }}>Outstanding</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '10px 14px', borderRadius: '6px', fontSize: '0.8rem' }}>
                    <div><strong>Cumulative Grade Point Average (CGPA):</strong> 8.85 / 10.00</div>
                    <div style={{ color: '#15803D', fontWeight: 700 }}>✓ Digitally Verified by Exam Cell</div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              {previewDoc.fileUrl && previewDoc.fileUrl.startsWith('data:') ? (
                <a
                  href={previewDoc.fileUrl}
                  download={previewDoc.fileName}
                  className="btn-secondary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem' }}
                >
                  <ExternalLink size={14} />
                  <span>Download Document</span>
                </a>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => setPreviewDoc(null)}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
