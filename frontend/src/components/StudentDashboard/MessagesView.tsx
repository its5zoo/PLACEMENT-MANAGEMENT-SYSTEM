import React, { useState } from 'react';
import { Send } from 'lucide-react';

export const MessagesView: React.FC = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'TNP Officer', text: 'Hi Faizaan, please ensure your transcript document is uploaded before Microsoft drive tomorrow.', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'You', text: 'Thank you Sir! I have uploaded it under the documents section.', time: '10:35 AM', isMe: true },
    { id: 3, sender: 'TNP Officer', text: "Great! All the best for tomorrow's technical interview round.", time: '10:38 AM', isMe: false }
  ]);

  const handleSend = () => {
    if (!text.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: text, time: 'Just now', isMe: true }]);
    setText('');
  };

  return (
    <div className="view-container">
      <div className="section-card" style={{ padding: 0, overflow: 'hidden', display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '480px' }}>
        {/* Left contacts */}
        <div style={{ borderRight: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', padding: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#111827' }}>Inbox & Noticeboard</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div 
              onClick={() => setActiveChat(1)}
              style={{ padding: '10px', borderRadius: '8px', backgroundColor: activeChat === 1 ? '#F1F5F9' : 'transparent', border: activeChat === 1 ? '1px solid #E2E8F0' : 'none', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>TNP Placement Cell</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>All the best for tomorrow...</div>
            </div>
            <div 
              onClick={() => setActiveChat(2)}
              style={{ padding: '10px', borderRadius: '8px', backgroundColor: activeChat === 2 ? '#F1F5F9' : 'transparent', cursor: 'pointer' }}
            >
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#111827' }}>Google Coordinator</div>
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Shortlist uploaded</div>
            </div>
          </div>
        </div>

        {/* Right chat window */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', fontWeight: 700, color: '#111827' }}>
            TNP Placement Cell Officer
          </div>
          <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  backgroundColor: m.isMe ? '#2563EB' : '#F1F5F9',
                  border: m.isMe ? 'none' : '1px solid #E2E8F0',
                  color: m.isMe ? '#FFFFFF' : '#111827',
                  fontSize: '0.88rem'
                }}>
                  <div>{m.text}</div>
                  <div style={{ fontSize: '0.7rem', color: m.isMe ? '#E2E8F0' : '#94A3B8', textAlign: 'right', marginTop: '4px' }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{ flex: 1, padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', outline: 'none' }}
            />
            <button className="btn-primary" onClick={handleSend}>
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
