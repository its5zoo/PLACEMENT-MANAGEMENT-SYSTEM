import React, { useState, useEffect } from 'react';
import { Gift, CheckCircle, XCircle, DollarSign, Calendar, MapPin, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const OffersView: React.FC = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const res = await api.getMyOffers();
      if (res.data) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (offerId: string, action: 'ACCEPT' | 'DECLINE') => {
    const confirmMsg = action === 'ACCEPT' 
      ? 'Are you sure you want to ACCEPT this placement offer? Institutional policy will lock your final acceptance.'
      : 'Are you sure you want to DECLINE this offer?';
    if (!window.confirm(confirmMsg)) return;

    try {
      setActionInProgress(offerId);
      await api.respondToOffer(offerId, action);
      alert(action === 'ACCEPT' ? '🎉 Congratulations! You have accepted the campus placement offer!' : 'Offer response recorded.');
      await loadOffers();
    } catch (err: any) {
      alert(err.message || 'Failed to update offer');
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: '#64748B' }}>
        <Loader2 size={24} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} />
        <span>Fetching placement offers...</span>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="section-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Gift size={22} color="#0F1B33" />
            Campus Placement Offers
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>
            Official offers released by recruiting companies verified through the Training & Placement Cell.
          </p>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="section-card" style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
          <Gift size={36} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '1.1rem', color: '#111827', margin: '0 0 6px 0' }}>No Formal Offers Released Yet</h3>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            Once you clear final rounds with recruiting companies, formal offer letters with compensation breakdown will appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {offers.map((offer: any) => {
            const isAccepted = offer.status === 'ACCEPTED';
            const isDeclined = offer.status === 'DECLINED';
            const isReleased = offer.status === 'RELEASED' || offer.status === 'VIEWED';

            return (
              <div key={offer._id} className="section-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#111827' }}>
                        {offer.role}
                      </h3>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        color: isAccepted ? '#15803D' : isDeclined ? '#DC2626' : '#0F1B33',
                      }}>
                        {offer.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginTop: '4px' }}>
                      {offer.companyName}
                    </div>
                  </div>

                  {isReleased && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => handleRespond(offer._id, 'DECLINE')}
                        disabled={actionInProgress === offer._id}
                        style={{ color: '#DC2626' }}
                      >
                        <XCircle size={16} />
                        <span>Decline Offer</span>
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => handleRespond(offer._id, 'ACCEPT')}
                        disabled={actionInProgress === offer._id}
                      >
                        <CheckCircle size={16} />
                        <span>Accept Offer</span>
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '24px', margin: '20px 0 12px 0', fontSize: '0.9rem', color: '#475569', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#111827' }}>
                    <DollarSign size={16} color="#0F1B33" /> CTC: {offer.ctc}
                  </span>
                  {offer.baseSalary && (
                    <span>Base Pay: <strong>{offer.baseSalary}</strong></span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> {offer.location || 'Bengaluru, India'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={16} /> Joining Date: {offer.joiningDate || 'July 2027'}
                  </span>
                </div>

                {isAccepted && (
                  <div style={{ backgroundColor: '#F1F5F9', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#15803D', marginTop: '12px' }}>
                    ✓ <strong>Accepted by Candidate:</strong> Formal offer accepted on {new Date(offer.responseDate || offer.updatedAt).toLocaleDateString('en-GB')}. Institutional placement records have been verified.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
