import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', rollNumber: '', employeeId: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await register(form);
      loginUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 32px' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6B7280', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Home
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: '440px', padding: '40px 36px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '60px', height: '60px', background: 'linear-gradient(135deg,#10B981,#34D399)',
              borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM12 11v4M8 15h8"/>
              </svg>
            </div>
            <h1 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '1.6rem', color: '#1E1E2E' }}>Create Account</h1>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Join the Smart Campus community</p>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', color: '#EF4444', padding: '12px 14px', borderRadius: '10px', fontSize: '0.88rem', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '6px' }}>Full Name</label>
              <input type="text" className="input-field" placeholder="Enter your full name"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '6px' }}>Email Address</label>
              <input type="email" className="input-field" placeholder="Enter your email"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '6px' }}>Role</label>
              <select className="input-field" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="student">Student</option>
                <option value="technician">Technician</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '6px' }}>
                {form.role === 'student' ? 'Roll Number' : 'Employee ID'}
              </label>
              <input type="text" className="input-field"
                placeholder={form.role === 'student' ? 'e.g. 2024CS001' : 'e.g. EMP-123'}
                value={form.role === 'student' ? form.rollNumber : form.employeeId}
                onChange={(e) => setForm({
                  ...form,
                  [form.role === 'student' ? 'rollNumber' : 'employeeId']: e.target.value
                })}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.88rem', color: '#374151', marginBottom: '6px' }}>Password</label>
              <input type="password" className="input-field" placeholder="Min. 6 characters"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '1rem', marginTop: '4px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.88rem', color: '#6B7280' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6C63FF', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
