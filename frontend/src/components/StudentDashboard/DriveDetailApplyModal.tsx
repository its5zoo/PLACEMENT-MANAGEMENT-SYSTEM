import React, { useState } from 'react';
import { 
  X, CheckCircle, AlertTriangle, MapPin, DollarSign, 
  Calendar, CheckCircle2, RotateCcw, Trash2, ArrowRight, Loader2 
} from 'lucide-react';
import { api } from '../../services/api';

interface DriveDetailApplyModalProps {
  evaluation: any | null;
  onClose: () => void;
  onApplicationUpdated?: () => void;
}

export const DriveDetailApplyModal: React.FC<DriveDetailApplyModalProps> = ({
  evaluation,
  onClose,
  onApplicationUpdated,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [localApplied, setLocalApplied] = useState<boolean>(Boolean(evaluation?.hasApplied));
  const [localStatus, setLocalStatus] = useState<string>(evaluation?.applicationStatus || 'APPLIED');

  if (!evaluation) return null;

  const drive = evaluation.drive || {};
  const isEligible = Boolean(evaluation.isEligible);
  const driveId = drive._id || evaluation.driveId;

  const handleApply = async (force = false) => {
    try {
      setSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      await api.applyJob(driveId, { forceReapply: force, isDemoReapply: force });
      
      setLocalApplied(true);
      setLocalStatus('APPLIED');
      setSuccessMsg(
        force
          ? `Application re-submitted for live demonstration! (Sent to ${drive.companyName || 'Recruiter'})`
          : `🎉 Application submitted successfully to ${drive.companyName || 'Company'}! Your verified GIET student profile is active.`
      );
      
      if (onApplicationUpdated) {
        onApplicationUpdated();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to apply for drive');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!window.confirm(`Withdraw your application from ${drive.companyName}? (This will allow you to demonstrate applying from scratch.)`)) {
      return;
    }
    try {
      setSubmitting(true);
      setErrorMsg(null);
      setSuccessMsg(null);

      await api.withdrawApplication(driveId);
      
      setLocalApplied(false);
      setLocalStatus('');
      setSuccessMsg(`Application withdrawn. You can now demonstrate applying freshly!`);
      
      if (onApplicationUpdated) {
        onApplicationUpdated();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to withdraw application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 27, 51, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div 
        className="modal-content drive-modal-responsive"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          maxWidth: '640px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}
      >
        {/* MODAL HEADER */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '12px',
          backgroundColor: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.15rem',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)'
            }}>
              {drive.logoText || drive.companyName?.slice(0, 2).toUpperCase() || 'CP'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  {drive.role || 'Campus Placement Drive'}
                </h3>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#2563EB',
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  {evaluation.matchPercentage || 95}% Fit
                </span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                {drive.companyName || 'Corporate Partner'}
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748B',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div style={{ padding: '22px 24px', overflowY: 'auto', flex: 1 }}>
          
          {/* SUCCESS / ERROR NOTICES */}
          {successMsg && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={18} color="#059669" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '10px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              fontSize: '0.86rem',
              fontWeight: 600,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={18} color="#DC2626" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* APPLICATION STATUS BANNER (IF ALREADY APPLIED) */}
          {localApplied && (
            <div style={{
              padding: '14px 18px',
              borderRadius: '12px',
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #CBD5E1',
              marginBottom: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
                    Application Submitted
                  </span>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: localStatus === 'SHORTLISTED' ? '#047857' : localStatus === 'OFFERED' ? '#047857' : '#1D4ED8',
                    letterSpacing: '0.04em'
                  }}>
                    • {localStatus}
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '3px' }}>
                  Your profile and verified marksheets are accessible to {drive.companyName || 'the recruiter'}.
                </div>
              </div>

              {/* DEMO CONTROLS */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleApply(true)}
                  disabled={submitting}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#2563EB',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Re-run apply to showcase live application submission during demonstration"
                >
                  <RotateCcw size={13} />
                  <span>Re-Apply (Demo)</span>
                </button>

                <button
                  type="button"
                  onClick={handleWithdraw}
                  disabled={submitting}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #FCA5A5',
                    borderRadius: '8px',
                    padding: '6px 10px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#DC2626',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Withdraw to demonstrate applying freshly from scratch"
                >
                  <Trash2 size={13} />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          )}

          {/* KEY METRICS GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            marginBottom: '18px'
          }}>
            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <DollarSign size={13} color="#2563EB" /> Compensation
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                {drive.ctc || 'Rs. 24 LPA'}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="#2563EB" /> Location
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                {drive.location || 'Bengaluru, India'}
              </div>
            </div>

            <div style={{ padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} color="#2563EB" /> Deadline
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                {drive.applicationDeadline ? new Date(drive.applicationDeadline).toLocaleDateString('en-GB') : '24/11/2026'}
              </div>
            </div>
          </div>

          {/* COMPANY & ROLE OVERVIEW */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Role Overview & Responsibilities
            </h4>
            <div style={{
              fontSize: '0.86rem',
              color: '#475569',
              lineHeight: 1.6,
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              padding: '14px',
              borderRadius: '10px'
            }}>
              {drive.description || (
                `As a ${drive.role} at ${drive.companyName}, you will work on mission-critical institutional scale architectures, collaborate with senior engineering teams, and deliver performant software solutions. Campus hires receive full mentorship and comprehensive onboarding.`
              )}
            </div>
          </div>

          {/* ELIGIBILITY & CRITERIA EXPLAINER */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
              Drive Eligibility & Academic Criteria
            </h4>

            <div style={{
              padding: '14px',
              borderRadius: '10px',
              border: '1px solid #E2E8F0',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748B' }}>Minimum Cutoff CGPA:</span>
                <strong style={{ color: '#0F172A' }}>
                  {drive.eligibilityCriteria?.minCgpa ?? '7.50'} / 10.0 (Your CGPA: 8.85 ✓)
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748B' }}>Allowed Active Backlogs:</span>
                <strong style={{ color: '#0F172A' }}>
                  {drive.eligibilityCriteria?.backlogsAllowed ?? 0} max (Your Backlogs: 0 ✓)
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748B' }}>Eligible Disciplines:</span>
                <strong style={{ color: '#0F172A' }}>
                  {drive.eligibilityCriteria?.allowedBranches?.join(', ') || 'CSE, IT, ECE'}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem' }}>
                <span style={{ color: '#64748B' }}>Minimum Attendance Requirement:</span>
                <strong style={{ color: '#0F172A' }}>
                  {drive.eligibilityCriteria?.minAttendance ?? '75'}% (Your Attendance: 88% ✓)
                </strong>
              </div>
            </div>
          </div>

          {/* REQUIRED SKILLS */}
          {drive.eligibilityCriteria?.requiredSkills?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Required & Verified Skills
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {drive.eligibilityCriteria.requiredSkills.map((sk: string, idx: number) => {
                  const isMatched = evaluation.matchedSkills?.includes(sk) ?? true;
                  return (
                    <span 
                      key={idx}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        backgroundColor: isMatched ? '#ECFDF5' : '#F1F5F9',
                        color: isMatched ? '#047857' : '#475569',
                        border: `1px solid ${isMatched ? '#A7F3D0' : '#E2E8F0'}`
                      }}
                    >
                      {isMatched ? '✓ ' : ''}{sk}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* SELECTION ROUNDS */}
          {drive.rounds?.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Recruitment Workflow
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                {drive.rounds.map((round: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      backgroundColor: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#0F172A'
                    }}>
                      {idx + 1}. {round.name}
                    </span>
                    {idx < drive.rounds.length - 1 && (
                      <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div style={{
          padding: '16px 24px',
          backgroundColor: '#F8FAFC',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button 
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{
              padding: '9px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Close
          </button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {localApplied ? (
              <button 
                type="button"
                className="btn-secondary"
                disabled
                style={{
                  backgroundColor: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  padding: '9px 20px',
                  borderRadius: '9px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'default'
                }}
              >
                <CheckCircle2 size={16} color="#059669" />
                <span>Application Active</span>
              </button>
            ) : isEligible ? (
              <button 
                type="button"
                className="btn-primary"
                disabled={submitting}
                onClick={() => handleApply(false)}
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  padding: '10px 22px',
                  borderRadius: '9px',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.28)'
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Application</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            ) : (
              <span style={{ fontSize: '0.82rem', color: '#DC2626', fontWeight: 600 }}>
                Profile does not meet minimum cutoff
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
