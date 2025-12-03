/**
 * HistoryCard Component
 *
 * Renders a single history card with header, details, footer, and optional cancel button.
 *
 * Props:
 * - item {object} : History item data with fields:
 *    - id {string|number} : Unique ID
 *    - documentTitle {string} : Title of the document
 *    - documentFilename {string} : Filename of the document
 *    - pages {number} : Number of pages
 *    - mode {string} : Print mode (e.g., "bw", "color")
 *    - tokens {number} : Token cost
 *    - status {string} : Current status text
 *    - statusClass {string} : CSS class for status styling
 *    - submitted {string} : Submission timestamp
 * - removeFromHistory {function} : Callback to cancel/remove history item
 */
export default function HistoryItemMobile({ item, removeFromHistory }) {
    return (
        <div className="history-card" id={`history-${item.id}`}>
            <div className="history-card-header">
                <div>
                    <div className="history-document-title">{item.documentTitle}</div>
                    <div className="history-document-filename">{item.documentFilename}</div>
                </div>
                <span className={`status-badge ${item.statusClass}`}>{item.status}</span>
            </div>

            <div className="history-card-details">
                <div className="history-detail-item">
                    <span className="history-detail-label">Pages:</span>
                    <span className="history-detail-value">{item.pages}</span>
                </div>
                <div className="history-detail-item">
                    <span className="history-detail-label">Mode:</span>
                    <span className="history-detail-value">{item.mode}</span>
                </div>
                <div className="history-detail-item">
                    <span className="history-detail-label">Tokens:</span>
                    <span className="history-detail-value">{item.tokens}</span>
                </div>
            </div>

            <div className="history-card-footer">
                <div className="history-submitted">{item.submitted}</div>
                {item.status === "Pending" && (
                    <button
                        className="cancel-btn"
                        onClick={() => removeFromHistory(item.id)}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
