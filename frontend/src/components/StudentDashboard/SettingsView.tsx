import React from 'react';
import { Save } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="view-container">
      <div className="section-card" style={{ maxWidth: '600px' }}>
        <h3 className="card-title" style={{ marginBottom: '20px' }}>Account Settings</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Settings saved!'); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Email Notifications</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
                <option>All drive updates & interview alerts</option>
                <option>Only interview shortlists</option>
                <option>Mute email notifications</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Phone Number (WhatsApp Alerts)</label>
              <input type="text" defaultValue="+91 98765 43210" style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: '#475569' }}>Profile Visibility</label>
              <select style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
                <option>Visible to all registered campus recruiters</option>
                <option>Only shortlisting companies</option>
              </select>
            </div>
            <button className="btn-primary" type="submit" style={{ marginTop: '10px' }}>
              <Save size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
