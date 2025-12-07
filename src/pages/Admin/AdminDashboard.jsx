import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/AdminDashboardStyle.css"
import sluLogo from "../../assets/slu_logo.png"
import AdminDashboardCard from "../../components/AdminComponents/AdminDashboardCard"
import TabButton from "../../components/Tab"
import { HOST, PORT } from "../../config"

export function AdminDashboard() {
    const navigate = useNavigate()
    const [showLogoutPopup, setShowLogoutPopup] = useState(false)
    const [activeTab, setActiveTab] = useState("pending")
    const [adminId, setAdminId] = useState(null)
    const [jobs, setJobs] = useState([])
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, printed: 0, rejected: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get admin info from sessionStorage
        const storedAdmin = sessionStorage.getItem('admin');
        if (!storedAdmin) {
            navigate('/admin');
            return;
        }

        const admin = JSON.parse(storedAdmin);
        setAdminId(admin.id);

        // Fetch jobs and stats
        fetchJobs();
        fetchStats();

        // Auto-refresh every 30 seconds
        const refreshInterval = setInterval(() => {
            fetchJobs();
            fetchStats();
        }, 5000);

        return () => clearInterval(refreshInterval);
    }, [navigate]);

    const fetchJobs = async (status = null) => {
        try {
            const url = status ? `/api/admin/jobs?status=${status}` : '/api/admin/jobs';
            const response = await fetch(url);
            const data = await response.json();
            setJobs(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${HOST}:${PORT}/api/admin/stats`);
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (jobId) => {
        try {
            const response = await fetch(`${HOST}:${PORT}/api/admin/jobs/${jobId}/approve`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adminId })
            });

            if (response.ok) {
                await fetchJobs();
                await fetchStats();
            }
        } catch (error) {
            console.error('Error approving job:', error);
        }
    };

    const handleReject = async (jobId, reason) => {
        try {
            const response = await fetch(`${HOST}:${PORT}/api/admin/jobs/${jobId}/reject`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ adminId, reason })
            });

            if (response.ok) {
                await fetchJobs();
                await fetchStats();
            }
        } catch (error) {
            console.error('Error rejecting job:', error);
        }
    };

    const handleMarkPrinted = async (jobId) => {
        try {
            const response = await fetch(`${HOST}:${PORT}/api/admin/jobs/${jobId}/printed`, {
                method: 'PUT'
            });

            if (response.ok) {
                await fetchJobs();
                await fetchStats();
            }
        } catch (error) {
            console.error('Error marking job as printed:', error);
        }
    };

    const handleViewDocument = (filename) => {
        if (filename) {
            // Open the document in a new tab ready for printing
            const url = `/api/documents/${encodeURIComponent(filename)}`;
            const printWindow = window.open(url, '_blank');

            // Wait for the document to load, then trigger print dialog
            if (printWindow) {
                printWindow.onload = function () {
                    printWindow.print();
                };
            }
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin');
        navigate('/');
        setShowLogoutPopup(false);
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-dashboard__header">
                <div className="admin-dashboard__header-left">
                    <img src={sluLogo} alt="SLU logo" />
                    <h1>Admin Printing Service Portal</h1>
                </div>
                <div className="admin-dashboard__header-right">
                    <div className="admin-dashboard__counter">
                        <span>Pending Requests: <strong>{stats.pending}</strong></span>
                    </div>
                    <button className="admin-dashboard__logout-btn" onClick={() => setShowLogoutPopup(true)}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="admin-dashboard__content">
                <div className="admin-dashboard__grid">
                    <AdminDashboardCard
                        title="Print Queue"
                        description="Track approved requests currently in the print queue."
                        count={stats.approved}
                    />

                    <AdminDashboardCard
                        title="Completed"
                        description="View all successfully completed print requests."
                        count={stats.printed}
                    />

                    <AdminDashboardCard
                        title="Rejected"
                        description="View rejected print requests and reasons."
                        count={stats.rejected}
                    />
                </div>

                {/* Navigation Tabs */}
                <div id="tabs">
                    <TabButton
                        label="Pending Review"
                        icon="⏱"
                        tabKey="pending"
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <TabButton
                        label="Print Queue"
                        icon="🖨️"
                        tabKey="queue"
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />

                    <TabButton
                        label="History"
                        icon="🕐"
                        tabKey="history"
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </div>

                {/* Tab Content */}
                <div className="admin-dashboard__tab-content">
                    {activeTab === "pending" && (
                        <div>
                            <h2 className="admin-dashboard__section-title">Pending Print Requests</h2>
                            <p className="admin-dashboard__section-description">
                                Review and approve or reject student print requests
                            </p>

                            {loading ? (
                                <div className="admin-dashboard__loading">Loading...</div>
                            ) : jobs.filter(job => job.status === 'pending').length === 0 ? (
                                <div className="admin-dashboard__empty-state">
                                    No pending requests
                                </div>
                            ) : (
                                jobs.filter(job => job.status === 'pending').map(job => (
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
                                                <button onClick={() => handleViewDocument(job.document_filename)} className="admin-dashboard__btn-view">
                                                    View Document
                                                </button>
                                                <div className="admin-dashboard__job-action-row">
                                                    <button onClick={() => handleApprove(job.id)} className="admin-dashboard__btn-approve">
                                                        Approve
                                                    </button>
                                                    <button onClick={() => {
                                                        const reason = prompt('Enter rejection reason:');
                                                        if (reason) handleReject(job.id, reason);
                                                    }} className="admin-dashboard__btn-reject">
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="admin-dashboard__job-details">
                                            <div>
                                                <div className="admin-dashboard__detail-label">Pages</div>
                                                <div className="admin-dashboard__detail-value">{job.num_pages}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Type</div>
                                                <div className="admin-dashboard__detail-value">{job.color_mode === 'bw' ? 'B&W' : 'Color'}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Paper Size</div>
                                                <div className="admin-dashboard__detail-value">{job.paper_size.toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Images</div>
                                                <div className="admin-dashboard__detail-value">{job.has_images === 'yes' ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Token Cost</div>
                                                <div className="admin-dashboard__detail-value">{job.token_cost}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Date Submitted</div>
                                                <div className="admin-dashboard__detail-value">
                                                    {new Date(job.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === "queue" && (
                        <div>
                            <h2 className="admin-dashboard__section-title">Print Queue</h2>
                            <p className="admin-dashboard__section-description">
                                Track approved requests currently in the print queue
                            </p>

                            {loading ? (
                                <div className="admin-dashboard__loading">Loading...</div>
                            ) : jobs.filter(job => job.status === 'approved').length === 0 ? (
                                <div className="admin-dashboard__empty-state">
                                    No jobs in queue
                                </div>
                            ) : (
                                jobs.filter(job => job.status === 'approved').map(job => (
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
                                                <button onClick={() => handleViewDocument(job.document_filename)} className="admin-dashboard__btn-view">
                                                    View Document
                                                </button>
                                                <button onClick={() => handleMarkPrinted(job.id)} className="admin-dashboard__btn-printed">
                                                    Mark Printed
                                                </button>
                                            </div>
                                        </div>

                                        <div className="admin-dashboard__job-details">
                                            <div>
                                                <div className="admin-dashboard__detail-label">Pages</div>
                                                <div className="admin-dashboard__detail-value">{job.num_pages}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Type</div>
                                                <div className="admin-dashboard__detail-value">{job.color_mode === 'bw' ? 'B&W' : 'Color'}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Paper Size</div>
                                                <div className="admin-dashboard__detail-value">{job.paper_size.toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Images</div>
                                                <div className="admin-dashboard__detail-value">{job.has_images === 'yes' ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Token Cost</div>
                                                <div className="admin-dashboard__detail-value">{job.token_cost}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Date Submitted</div>
                                                <div className="admin-dashboard__detail-value">
                                                    {new Date(job.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                    {activeTab === "history" && (
                        <div>
                            <h2 className="admin-dashboard__section-title">History</h2>
                            <p className="admin-dashboard__section-description">
                                View all completed and rejected print requests
                            </p>

                            {loading ? (
                                <div className="admin-dashboard__loading">Loading...</div>
                            ) : jobs.filter(job => job.status === 'printed' || job.status === 'rejected').length === 0 ? (
                                <div className="admin-dashboard__empty-state">
                                    No history items
                                </div>
                            ) : (
                                jobs.filter(job => job.status === 'printed' || job.status === 'rejected').map(job => (
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
                                            <div className={`admin-dashboard__status-badge ${job.status === 'printed' ? 'admin-dashboard__status-badge--printed' : 'admin-dashboard__status-badge--rejected'}`}>
                                                Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                            </div>
                                        </div>

                                        <div className="admin-dashboard__job-details">
                                            <div>
                                                <div className="admin-dashboard__detail-label">Pages</div>
                                                <div className="admin-dashboard__detail-value">{job.num_pages}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Type</div>
                                                <div className="admin-dashboard__detail-value">{job.color_mode === 'bw' ? 'B&W' : 'Color'}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Paper Size</div>
                                                <div className="admin-dashboard__detail-value">{job.paper_size.toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Images</div>
                                                <div className="admin-dashboard__detail-value">{job.has_images === 'yes' ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Token Cost</div>
                                                <div className="admin-dashboard__detail-value">{job.token_cost}</div>
                                            </div>
                                            <div>
                                                <div className="admin-dashboard__detail-label">Date Submitted</div>
                                                <div className="admin-dashboard__detail-value">
                                                    {new Date(job.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Logout Confirmation Popup */}
            {showLogoutPopup && (
                <div className="admin-dashboard__overlay">
                    <div className="admin-dashboard__popup">
                        <h3>Confirm Logout</h3>
                        <p>Are you sure you want to logout?</p>
                        <div className="admin-dashboard__popup-buttons">
                            <button onClick={handleLogout} className="admin-dashboard__confirm-btn">
                                Yes, Logout
                            </button>
                            <button onClick={() => setShowLogoutPopup(false)} className="admin-dashboard__cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
