import React, { useState, useEffect } from 'react';
import { Target, AlertCircle, Loader2, MapPin, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { EligibilityModal } from './EligibilityModal';
import { DriveDetailApplyModal } from './DriveDetailApplyModal';

export const RecommendationsView: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<any | null>(null);
  const [selectedDriveModal, setSelectedDriveModal] = useState<any | null>(null);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const [recsRes, myAppsRes] = await Promise.all([
        api.getRecommendations(),
        api.getMyApplications().catch(() => ({ data: [] }))
      ]);

      const map: Record<string, string> = {};
      if (myAppsRes?.data) {
        myAppsRes.data.forEach((app: any) => {
          const dId = app.drive?._id || app.drive || app.job?._id || app.job;
          if (dId) {
            map[dId.toString()] = app.status || 'APPLIED';
          }
        });
      }

      if (recsRes?.data) {
        const enrichWithMap = (item: any) => {
          const dId = (item.drive?._id || item.driveId)?.toString();
          const status = map[dId] || item.applicationStatus;
          return {
            ...item,
            hasApplied: Boolean(status) || item.hasApplied,
            applicationStatus: status || item.applicationStatus,
          };
        };

        const enrichedData = {
          ...recsRes.data,
          recommended: (recsRes.data.recommended || []).map(enrichWithMap),
          nearMatch: (recsRes.data.nearMatch || []).map(enrichWithMap),
          eligible: (recsRes.data.eligible || []).map(enrichWithMap),
        };
        setData(enrichedData);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
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
      <div className="section-card responsive-banner" style={{
        padding: '22px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Target size={18} color="#2563EB" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#111827' }}>
              Smart Placement Match Engine
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748B', maxWidth: '620px' }}>
            Tailored drive recommendations based on your verified CGPA (8.85), CSE discipline, attendance (88%), and verified skill matrix.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '85px' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>{recommended.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Top Matches</div>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 16px', borderRadius: '8px', textAlign: 'center', minWidth: '85px' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#111827' }}>{nearMatch.length}</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Near Matches</div>
          </div>
        </div>
      </div>

      {/* 1. TOP RECOMMENDED DRIVES */}
      {recommended.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <div className="card-header" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <Target size={16} color="#2563EB" />
              <span>High-Fit Placement Drives</span>
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{recommended.length} Opportunities Available</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {recommended.map((item: any) => {
              const drive = item.drive;
              const hasApplied = Boolean(item.hasApplied);
              const appStatus = item.applicationStatus || 'APPLIED';

              return (
                <div key={item.driveId} className="section-card" style={{ padding: '18px 20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '12px',
                        backgroundColor: '#0F172A', color: '#FFFFFF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1rem', flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.15)'
                      }}>
                        {drive.logoText || drive.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#111827' }}>
                            {drive.role}
                          </h4>
                          <span style={{
                            backgroundColor: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE',
                            fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700,
                          }}>
                            {item.matchPercentage}% Match
                          </span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                          {drive.companyName}
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      {hasApplied && (
                        <span style={{
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          color: '#047857',
                          backgroundColor: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <CheckCircle2 size={13} color="#059669" />
                          <span>Applied ({appStatus})</span>
                        </span>
                      )}

                      <button 
                        type="button"
                        className="btn-secondary"
                        onClick={() => setSelectedEvaluation(item)}
                        style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                      >
                        Explain Eligibility
                      </button>

                      <button 
                        type="button"
                        className="btn-primary"
                        onClick={() => setSelectedDriveModal(item)}
                        style={{ 
                          fontSize: '0.82rem', 
                          padding: '7px 14px',
                          backgroundColor: hasApplied ? '#0F172A' : '#2563EB',
                          color: '#FFFFFF',
                          borderColor: hasApplied ? '#0F172A' : '#2563EB',
                          boxShadow: hasApplied ? 'none' : '0 3px 8px rgba(37, 99, 235, 0.25)'
                        }}
                      >
                        {hasApplied ? 'View Details' : 'View Details & Apply'}
                      </button>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    margin: '12px 0',
                    fontSize: '0.82rem',
                    color: '#475569',
                  }}>
                    <strong style={{ color: '#111827' }}>Why Recommended:</strong> {item.recommendationReason}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: '#64748B', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#2563EB" /> {drive.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <DollarSign size={14} color="#059669" /> {drive.ctc}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> Deadline: {drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB') : '24/11/2026'}
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
        <div style={{ marginTop: '20px' }}>
          <div className="card-header" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <AlertCircle size={16} color="#D97706" />
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
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '12px',
                        backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1rem', color: '#111827', flexShrink: 0
                      }}>
                        {drive.logoText || drive.companyName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#111827' }}>{drive.role}</h4>
                          <span style={{
                            backgroundColor: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A',
                            fontSize: '0.72rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700,
                          }}>
                            {item.matchPercentage}% Near Match
                          </span>
                        </div>
                        <div style={{ fontSize: '0.84rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>{drive.companyName}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        type="button"
                        className="btn-secondary"
                        onClick={() => setSelectedEvaluation(item)}
                        style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                      >
                        Why Can't I Apply?
                      </button>

                      <button 
                        type="button"
                        className="btn-secondary"
                        onClick={() => setSelectedDriveModal(item)}
                        style={{ fontSize: '0.82rem', padding: '7px 12px' }}
                      >
                        View Drive Details
                      </button>
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    margin: '12px 0',
                    fontSize: '0.82rem',
                    color: '#475569',
                  }}>
                    <strong style={{ color: '#111827' }}>Requirement Gap:</strong> {item.nearMatchReason}
                  </div>

                  <div style={{ display: 'flex', gap: '20px', fontSize: '0.82rem', color: '#64748B', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#2563EB" /> {drive.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <DollarSign size={14} color="#059669" /> {drive.ctc}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Reusable Explainability Modal */}
      {selectedEvaluation && (
        <EligibilityModal 
          evaluation={selectedEvaluation}
          onClose={() => setSelectedEvaluation(null)}
          canApply={selectedEvaluation?.isEligible && !selectedEvaluation?.hasApplied}
          onApply={() => {
            setSelectedDriveModal(selectedEvaluation);
            setSelectedEvaluation(null);
          }}
        />
      )}

      {/* 4. Full Company Details & Live Application Modal */}
      {selectedDriveModal && (
        <DriveDetailApplyModal 
          evaluation={selectedDriveModal}
          onClose={() => setSelectedDriveModal(null)}
          onApplicationUpdated={() => {
            loadRecommendations();
          }}
        />
      )}
    </div>
  );
};
