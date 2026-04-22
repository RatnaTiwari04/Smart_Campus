import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF', display: 'flex', flexDirection: 'column' }}>
      {/* Back to Home */}
      <div style={{ padding: '20px 32px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Home
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: '420px', padding: '40px 36px' }}>
          {/* Icon */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '60px', height: '60px', background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)',
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
              </svg>
            </div>
            <h1 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.6rem', color: '#1E1E2E' }}>Welcome Back</h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Sign in to your campus account</p>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '12px 14px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '6px' }}>
                Email / ID
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Enter your email or ID"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  style={{ paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280' }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Demo accounts */}
          <div style={{ marginTop: '20px', background: '#F9FAFB', borderRadius: '10px', padding: '14px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontWeight: 600, color: '#6B7280' }}>Demo accounts:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { icon: '🔑', email: 'admin@campus.edu', role: 'Admin Dashboard' },
                { icon: '🔧', email: 'tech@campus.edu', role: 'Technician Dashboard' },
                { icon: '👤', email: 'any other email', role: 'Track Complaints' },
              ].map((d, i) => (
                <p key={i} style={{ margin: 0, fontSize: '0.8rem', color: '#374151' }}>
                  {d.icon} <span style={{ color: '#6C63FF', fontWeight: 500 }}>{d.email}</span> → {d.role}
                </p>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
