/**
 * TabButton Component
 *
 * Renders a reusable tab button with an icon and label.
 * Highlights as active when its tabKey matches the current activeTab,
 * and updates the active tab state on click.
 *
 * Props:
 * - label {string} : Text displayed on the button.
 * - icon {string}  : Emoji or icon shown before the label.
 * - tabKey {string}: Unique key for the tab (e.g. "upload", "queue", "history").
 * - activeTab {string} : Currently selected tab key.
 * - setActiveTab {function} : Setter to update the active tab.
 * - updateActiveTab {function?} : Optional callback for extra tab updates.
 */
export default function TabButton({ label, icon, tabKey, activeTab, setActiveTab, updateActiveTab }) {
    return (
        <button
            id="tab-btn"
            className={activeTab === tabKey ? "active" : ""}
            onClick={() => {
                setActiveTab(tabKey);
                if (updateActiveTab) updateActiveTab(tabKey);
            }}
        >
            <span id="tab-icon">{icon}</span>
            {label}
        </button>
    );
}
