import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getAllComplaints, getTechnicians, assignComplaint } from '../api/api';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  
  // Assign modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedTech, setSelectedTech] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'All') params.status = filter;
      if (search) params.search = search;
      
      const [compRes, techRes] = await Promise.all([
        getAllComplaints(params),
        getTechnicians()
      ]);
      setComplaints(compRes.data.complaints);
      setTechnicians(techRes.data);
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

  const handleAssignClick = (complaint) => {
    setSelectedComplaint(complaint);
    setSelectedTech(complaint.assignedTo?._id || '');
    setIsModalOpen(true);
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTech) return;
    setAssignLoading(true);
    try {
      await assignComplaint(selectedComplaint._id, { technicianId: selectedTech });
      setIsModalOpen(false);
      fetchComplaints(); // refresh list
    } catch (error) {
      console.error(error);
      alert('Failed to assign complaint');
    } finally {
      setAssignLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.8rem', color: '#1E1E2E' }}>Manage Complaints</h1>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.9rem' }}>Administer and assign tasks to technicians</p>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            <form onSubmit={handleSearch} style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>🔍</span>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search complaints..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '40px', borderRadius: '12px' }}
                />
              </div>
            </form>
            <select className="input-field" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ width: '200px', borderRadius: '12px' }}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="card" style={{ overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '40px', display: 'flex', justifyContent: 'center' }}>
                <div className="loading-spinner"></div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                      <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>ID / Title</th>
                      <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Student</th>
                      <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Details</th>
                      <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Assigned To</th>
                      <th style={{ padding: '14px 20px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.map((c) => (
                      <tr key={c._id} className="table-row" style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ color: '#6C63FF', fontWeight: 700, fontSize: '0.85rem' }}>{c.complaintId}</div>
                          <div style={{ fontSize: '0.85rem', color: '#1E1E2E', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#1E1E2E' }}>{c.createdBy?.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{c.createdBy?.rollNumber}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <CategoryBadge category={c.category} />
                          <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '4px' }}>{c.location}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}><StatusBadge status={c.status} /></td>
                        <td style={{ padding: '16px 20px' }}>
                          {c.assignedTo ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#EEF0FF', color: '#6C63FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                {c.assignedTo.name.charAt(0)}
                              </div>
                              <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 500 }}>{c.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span style={{ fontSize: '0.85rem', color: '#9CA3AF', fontStyle: 'italic' }}>Unassigned</span>
                          )}
                        </td>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <Link to={`/complaints/${c._id}`}>
                              <button className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                                View
                              </button>
                            </Link>
                            <button onClick={() => handleAssignClick(c)} className="btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                              {c.assignedTo ? 'Reassign' : 'Assign'}
                            </button>
                          </div>
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

      {/* Assign Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div className="card animate-fade-in-up" style={{ width: '100%', maxWidth: '400px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: '#1E1E2E' }}>Assign Technician</h3>
            <p style={{ margin: '0 0 20px', fontSize: '0.9rem', color: '#6B7280' }}>
              Select a technician for <strong style={{ color: '#6C63FF' }}>{selectedComplaint?.complaintId}</strong>
            </p>
            
            <form onSubmit={handleAssignSubmit}>
              <select 
                className="input-field" 
                value={selectedTech} 
                onChange={(e) => setSelectedTech(e.target.value)}
                required
                style={{ marginBottom: '20px' }}
              >
                <option value="" disabled>Select Technician</option>
                {technicians.map(t => (
                  <option key={t._id} value={t._id}>{t.name} ({t.employeeId})</option>
                ))}
              </select>
              
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-ghost">Cancel</button>
                <button type="submit" className="btn-primary" disabled={assignLoading}>
                  {assignLoading ? 'Assigning...' : 'Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
