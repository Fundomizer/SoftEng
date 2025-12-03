/**
 * HistoryItemMobile Component - Card view for print history on mobile
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
