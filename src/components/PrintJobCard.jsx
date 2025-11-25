/**
 * PrintJobCard Component
 *
 * Renders a single print job card with header, details, footer, and optional rejection reason.
 *
 * Props:
 * - item {object} : Print job data with fields:
 *    - id {string|number} : Unique job ID
 *    - icon {string} : Icon for the job
 *    - title {string} : Job title
 *    - document {string} : Document name
 *    - status {string} : Current status text
 *    - statusClass {string} : CSS class for status styling
 *    - pages {number} : Number of pages
 *    - mode {string} : Print mode (e.g., "bw", "color")
 *    - hasImages {string} : Whether job has images
 *    - tokenCost {number} : Token cost
 *    - submitted {string} : Submission timestamp
 *    - reviewed {string?} : Optional reviewed timestamp
 *    - rejectionReason {string?} : Optional rejection reason
 */
export default function PrintJobCard({ printJob }) {
    return (
        <div id={`job-${printJob.id}`} className="print-job-card">
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
