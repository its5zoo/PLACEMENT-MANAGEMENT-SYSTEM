import React, { useState, useEffect } from 'react';
import { History, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const TnpAuditView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudit();
  }, []);

  const loadAudit = async () => {
    try {
      setLoading(true);
      const res = await api.getAuditLogs();
      if (res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Error loading audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={22} color="#2563EB" />
            Immutable Institutional Audit Logs
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
            Permanent compliance trail of drive approvals, academic overrides, shortlist modifications, and offer releases.
          </p>
        </div>
      </div>

      <div className="section-card" style={{ padding: '0', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', color: '#64748B' }}>
            <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
            <span>Fetching immutable audit ledger...</span>
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
            No audit records logged yet.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '14px 20px' }}>Timestamp</th>
                  <th style={{ padding: '14px 20px' }}>Actor & Role</th>
                  <th style={{ padding: '14px 20px' }}>Operation / Action</th>
                  <th style={{ padding: '14px 20px' }}>Target Entity</th>
                  <th style={{ padding: '14px 20px' }}>Recorded Reason / Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {new Date(log.createdAt).toLocaleString('en-GB')}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: '#111827' }}>{log.actorName || 'System'}</div>
                      <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600 }}>{log.actorRole}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                        backgroundColor: '#F1F5F9', border: '1px solid #E2E8F0', color: '#111827',
                      }}>
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', fontWeight: 600 }}>
                      {log.entityType} ({log.entityId ? log.entityId.slice(-6) : ''})
                    </td>
                    <td style={{ padding: '16px 20px', color: '#475569', maxWidth: '300px' }}>
                      {log.reason || 'Standard operational event'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
