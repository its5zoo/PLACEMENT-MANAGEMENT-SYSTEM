import React, { useState, useEffect } from 'react';
import { Target, AlertCircle, Loader2, MapPin, DollarSign, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { EligibilityModal } from './EligibilityModal';

export const RecommendationsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.getRecommendations();
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId: string) => {
    try {
      await api.applyJob(driveId);
      alert('Application submitted successfully!');
      loadRecommendations();
    } catch (err: any) {
      alert(err.message || 'Failed to apply');
    }
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#64748B' }}>
        <Loader2 size={22} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Evaluating student profile against campus drives...</span>
      </div>
    );
  }

  const { recommended = [], nearMatch = [] } = data || {};

  return (
    <div className="view-container">
      {/* Top Banner Card */}
      <div className="section-card" style={{
        padding: '22px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Target size={18} color="#0F1B33" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#111827' }}>
              Smart Placement Match Engine
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B', maxWidth: '620px' }}>
            Tailored drive recommendations based on your verified CGPA (8.85), CSE discipline, attendance (88%), and verified skill matrix.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>{recommended.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Top Matches</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>{nearMatch.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Near Matches</div>
          </div>
        </div>
      </div>

      {/* 1. TOP RECOMMENDED DRIVES */}
      {recommended.length > 0 && (
        <div>
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} color="#0F1B33" />
              <span>High-Fit Placement Drives</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{recommended.length} Opportunities Available</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommended.map((item: any) => {
              const drive = item.drive;
              return (
                <div key={item.driveId} className="section-card" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '10px',
                        backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1rem', color: '#111827',
                      }}>
                        {drive.logoText || drive.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{drive.role}</h4>
                          <span style={{
                            backgroundColor: '#F8FAFC', color: '#111827', border: '1px solid #E2E8F0',
                            fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700,
                          }}>
                            {item.matchPercentage}% Match
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{drive.companyName}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => setSelectedEvaluation(item)}
                        style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                      >
                        Explain Eligibility
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => handleApply(drive._id)}
                        style={{ fontSize: '0.82rem', padding: '7px 14px' }}
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    margin: '12px 0',
                    fontSize: '0.82rem',
                    color: '#475569',
                  }}>
                    <strong style={{ color: '#111827' }}>Why Recommended:</strong> {item.recommendationReason}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: '#64748B', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} /> {drive.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <DollarSign size={14} /> {drive.ctc}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> Deadline: {new Date(drive.applicationDeadline).toLocaleDateString('en-GB')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. NEAR-MATCH DRIVES */}
      {nearMatch.length > 0 && (
        <div style={{ marginTop: '8px' }}>
          <div className="card-header" style={{ marginBottom: '14px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#0F1B33" />
              <span>Near-Match Opportunities</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Requirements Needed</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {nearMatch.map((item: any) => {
              const drive = item.drive;
              return (
                <div key={item.driveId} className="section-card" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '10px',
                        backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1rem', color: '#111827',
                      }}>
                        {drive.logoText || drive.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{drive.role}</h4>
                          <span style={{
                            backgroundColor: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0',
                            fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700,
                          }}>
                            {item.matchPercentage}% Near Match
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{drive.companyName}</div>
                      </div>
                    </div>

                    <button 
                      className="btn-secondary"
                      onClick={() => setSelectedEvaluation(item)}
                      style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                    >
                      Why Can't I Apply?
                    </button>
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    margin: '12px 0',
                    fontSize: '0.82rem',
                    color: '#475569',
                  }}>
                    <strong style={{ color: '#111827' }}>Requirement Gap:</strong> {item.nearMatchReason}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: '#64748B', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} /> {drive.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <DollarSign size={14} /> {drive.ctc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reusable Explainability Modal */}
      <EligibilityModal 
        evaluation={selectedEvaluation}
        onClose={() => setSelectedEvaluation(null)}
        canApply={selectedEvaluation?.isEligible}
        onApply={() => selectedEvaluation?.driveId && handleApply(selectedEvaluation.driveId)}
      />
    </div>
  );
};
