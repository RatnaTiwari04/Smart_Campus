import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={{ background: 'white', borderBottom: '1px solid #E5E7EB', position: 'sticky', top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', background: 'linear-gradient(135deg, #6C63FF, #9C8FFF)',
            borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1E1E2E' }}>SmartCampus</span>
        </Link>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '0.9rem'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: '#1E1E2E' }}>{user.name}</p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', textTransform: 'capitalize' }}>{user.role}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="btn-ghost" style={{ padding: '7px 14px', fontSize: '0.85rem' }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="btn-ghost">Login</button></Link>
              <Link to="/register"><button className="btn-primary">Create Account</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
