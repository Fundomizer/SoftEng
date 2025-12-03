/**
 * TabButton Component - Reusable tab button with icon and label
 */
export default function TabButton({ label, icon, tabKey, activeTab, setActiveTab }) {
    return (
        <button
            id="tab-btn"
            className={activeTab === tabKey ? "active" : ""}
            onClick={() => setActiveTab(tabKey)}
        >
            <span id="tab-icon">{icon}</span>
            {label}
        </button>
    );
}
