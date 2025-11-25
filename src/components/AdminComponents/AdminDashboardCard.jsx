/**
 * AdminCard Component
 *
 * Renders a dashboard card with a title and description.
 *
 * Props:
 * - title {string} : The heading text for the card.
 * - description {string} : The supporting description text.
 */
export default function AdminDashboardCard({ title, description }) {
    return (
        <div className="admin-dashboard__card">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}
