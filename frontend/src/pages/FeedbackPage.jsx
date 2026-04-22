import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMyComplaints, submitFeedback } from '../api/api';

const FeedbackPage = () => {
  const [resolvedComplaints, setResolvedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchResolved = async () => {
      try {
        const res = await getMyComplaints({ status: 'Resolved' });
        setResolvedComplaints(res.data.complaints);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResolved();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedComplaint) return setMsg({ type: 'error', text: 'Please select a complaint' });
    if (rating === 0) return setMsg({ type: 'error', text: 'Please provide a rating' });

    setSubmitting(true);
    try {
      await submitFeedback({ complaintId: selectedComplaint, rating, comment });
      setMsg({ type: 'success', text: 'Thank you! Your feedback has been submitted.' });
      // Reset form
      setSelectedComplaint('');
      setRating(0);
      setComment('');
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Failed to submit feedback.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '600px' }}>
            <div style={{ marginBottom: '28px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>⭐</div>
              <h1 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.8rem', color: '#1E1E2E' }}>Rate Our Service</h1>
              <p style={{ margin: 0, color: '#6B7280' }}>Your feedback helps us improve campus maintenance.</p>
            </div>

            {msg.text && (
              <div style={{ background: msg.type === 'success' ? '#D1FAE5' : '#FEE2E2', color: msg.type === 'success' ? '#059669' : '#EF4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', textAlign: 'center' }}>
                {msg.text}
              </div>
            )}

            <div className="card" style={{ padding: '32px' }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}><div className="loading-spinner"></div></div>
              ) : resolvedComplaints.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#6B7280', padding: '20px' }}>
                  <p>You don't have any resolved complaints to review yet.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '8px' }}>
                      Select Resolved Complaint
                    </label>
                    <select className="input-field" value={selectedComplaint} onChange={(e) => setSelectedComplaint(e.target.value)}>
                      <option value="">-- Choose a complaint --</option>
                      {resolvedComplaints.map(c => (
                        <option key={c._id} value={c._id}>{c.complaintId} - {c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '12px', textAlign: 'center' }}>
                      How would you rate the service?
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className="star"
                          style={{ color: (hoverRating || rating) >= star ? '#F59E0B' : '#E5E7EB' }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '8px' }}>
                      Additional Comments (Optional)
                    </label>
                    <textarea
                      className="input-field"
                      placeholder="Tell us about your experience..."
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FeedbackPage;
