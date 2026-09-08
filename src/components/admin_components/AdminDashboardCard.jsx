/**
 * AdminDashboardCard Component - Dashboard card with title and description
 */
export default function AdminDashboardCard({ title, description, count }) {
  return (
    <div className="admin-dashboard__card">
      <h3>{title}</h3>
      <p>{description}</p>
      {count !== undefined && <div>{count}</div>}
    </div>
  );
}
