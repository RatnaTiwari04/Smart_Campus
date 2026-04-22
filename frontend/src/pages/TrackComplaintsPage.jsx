import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getMyComplaints } from '../api/api';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';

const TrackComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'All') params.status = filter;
      if (search) params.search = search;
      
      const res = await getMyComplaints(params);
      setComplaints(res.data.complaints);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  // Compute summary stats
  const totalSubmitted = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress' || c.status === 'Assigned').length;
  const completedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
            <div>
              <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.8rem', color: '#1E1E2E' }}>Track Complaints</h1>
              <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.9rem' }}>View and monitor your submitted complaints</p>
            </div>
            <Link to="/raise-complaint">
              <button className="btn-primary" style={{ padding: '12px 20px', borderRadius: '24px' }}>
                + Raise New Complaint
              </button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6B7280' }}></div>
                <span style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>Submitted</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E1E2E' }}>{totalSubmitted}</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></div>
                <span style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>In Progress</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E1E2E' }}>{inProgressCount}</div>
            </div>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                <span style={{ fontSize: '0.9rem', color: '#6B7280', fontWeight: 500 }}>Completed</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1E1E2E' }}>{completedCount}</div>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <form onSubmit={handleSearch} style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>🔍</span>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search by complaint ID, category, or location..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '40px', borderRadius: '24px' }}
                />
              </div>
            </form>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', padding: '0 16px', borderRadius: '24px', border: '1.5px solid #E5E7EB' }}>
              <span style={{ color: '#9CA3AF' }}>Y</span>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', color: '#374151', fontWeight: 500, padding: '10px 0', cursor: 'pointer' }}
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div className="loading-spinner"></div>
              </div>
            ) : complaints.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: '1.1rem' }}>No complaints found</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>Try adjusting your filters or search</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                      <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Complaint ID</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      <th style={{ padding: '16px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c._id} className="table-row" style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#6C63FF', fontWeight: 700 }}>{c.complaintId}</td>
                        <td style={{ padding: '16px 20px' }}><CategoryBadge category={c.category} /></td>
                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#4B5563' }}>{c.location}</td>
                        <td style={{ padding: '16px 20px', fontSize: '0.85rem', color: '#6B7280' }}>{formatDate(c.createdAt)}</td>
                        <td style={{ padding: '16px 20px' }}><StatusBadge status={c.status} /></td>
                        <td style={{ padding: '16px 20px' }}>
                          <Link to={`/complaints/${c._id}`} style={{ textDecoration: 'none' }}>
                            <button style={{ 
                              background: 'transparent', border: 'none', color: '#6C63FF', 
                              display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, 
                              cursor: 'pointer', fontSize: '0.85rem', padding: '6px 10px',
                              borderRadius: '6px', transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#EEF0FF'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"/></svg>
                              View Details
                            </button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrackComplaintsPage;
