/**
 * Renders a statistical card with a label, value, and optional badge.
 * The card’s appearance is controlled by the `type` prop, which applies
 * a specific CSS class for styling based on the card’s status.
 *
 * Props:
 * - label {string} : The descriptive text shown at the top of the card.
 * - value {string|number} : The main statistic or value displayed prominently.
 * - badge {string} : An optional badge text (e.g., review count or status).
 * - type {string} : Determines the card’s style. Must be one of:
 *    - "stat-card-pending"   → indicates a pending status
 *    - "stat-card-approved"  → indicates an approved status
 *    - "stat-card-completed" → indicates a completed status
 *    - "stat-card-rejected"  → indicates a rejected status
 *
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