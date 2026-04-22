import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { createComplaint } from '../api/api';
import { categoryConfig } from '../components/CategoryBadge';

const categories = ['WiFi', 'Electricity', 'Plumbing', 'Furniture', 'Water Leakage', 'Other'];

const RaiseComplaintPage = () => {
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) return setError('Please select a category');
    setError('');
    setLoading(true);
    try {
      const res = await createComplaint(form);
      setSuccess(`Complaint ${res.data.complaintId} submitted successfully!`);
      setTimeout(() => navigate('/track-complaints'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '620px' }}>
            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
              <h1 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.8rem', color: '#1E1E2E' }}>Raise a Complaint</h1>
              <p style={{ margin: 0, color: '#6B7280' }}>Fill in the details below to report a maintenance issue.</p>
            </div>

            {error && (
              <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem' }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ background: '#D1FAE5', color: '#059669', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                ✅ {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="card" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
                {/* Complaint Title */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '8px' }}>
                    Complaint Title
                  </label>
                  <input type="text" className="input-field" placeholder="Brief title of the issue"
                    value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>

                {/* Category Selection */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '10px' }}>
                    Complaint Category
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {categories.map((cat) => {
                      const cfg = categoryConfig[cat] || {};
                      return (
                        <button
                          key={cat}
                          type="button"
                          className={`category-pill ${form.category === cat ? 'selected' : ''}`}
                          onClick={() => setForm({ ...form, category: cat })}
                          style={form.category === cat ? { borderColor: cfg.color, color: cfg.color, background: cfg.bg } : {}}
                        >
                          {cfg.icon} {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '8px' }}>
                    📍 Location (Block / Room Number)
                  </label>
                  <input type="text" className="input-field" placeholder="e.g. Block A, Room 201 or Lab 302"
                    value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '8px' }}>
                    📄 Description of Issue
                  </label>
                  <textarea
                    className="input-field"
                    placeholder="Describe the issue in detail..."
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {/* Submit */}
                <button type="submit" className="btn-primary" disabled={loading}
                  style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', opacity: loading ? 0.7 : 1 }}>
                  {loading ? '⏳ Submitting...' : '📋 Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RaiseComplaintPage;
