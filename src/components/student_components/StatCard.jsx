/**
 * StatCard Component - Statistical card with label, value, and badge
 */
export default function StatCard({ label, value, badge, type }) {
    return (
        <div id="stat-card" className={type}>
            <div id="stat-label">{label}</div>
            <div id="stat-value">{value}</div>
            <span id="stat-badge review">{badge}</span>
        </div>
    )
}