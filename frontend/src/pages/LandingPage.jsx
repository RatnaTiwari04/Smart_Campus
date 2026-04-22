import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const stats = [
  { value: '1,240+', label: 'Complaints Resolved', color: '#6C63FF' },
  { value: '48',     label: 'Active Technicians',  color: '#10B981' },
  { value: '12',     label: 'Campus Blocks Covered', color: '#F59E0B' },
  { value: '2.4 days', label: 'Avg Resolution Time', color: '#3B82F6' },
];

const features = [
  { icon: '📝', title: 'Raise Complaints', desc: 'Submit maintenance issues instantly with category and location details.' },
  { icon: '🔍', title: 'Track in Real-Time', desc: 'Monitor your complaint status from submitted to resolved.' },
  { icon: '🔧', title: 'Expert Technicians', desc: 'Complaints are assigned to qualified on-campus technicians.' },
  { icon: '⭐', title: 'Give Feedback', desc: 'Rate the resolution quality and help improve campus services.' },
];

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{ padding: '80px 24px 60px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
        <div className="animate-fade-in-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#EEF0FF', border: '1px solid #C7C3FF', borderRadius: '20px',
          padding: '6px 16px', marginBottom: '24px', fontSize: '0.82rem',
          color: '#6C63FF', fontWeight: 600
        }}>
          ✨ Smart Campus Initiative 2026
        </div>

        <h1 className="animate-fade-in-up" style={{
          fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', fontWeight: 800, color: '#1E1E2E',
          lineHeight: 1.2, margin: '0 0 16px'
        }}>
          Smart Campus{' '}
          <span style={{ color: '#6C63FF' }}>Maintenance</span>
          <br />Management System
        </h1>

        <p className="animate-fade-in" style={{
          fontSize: '1.1rem', color: '#6B7280', lineHeight: 1.7,
          maxWidth: '560px', margin: '0 auto 36px'
        }}>
          Report campus maintenance issues easily and track them in real time.
          A smarter way to maintain a better campus for everyone.
        </p>

        <div className="animate-fade-in" style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/raise-complaint">
            <button className="btn-primary" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '12px' }}>
              📋 Raise Complaint →
            </button>
          </Link>
          <Link to="/track-complaints">
            <button className="btn-outline" style={{ padding: '14px 32px', fontSize: '1rem', borderRadius: '12px' }}>
              📊 Track Complaint
            </button>
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ maxWidth: '900px', margin: '0 auto 60px', padding: '0 24px' }}>
        <div className="card animate-fade-in" style={{ padding: '24px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '20px' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', borderRight: i < stats.length - 1 ? '1px solid #E5E7EB' : 'none', paddingRight: '20px' }}>
                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800, color: s.color }}>{s.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#6B7280' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: '900px', margin: '0 auto 80px', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.8rem', color: '#1E1E2E', marginBottom: '36px' }}>
          Everything You Need
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          {features.map((f, i) => (
            <div key={i} className="card animate-fade-in-up" style={{ padding: '24px', textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '12px' }}>{f.icon}</div>
              <h3 style={{ margin: '0 0 8px', fontWeight: 700, color: '#1E1E2E', fontSize: '1rem' }}>{f.title}</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '700px', margin: '0 auto 80px', padding: '0 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6C63FF, #9C8FFF)',
          borderRadius: '24px', padding: '48px 32px', textAlign: 'center', color: 'white'
        }}>
          <h2 style={{ margin: '0 0 12px', fontWeight: 800, fontSize: '1.8rem' }}>Ready to Get Started?</h2>
          <p style={{ margin: '0 0 28px', opacity: 0.85, fontSize: '1rem' }}>Join thousands of students using SmartCampus.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <button style={{
                background: 'white', color: '#6C63FF', border: 'none', borderRadius: '10px',
                padding: '12px 28px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                transition: 'transform 0.2s'
              }}>
                Create Account
              </button>
            </Link>
            <Link to="/login">
              <button style={{
                background: 'transparent', color: 'white', border: '2px solid white',
                borderRadius: '10px', padding: '11px 28px', fontWeight: 600,
                fontSize: '0.95rem', cursor: 'pointer'
              }}>
                Login
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E5E7EB', padding: '24px', textAlign: 'center', color: '#9CA3AF', fontSize: '0.85rem' }}>
        © 2026 SmartCampus Maintenance System. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
