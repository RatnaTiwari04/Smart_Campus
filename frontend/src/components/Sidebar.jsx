import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = {
  student: [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/raise-complaint', label: 'Raise Complaint', icon: '📝' },
    { to: '/track-complaints', label: 'Track Complaints', icon: '🔍' },
    { to: '/feedback', label: 'Feedback', icon: '⭐' },
  ],
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/complaints', label: 'All Complaints', icon: '📋' },
    { to: '/admin/technicians', label: 'Technicians', icon: '🔧' },
  ],
  technician: [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/technician/tasks', label: 'My Tasks', icon: '🛠️' },
  ],
};

const Sidebar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const items = navItems[user?.role] || [];

  return (
    <aside style={{
      width: '240px', minHeight: 'calc(100vh - 64px)', background: 'white',
      borderRight: '1px solid #E5E7EB', padding: '20px 12px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      position: 'sticky', top: '64px', height: 'calc(100vh - 64px)', overflowY: 'auto'
    }}>
      <div>
        {/* User info */}
        <div style={{
          background: 'linear-gradient(135deg, #EEF0FF, #F5F3FF)', borderRadius: '12px',
          padding: '14px', marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px', height: '40px', background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: '#1E1E2E' }}>{user?.name}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#6C63FF', textTransform: 'capitalize', fontWeight: 500 }}>{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={() => { logoutUser(); navigate('/'); }}
        style={{
          display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
          borderRadius: '10px', color: '#EF4444', background: '#FEF2F2', border: 'none',
          cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', width: '100%',
          transition: 'background 0.2s'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
        </svg>
        Sign Out
      </button>
    </aside>
  );
};

export default Sidebar;
