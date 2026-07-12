export default function HistoryTab({ printJobs, isLoading }) {
  const historyJobs = printJobs.filter(
    (job) => job.status === "printed" || job.status === "rejected",
  );

  return (
    <div>
      <h2 className="admin-dashboard__section-title">History</h2>
      <p className="admin-dashboard__section-description">
        View all completed and rejected print requests
      </p>

      {isLoading ? (
        <div className="admin-dashboard__loading">Loading...</div>
      ) : historyJobs.length === 0 ? (
        <div className="admin-dashboard__empty-state">No history items</div>
      ) : (
        historyJobs.map((job) => (
          <div key={job.id} className="admin-dashboard__job-card">
            <div className="admin-dashboard__history-header">
              <div className="admin-dashboard__job-title">
                {job.document_name}
              </div>
              <div className="admin-dashboard__job-filename">
                {job.document_filename}
              </div>
              <div className="admin-dashboard__job-student">
                {job.first_name} {job.last_name} ({job.student_id})
              </div>
              <div
                className={`admin-dashboard__status-badge ${job.status === "printed" ? "admin-dashboard__status-badge--printed" : "admin-dashboard__status-badge--rejected"}`}
              >
                Status:{" "}
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
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
