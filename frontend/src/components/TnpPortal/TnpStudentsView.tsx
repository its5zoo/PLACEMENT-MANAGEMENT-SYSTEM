import React, { useState, useEffect } from 'react';
import { Search, Edit3, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const TnpStudentsView: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [branch, setBranch] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Edit form state
  const [editCgpa, setEditCgpa] = useState('');
  const [editAttendance, setEditAttendance] = useState('');
  const [editBacklogs, setEditBacklogs] = useState('');
  const [editStatus, setEditStatus] = useState('IN_PROCESS');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStudents();
  }, [branch]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await api.getTnpStudents(branch, search);
      if (res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (student: any) => {
    setSelectedStudent(student);
    const d = student.studentDetails || {};
    setEditCgpa(String(d.cgpa || 8.0));
    setEditAttendance(String(d.attendancePercentage || 85.0));
    setEditBacklogs(String(d.activeBacklogs || 0));
    setEditStatus(d.placementStatus || 'IN_PROCESS');
  };

  const handleSaveAcademics = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateStudentAcademics(selectedStudent._id, {
        cgpa: Number(editCgpa),
        attendancePercentage: Number(editAttendance),
        activeBacklogs: Number(editBacklogs),
        placementStatus: editStatus,
        reason: 'TNP verification override',
      });
      alert('Student institutional academic record successfully updated!');
      setSelectedStudent(null);
      await loadStudents();
    } catch (err: any) {
      alert(err.message || 'Failed to update academic record');
    } finally {
      setSaving(false);
    }
  };

  const filtered = students.filter((s) => {
    const name = (s.name || '').toLowerCase();
    const roll = (s.studentDetails?.rollNumber || s.studentDetails?.rollNo || '').toLowerCase();
    const term = search.toLowerCase();
    return name.includes(term) || roll.includes(term);
  });

  return (
    <div className="view-container">
      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} color="#64748b" />
          <input 
            type="text" 
            placeholder="Search by student name or roll number (e.g. 231CS001)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select 
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: 600, color: '#334155' }}
        >
          <option value="ALL">All Branches</option>
          <option value="CSE">Computer Science (CSE)</option>
          <option value="IT">Information Technology (IT)</option>
          <option value="ECE">Electronics & Communication (ECE)</option>
        </select>
      </div>

      {/* Students Table */}
      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748b' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Loading verified student records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No students found matching your criteria.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Student Roll & Name</th>
                  <th style={{ padding: '14px 20px' }}>Branch</th>
                  <th style={{ padding: '14px 20px' }}>Verified CGPA</th>
                  <th style={{ padding: '14px 20px' }}>Attendance</th>
                  <th style={{ padding: '14px 20px' }}>Active Backlogs</th>
                  <th style={{ padding: '14px 20px' }}>Placement Status</th>
                  <th style={{ padding: '14px 20px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s: any) => {
                  const d = s.studentDetails || {};
                  return (
                    <tr key={s._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600 }}>
                          {d.rollNumber || d.rollNo || '231CS001'}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>{d.branch || 'CSE'}</td>
                      <td style={{ padding: '16px 20px', fontWeight: 700, color: Number(d.cgpa || 0) >= 7.5 ? '#16a34a' : '#d97706' }}>
                        {Number(d.cgpa || 0).toFixed(2)}
                      </td>
                      <td style={{ padding: '16px 20px', color: '#334155' }}>{d.attendancePercentage || 85}%</td>
                      <td style={{ padding: '16px 20px' }}>
                        {Number(d.activeBacklogs || 0) === 0 ? (
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>0 (Clean)</span>
                        ) : (
                          <span style={{ color: '#dc2626', fontWeight: 700 }}>{d.activeBacklogs} Backlogs</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: d.placementStatus === 'PLACED' || d.placementStatus === 'OFFER_ACCEPTED' ? '#dcfce7' : d.placementStatus === 'SELECTED' ? '#dbeafe' : '#f1f5f9',
                          color: d.placementStatus === 'PLACED' || d.placementStatus === 'OFFER_ACCEPTED' ? '#15803d' : d.placementStatus === 'SELECTED' ? '#1e40af' : '#475569',
                        }}>
                          {d.placementStatus || 'UNPLACED'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <button 
                          className="btn-primary"
                          onClick={() => handleOpenEdit(s)}
                          style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Edit3 size={14} />
                          <span>Override</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Override Modal */}
      {selectedStudent && (
        <div className="modal-backdrop" onClick={() => setSelectedStudent(null)} style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px',
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px',
          }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 800 }}>Institutional Academic Override</h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: '#64748b' }}>
              Student: {selectedStudent.name} ({selectedStudent.studentDetails?.rollNumber || '231CS001'})
            </p>

            <form onSubmit={handleSaveAcademics} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Institutional Verified CGPA
                </label>
                <input 
                  type="number" step="0.01" min="0" max="10"
                  value={editCgpa}
                  onChange={(e) => setEditCgpa(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Attendance Percentage (%)
                </label>
                <input 
                  type="number" step="0.1" min="0" max="100"
                  value={editAttendance}
                  onChange={(e) => setEditAttendance(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Active Backlogs Count
                </label>
                <input 
                  type="number" min="0" max="20"
                  value={editBacklogs}
                  onChange={(e) => setEditBacklogs(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  Placement Status
                </label>
                <select 
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                >
                  <option value="UNPLACED">UNPLACED</option>
                  <option value="IN_PROCESS">IN_PROCESS</option>
                  <option value="SELECTED">SELECTED</option>
                  <option value="OFFER_RECEIVED">OFFER_RECEIVED</option>
                  <option value="OFFER_ACCEPTED">OFFER_ACCEPTED</option>
                  <option value="PLACED">PLACED</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedStudent(null)} className="btn-primary" style={{ backgroundColor: '#e2e8f0', color: '#334155' }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? 'Updating...' : 'Save & Log Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
