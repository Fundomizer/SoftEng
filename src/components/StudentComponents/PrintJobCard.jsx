/**
 * PrintJobCard Component - Displays a print job card with details
 */
export default function PrintJobCard({ printJob }) {
    return (
        <div id={`job-${printJob.id}`} className={`print-job-card ${printJob.statusClass}`}>
            <div className="job-header">
                <div className="job-title">
                    <span className="job-icon">{printJob.icon}</span>
                    <div className="job-info">
                        <h3>{printJob.title}</h3>
                        <p className="job-document">{printJob.document}</p>
                    </div>
                </div>
                <span className={`job-status ${printJob.statusClass}`}>{printJob.status}</span>
            </div>

            <div className="job-details">
                <div className="detail-item">
                    <span className="detail-label">Pages</span>
                    <span className="detail-value">{printJob.pages}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Mode</span>
                    <span className="detail-value">{printJob.mode}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Images</span>
                    <span className="detail-value">{printJob.hasImages}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Token Cost</span>
                    <span className="detail-value">{printJob.tokenCost}</span>
                </div>
            </div>

            <div className="job-footer">
                Submitted: {printJob.submitted}
                {printJob.reviewed && ` • Reviewed: ${printJob.reviewed}`}
            </div>

            {printJob.rejectionReason && (
                <div className="rejection-reason">
                    Rejection reason: {printJob.rejectionReason}
                </div>
            )}
        </div>
    );
}
