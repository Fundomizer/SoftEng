export default function PendingTab({
  printJobs,
  isLoading,
  onViewDocument,
  onApprove,
  onReject,
}) {
  const pendingJobs = printJobs.filter((job) => job.status === "pending");

  const handleReject = (jobId) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) onReject(jobId, reason);
  };

  return (
    <div>
      <h2 className="admin-dashboard__section-title">Pending Print Requests</h2>
      <p className="admin-dashboard__section-description">
        Review and approve or reject student print requests
      </p>

      {isLoading ? (
        <div className="admin-dashboard__loading">Loading...</div>
      ) : pendingJobs.length === 0 ? (
        <div className="admin-dashboard__empty-state">No pending requests</div>
      ) : (
        pendingJobs.map((job) => (
          <div key={job.id} className="admin-dashboard__job-card">
            <div className="admin-dashboard__job-header">
              <div>
                <div className="admin-dashboard__job-title">
                  {job.document_name}
                </div>
                <div className="admin-dashboard__job-filename">
                  {job.document_filename}
                </div>
                <div className="admin-dashboard__job-student">
                  {job.first_name} {job.last_name} ({job.student_id})
                </div>
              </div>
              <div className="admin-dashboard__job-actions">
                <button
                  onClick={() => onViewDocument(job.document_filename)}
                  className="admin-dashboard__btn-view"
                >
                  View Document
                </button>
                <div className="admin-dashboard__job-action-row">
                  <button
                    onClick={() => onApprove(job.id)}
                    className="admin-dashboard__btn-approve"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(job.id)}
                    className="admin-dashboard__btn-reject"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            <div className="admin-dashboard__job-details">
              <div>
                <div className="admin-dashboard__detail-label">Pages</div>
                <div className="admin-dashboard__detail-value">
                  {job.num_pages}
                </div>
              </div>
              <div>
                <div className="admin-dashboard__detail-label">Type</div>
                <div className="admin-dashboard__detail-value">
                  {job.color_mode === "bw" ? "B&W" : "Color"}
                </div>
              </div>
              <div>
                <div className="admin-dashboard__detail-label">Paper Size</div>
                <div className="admin-dashboard__detail-value">
                  {job.paper_size.toUpperCase()}
                </div>
              </div>
              <div>
                <div className="admin-dashboard__detail-label">Images</div>
                <div className="admin-dashboard__detail-value">
                  {job.has_images === "yes" ? "Yes" : "No"}
                </div>
              </div>
              <div>
                <div className="admin-dashboard__detail-label">Token Cost</div>
                <div className="admin-dashboard__detail-value">
                  {job.token_cost}
                </div>
              </div>
              <div>
                <div className="admin-dashboard__detail-label">
                  Date Submitted
                </div>
                <div className="admin-dashboard__detail-value">
                  {new Date(job.submitted_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
