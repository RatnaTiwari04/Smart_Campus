import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getComplaintById, submitFeedback, getFeedback } from '../api/api';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';
import { useAuth } from '../context/AuthContext';

const ComplaintDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback state
  const [feedback, setFeedback] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, feedRes] = await Promise.all([
        getComplaintById(id),
        getFeedback(id).catch(() => ({ data: [] }))
      ]);
      setComplaint(compRes.data);
      if (feedRes.data && feedRes.data.length > 0) {
        setFeedback(feedRes.data[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load complaint details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);
    try {
      await submitFeedback({ complaintId: id, rating, comment });
      fetchData(); // refresh to show feedback
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-IN', { 
    day: '2-digit', month: 'short', year: 'numeric', 
    hour: '2-digit', minute: '2-digit' 
  });

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );

  if (error || !complaint) return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '32px', textAlign: 'center' }}>
          <div className="card" style={{ padding: '40px' }}>
            <h2 style={{ color: '#EF4444' }}>{error || 'Complaint not found'}</h2>
            <button className="btn-primary" onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>Go Back</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Breadcrumbs */}
          <div style={{ marginBottom: '24px' }}>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 500 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to List
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Main Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div className="card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ color: '#6C63FF', fontWeight: 700, marginBottom: '4px' }}>{complaint.complaintId}</div>
                    <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1E1E2E' }}>{complaint.title}</h1>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', padding: '16px', background: '#F9FAFB', borderRadius: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Category</div>
                    <CategoryBadge category={complaint.category} />
                  </div>
                  <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: '24px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Location</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E1E2E' }}>{complaint.location}</div>
                  </div>
                  <div style={{ borderLeft: '1px solid #E5E7EB', paddingLeft: '24px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px' }}>Submitted On</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1E1E2E' }}>{formatDate(complaint.createdAt)}</div>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1E1E2E', marginBottom: '12px' }}>Description</h3>
                <p style={{ margin: 0, color: '#4B5563', lineHeight: 1.7, fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                  {complaint.description}
                </p>
              </div>

              {/* Feedback Section (Only for Student) */}
              {user.role === 'student' && complaint.status === 'Resolved' && (
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1E1E2E', marginBottom: '20px' }}>Service Feedback</h3>
                  
                  {feedback ? (
                    <div style={{ padding: '20px', background: '#F0FDF4', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                        {[1, 2, 3, 4, 5].map(s => (
                          <span key={s} style={{ fontSize: '1.4rem' }}>{s <= feedback.rating ? '⭐' : '☆'}</span>
                        ))}
                      </div>
                      <p style={{ margin: 0, color: '#166534', fontWeight: 500 }}>{feedback.comment || 'No comment provided.'}</p>
                      <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#166534', opacity: 0.8 }}>
                        Submitted on {formatDate(feedback.createdAt)}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit}>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Rate the resolution</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {[1, 2, 3, 4, 5].map(s => (
                            <button 
                              key={s} 
                              type="button" 
                              onClick={() => setRating(s)}
                              style={{ 
                                background: 'none', border: 'none', cursor: 'pointer', 
                                fontSize: '2rem', transition: 'transform 0.1s' 
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                              {s <= rating ? '⭐' : '☆'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '8px' }}>Comments (Optional)</label>
                        <textarea 
                          className="input-field" 
                          rows="3" 
                          placeholder="Tell us about your experience..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>
                      <button type="submit" className="btn-primary" disabled={feedbackLoading}>
                        {feedbackLoading ? 'Submitting...' : 'Submit Feedback'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* User Info */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E1E2E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/></svg>
                  Student Details
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EEF0FF', color: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {complaint.createdBy?.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E1E2E' }}>{complaint.createdBy?.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{complaint.createdBy?.rollNumber}</div>
                  </div>
                </div>
              </div>

              {/* Assignment Info */}
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E1E2E', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
                  Assigned Technician
                </h3>
                {complaint.assignedTo ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F0FDF4', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      {complaint.assignedTo.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E1E2E' }}>{complaint.assignedTo.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>{complaint.assignedTo.employeeId}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px', background: '#F9FAFB', borderRadius: '12px', color: '#9CA3AF', fontSize: '0.9rem', fontStyle: 'italic' }}>
                    Not assigned yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ComplaintDetailsPage;
