/**
 * HistoryRow Component
 *
 * Renders a single row in the print history table.
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
export default function HistoryItemDesktop({ item, removeFromHistory }) {
    return (
        <tr key={item.id}>
            <td>
                <div className="document-cell">
                    <span className="document-title">{item.documentTitle}</span>
                    <span className="document-filename">{item.documentFilename}</span>
                </div>
            </td>
            <td>{item.pages}</td>
            <td>{item.mode}</td>
            <td>{item.tokens}</td>
            <td>
                <span className={`status-badge ${item.statusClass}`}>{item.status}</span>
            </td>
            <td>{item.submitted}</td>
            <td>
                {(item.status === "Pending" || item.status === "Approved") ? (
                    <button
                        className="cancel-btn"
                        onClick={() => removeFromHistory(item.id)}
                    >
                        Cancel
                    </button>
                ) : (
                    <span className="not-cancelable">—</span>
                )}
            </td>
        </tr>
    );
}
