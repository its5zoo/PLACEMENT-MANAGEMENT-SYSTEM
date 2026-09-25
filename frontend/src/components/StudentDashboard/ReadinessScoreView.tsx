import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, TrendingUp, AlertCircle, Loader2, BookOpen, User, FileText, CheckSquare, Code, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const ReadinessScoreView: React.FC = () => {
  const [readiness, setReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReadiness();
  }, []);

  const loadReadiness = async () => {
    try {
      setLoading(true);
      const res = await api.getReadinessScore();
      if (res.data) {
        setReadiness(res.data);
      }
    } catch (err) {
      console.error('Error fetching readiness score:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#64748b' }}>
        <Loader2 size={22} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Calculating multi-factor placement readiness...</span>
      </div>
    );
  }

  const { totalScore = 88, rating = 'Placement Ready', breakdown = [], nextActions = [] } = readiness || {};

  const getPillarIcon = (idx: number) => {
    switch (idx) {
      case 0: return BookOpen;
      case 1: return User;
      case 2: return FileText;
      case 3: return ShieldCheck;
      case 4: return Code;
      default: return CheckSquare;
    }
  };

  return (
    <div className="view-container">
      {/* Hero Score Diagnostic Card */}
      <div className="section-card" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 28px',
        flexWrap: 'wrap',
        gap: '20px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Award size={18} color="#2563eb" />
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#2563eb', fontWeight: 700 }}>
              Institutional Placement Diagnostic
            </span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 8px 0', color: '#0f172a' }}>
            Placement Readiness Index
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.86rem', maxWidth: '580px' }}>
            Evaluated by the TNP Verification Engine based on institutional records, verified marksheets, academic consistency, and drive criteria.
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.84rem', fontWeight: 600, color: '#15803d' }}>
            Institutional Evaluation: {rating}
          </div>
        </div>

        {/* Score Dial */}
        <div style={{
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          border: '6px solid #2563eb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
        }}>
          <span style={{ fontSize: '1.9rem', fontWeight: 800, lineHeight: 1, color: '#0f172a' }}>{totalScore}</span>
          <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>out of 100</span>
        </div>
      </div>

      {/* Grid: 6 Pillars (Left) & Actionable Checklist (Right) */}
      <div className="dashboard-grid">
        {/* Left Column: 6 Readiness Pillars */}
        <div className="section-card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} color="#2563eb" />
              <span>6-Pillar Evaluation Breakdown</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Diagnostic Criteria</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {breakdown.map((p: any, idx: number) => {
              const Icon = getPillarIcon(idx);
              const percentage = Math.round((p.score / p.max) * 100);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: '#475569' }}><Icon size={15} /></div>
                      <span style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>{p.label}</span>
                    </div>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                      {p.score} / {p.max} pts
                    </span>
                  </div>

                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: '#2563eb',
                      }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: "What Should I Do Next?" Action Engine */}
        <div className="section-card">
          <div className="card-header">
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#2563eb" />
              <span>Recommended Next Steps</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Action Plan</span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 0, marginBottom: '14px' }}>
            Targeted actions to increase your institutional readiness score and maximize shortlisting conversion.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {nextActions.length === 0 ? (
              <div style={{
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
                color: '#15803d',
              }}>
                <CheckCircle size={22} style={{ margin: '0 auto 6px auto' }} />
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>Profile Verified & Ready</div>
                <div style={{ fontSize: '0.78rem', marginTop: '2px', color: '#64748b' }}>
                  All key institutional documents, verified CGPA, and technical credentials are fully up-to-date.
                </div>
              </div>
            ) : (
              nextActions.map((action: any, i: number) => (
                <div key={i} style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{action.title}</div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Priority: {action.priority}</span>
                  </div>
                  <span style={{
                    backgroundColor: '#ecfdf5',
                    color: '#15803d',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #bbf7d0',
                  }}>
                    {action.gain}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
