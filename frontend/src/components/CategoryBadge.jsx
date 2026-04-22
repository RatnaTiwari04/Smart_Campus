const categoryConfig = {
  WiFi:           { icon: '📶', color: '#3B82F6', bg: '#DBEAFE' },
  Electricity:    { icon: '⚡', color: '#F59E0B', bg: '#FEF3C7' },
  Plumbing:       { icon: '🔧', color: '#6B7280', bg: '#F3F4F6' },
  Furniture:      { icon: '🪑', color: '#8B5CF6', bg: '#EDE9FE' },
  'Water Leakage':{ icon: '💧', color: '#06B6D4', bg: '#CFFAFE' },
  Other:          { icon: '📌', color: '#EC4899', bg: '#FCE7F3' },
};

const CategoryBadge = ({ category }) => {
  const cfg = categoryConfig[category] || categoryConfig['Other'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '3px 10px', borderRadius: '20px',
      background: cfg.bg, color: cfg.color,
      fontSize: '0.78rem', fontWeight: 600
    }}>
      {cfg.icon} {category}
    </span>
  );
};

export { categoryConfig };
export default CategoryBadge;
