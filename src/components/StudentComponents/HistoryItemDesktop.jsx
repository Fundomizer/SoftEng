/**
 * HistoryItemDesktop Component - Table row for print history
 */
export default function HistoryItemDesktop({ item, removeFromHistory }) {
    return (
        <>
        <tr key={item.id}>
            <td>
                <div className="document-cell">
                    <span className="document-title">Job #{item.id} - {item.documentTitle}</span>
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
                {item.status === "Pending" ? (
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
        {item.status === "Rejected" && item.rejectionReason && (
            <tr key={`${item.id}-reason`} className="rejection-reason-row">
                <td colSpan="7">
                    <div className="rejection-reason">
                        <strong>Rejection Reason:</strong> {item.rejectionReason}
                    </div>
                </td>
            </tr>
        )}
        </>
    );
}
