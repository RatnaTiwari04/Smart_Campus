import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getAssignedComplaints, updateComplaintStatus } from '../api/api';
import StatusBadge from '../components/StatusBadge';
import CategoryBadge from '../components/CategoryBadge';

const TechnicianTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getAssignedComplaints({});
      setTasks(res.data.complaints);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingId(taskId);
    try {
      await updateComplaintStatus(taskId, { status: newStatus });
      fetchTasks(); // Refresh tasks
    } catch (error) {
      console.error(error);
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100vh', background: '#F0F2FF' }}>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ margin: 0, fontWeight: 800, fontSize: '1.8rem', color: '#1E1E2E' }}>My Tasks</h1>
            <p style={{ margin: '4px 0 0', color: '#6B7280', fontSize: '0.9rem' }}>Manage your assigned maintenance tasks</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
              <div className="loading-spinner"></div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: '#6B7280' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🛠️</div>
              <p style={{ margin: 0, fontWeight: 500, fontSize: '1.1rem' }}>No tasks assigned yet</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem' }}>You're all caught up!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {tasks.map((task) => (
                <div key={task._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6C63FF', background: '#EEF0FF', padding: '4px 8px', borderRadius: '6px' }}>{task.complaintId}</span>
                        <h3 style={{ margin: '8px 0 4px', fontSize: '1.1rem', color: '#1E1E2E' }}>{task.title}</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280' }}>Reported: {formatDate(task.createdAt)}</p>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <StatusBadge status={task.status} />
                        <Link to={`/complaints/${task._id}`}>
                          <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>View Details</button>
                        </Link>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <CategoryBadge category={task.category} />
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', background: '#F3F4F6', padding: '3px 10px', borderRadius: '20px', color: '#4B5563', fontWeight: 500 }}>
                        📍 {task.location}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', lineHeight: 1.5, background: '#F9FAFB', padding: '12px', borderRadius: '8px' }}>
                      {task.description}
                    </p>
                  </div>
                  
                  <div style={{ padding: '16px 20px', background: '#FAFAFE', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: '#6B7280', fontWeight: 500 }}>Update Status:</span>
                    <select 
                      className="input-field" 
                      style={{ width: 'auto', padding: '6px 12px', fontSize: '0.85rem' }}
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      disabled={updatingId === task._id}
                    >
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TechnicianTasksPage;
