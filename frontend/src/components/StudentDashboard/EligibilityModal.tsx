import React from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Award } from 'lucide-react';

interface EligibilityModalProps {
  evaluation: any | null;
  onClose: () => void;
  onApply?: () => void;
  canApply?: boolean;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  evaluation,
  onClose,
  onApply,
  canApply,
}) => {
  if (!evaluation) return null;

  const isEligible = evaluation.isEligible;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
    }}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={22} color="#2563eb" />
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
              Explainable Eligibility Evaluation
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Status Verdict Header */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: isEligible ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${isEligible ? '#bbf7d0' : '#fecaca'}`,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            {isEligible ? (
              <CheckCircle size={28} color="#16a34a" />
            ) : (
              <XCircle size={28} color="#dc2626" />
            )}
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: isEligible ? '#15803d' : '#b91c1c' }}>
                {isEligible ? 'Eligible to Apply' : 'Not Eligible for this Drive'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '2px' }}>
                {evaluation.summary}
              </div>
            </div>
          </div>

          {/* Match Score Meter */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
              <span style={{ color: '#475569' }}>Overall Profile Match</span>
              <span style={{ color: '#2563eb' }}>{evaluation.matchPercentage}% Fit</span>
            </div>
            <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${evaluation.matchPercentage}%`,
                backgroundColor: isEligible ? '#16a34a' : '#f59e0b',
                transition: 'width 0.3s ease',
              }} />
            </div>
          </div>

          {/* Failed Checks (if any) */}
          {evaluation.failedChecks && evaluation.failedChecks.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#dc2626', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={16} />
                Requirements Not Met ({evaluation.failedChecks.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {evaluation.failedChecks.map((f: string, i: number) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: '#fff1f2',
                    fontSize: '0.85rem',
                    color: '#991b1b',
                    borderLeft: '3px solid #dc2626',
                  }}>
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills / Extras */}
          {evaluation.missingRequirements && evaluation.missingRequirements.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#d97706', marginBottom: '8px' }}>
                Skill Gaps / Missing Items
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {evaluation.missingRequirements.map((m: string, i: number) => (
                  <span key={i} style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 600,
                  }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Passed Checks */}
          {evaluation.passedChecks && evaluation.passedChecks.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={16} />
                Passed Academic Criteria ({evaluation.passedChecks.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {evaluation.passedChecks.map((p: string, i: number) => (
                  <div key={i} style={{
                    fontSize: '0.82rem',
                    color: '#166534',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}>
                    <span>✓</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: '16px 24px',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          borderRadius: '0 0 16px 16px',
        }}>
          <button 
            className="btn-primary"
            onClick={onClose}
            style={{ backgroundColor: '#e2e8f0', color: '#334155' }}
          >
            Close
          </button>
          {isEligible && canApply && onApply && (
            <button 
              className="btn-primary"
              onClick={() => {
                onClose();
                onApply();
              }}
              style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
