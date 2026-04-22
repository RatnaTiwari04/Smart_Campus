const StatCard = ({ label, value, icon, color, sub }) => {
  const colors = {
    purple: { bg: '#EEF0FF', text: '#6C63FF', border: '#C7C3FF' },
    orange: { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A' },
    blue:   { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' },
    green:  { bg: '#D1FAE5', text: '#059669', border: '#A7F3D0' },
    red:    { bg: '#FEE2E2', text: '#EF4444', border: '#FECACA' },
  };
  const c = colors[color] || colors.purple;

  return (
    <div className="card" style={{ padding: '20px 24px', borderLeft: `4px solid ${c.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#6B7280', fontWeight: 500, marginBottom: '6px' }}>{label}</p>
          <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#1E1E2E', lineHeight: 1.1 }}>{value}</p>
          {sub && <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#6B7280' }}>{sub}</p>}
        </div>
        <div style={{
          width: '52px', height: '52px', background: c.bg, borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
