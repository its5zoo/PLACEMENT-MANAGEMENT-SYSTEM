import React, { useState, useEffect } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const TnpCasesView: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [status, setStatus] = useState('RESOLVED');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const res = await api.getPlacementCases();
      if (res.data) {
        setCases(res.data);
      }
    } catch (err) {
      console.error('Error loading cases:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updatePlacementCase(selectedCase._id, {
        status,
        resolutionNotes,
      });
      alert('Placement issue case updated successfully!');
      setSelectedCase(null);
      await loadCases();
    } catch (err: any) {
      alert(err.message || 'Failed to update case');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="view-container">
      <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={22} color="#2563eb" />
            Placement Cases & Issue Management
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
            Formal case tracker for document discrepancies, medical attendance waivers, and offer lock appeals.
          </p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Fetching institutional support tickets...</span>
          </div>
        ) : cases.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No active placement cases reported.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Case Number</th>
                  <th style={{ padding: '14px 20px' }}>Student Roll & Name</th>
                  <th style={{ padding: '14px 20px' }}>Subject & Category</th>
                  <th style={{ padding: '14px 20px' }}>Priority</th>
                  <th style={{ padding: '14px 20px' }}>Status</th>
                  <th style={{ padding: '14px 20px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c: any) => (
                  <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 20px', fontWeight: 800, color: '#2563eb' }}>{c.caseNumber}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{c.studentName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{c.studentRoll}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.subject}</div>
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.category}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                        backgroundColor: c.priority === 'HIGH' || c.priority === 'URGENT' ? '#fee2e2' : '#f1f5f9',
                        color: c.priority === 'HIGH' || c.priority === 'URGENT' ? '#dc2626' : '#475569',
                      }}>
                        {c.priority}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                        backgroundColor: c.status === 'RESOLVED' || c.status === 'CLOSED' ? '#dcfce7' : '#fef3c7',
                        color: c.status === 'RESOLVED' || c.status === 'CLOSED' ? '#15803d' : '#b45309',
                      }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <button
                        className="btn-primary"
                        onClick={() => {
                          setSelectedCase(c);
                          setStatus(c.status);
                          setResolutionNotes(c.resolutionNotes || '');
                        }}
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Resolution Modal */}
      {selectedCase && (
        <div className="modal-backdrop" onClick={() => setSelectedCase(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '520px', width: '100%', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800 }}>
              Resolve Placement Case ({selectedCase.caseNumber})
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Student: {selectedCase.studentName} ({selectedCase.studentRoll})
            </p>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <strong>Issue Description:</strong> {selectedCase.description}
            </div>

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Update Case Status
                </label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                  <option value="WAITING_FOR_STUDENT">WAITING_FOR_STUDENT</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Resolution Summary / Notes
                </label>
                <textarea 
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record administrative decision, exemption approval or student action required..."
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setSelectedCase(null)} className="btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Updating...' : 'Save Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
