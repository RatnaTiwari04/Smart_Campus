import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { getDashboardStats, getMyComplaints, getAllComplaints, getAssignedComplaints } from '../api/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await getDashboardStats();
        setStats(statsRes.data);

        let complaintsRes;
        if (user.role === 'admin') {
          complaintsRes = await getAllComplaints({ page: 1, limit: 5 });
        } else if (user.role === 'technician') {
          complaintsRes = await getAssignedComplaints({ page: 1, limit: 5 });
        } else {
          complaintsRes = await getMyComplaints({ page: 1, limit: 5 });
        }
        setRecentComplaints(complaintsRes.data.complaints);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.8rem', color: '#1E1E2E' }}>
              Dashboard
            </h1>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.9rem' }}>
              Welcome back, {user?.name} 👋
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
              <div className="loading-spinner" />
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <StatCard label="Total Complaints" value={stats?.total || 0} icon="📋" color="purple" />
                <StatCard label="Pending" value={stats?.pending || 0} icon="⏳" color="orange" />
                <StatCard label="In Progress" value={stats?.inProgress || 0} icon="🔧" color="blue" />
                <StatCard label="Resolved" value={stats?.resolved || 0} icon="✅" color="green" />
                {(user.role === 'admin' || user.role === 'technician') && (
                  <StatCard label="Assigned" value={stats?.assigned || 0} icon="📌" color="purple" />
                )}
                <StatCard label="Avg Resolution" value={`${stats?.avgResolutionTime || 0}d`} icon="⏱️" color="blue" sub="Average days to resolve" />
              </div>

              {/* Quick actions for student */}
              {user.role === 'student' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px', maxWidth: '500px' }}>
                  <Link to="/raise-complaint" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{
                      padding: '20px', cursor: 'pointer', background: 'linear-gradient(135deg,#6C63FF,#9C8FFF)',
                      color: 'white', borderRadius: '14px'
                    }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>📝</div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>Raise Complaint</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', opacity: 0.8 }}>Report an issue</p>
                    </div>
                  </Link>
                  <Link to="/track-complaints" style={{ textDecoration: 'none' }}>
                    <div className="card" style={{ padding: '20px', cursor: 'pointer' }}>
                      <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>🔍</div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1E1E2E' }}>Track Complaints</p>
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#6B7280' }}>View your submissions</p>
                    </div>
                  </Link>
                </div>
              )}

              {/* Recent Complaints */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontWeight: 700, fontSize: '1.1rem', color: '#1E1E2E' }}>Recent Complaints</h2>
                  <Link to={user.role === 'admin' ? '/admin/complaints' : user.role === 'technician' ? '/technician/tasks' : '/track-complaints'}
                    style={{ color: '#6C63FF', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                    View all →
                  </Link>
                </div>

                {recentComplaints.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9CA3AF' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📭</div>
                    <p style={{ margin: 0, fontWeight: 500 }}>No complaints yet</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #F3F4F6' }}>
                          {['Complaint ID', 'Title', 'Category', 'Location', 'Date', 'Status'].map(h => (
                            <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recentComplaints.map((c) => (
                          <tr key={c._id} className="table-row" style={{ borderBottom: '1px solid #F3F4F6' }}>
                            <td style={{ padding: '12px', fontSize: '0.85rem', color: '#6C63FF', fontWeight: 600 }}>{c.complaintId}</td>
                            <td style={{ padding: '12px', fontSize: '0.88rem', color: '#1E1E2E', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                            <td style={{ padding: '12px' }}><CategoryBadge category={c.category} /></td>
                            <td style={{ padding: '12px', fontSize: '0.85rem', color: '#6B7280' }}>{c.location}</td>
                            <td style={{ padding: '12px', fontSize: '0.85rem', color: '#6B7280' }}>{formatDate(c.createdAt)}</td>
                            <td style={{ padding: '12px' }}><StatusBadge status={c.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
