const statusMap = {
  'Pending':     { cls: 'badge-pending',    dot: '#D97706', label: 'Pending' },
  'Assigned':    { cls: 'badge-assigned',   dot: '#7C3AED', label: 'Assigned' },
  'In Progress': { cls: 'badge-inprogress', dot: '#2563EB', label: 'In Progress' },
  'Resolved':    { cls: 'badge-resolved',   dot: '#059669', label: 'Resolved' },
};

const StatusBadge = ({ status }) => {
  const s = statusMap[status] || statusMap['Pending'];
  return (
    <span className={`badge ${s.cls}`}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot, display: 'inline-block' }} />
      {s.label}
    </span>
  );
};

export default StatusBadge;
