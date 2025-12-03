import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/AdminDashboardStyle.css"
import sluLogo from "../../assets/slu_logo.png"
import AdminDashboardCard from "../../components/AdminComponents/AdminDashboardCard"
import TabButton from "../../components/Tab"

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
            const response = await fetch('/api/admin/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleApprove = async (jobId) => {
        try {
            const response = await fetch(`/api/admin/jobs/${jobId}/approve`, {
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
            const response = await fetch(`/api/admin/jobs/${jobId}/reject`, {
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
            const response = await fetch(`/api/admin/jobs/${jobId}/printed`, {
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

    const handleLogout = () => {
        sessionStorage.removeItem('admin');
        navigate('/admin');
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
                        <span>Total Requests: <strong>{stats.total}</strong></span>
                    </div>
                    <button className="admin-dashboard__logout-btn" onClick={() => setShowLogoutPopup(true)}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="admin-dashboard__content">
                <div className="admin-dashboard__grid">
                    <AdminDashboardCard
                        title="Pending Review"
                        description="View and manage print requests awaiting review."
                    />

                    <AdminDashboardCard
                        title="Print Queue"
                        description="Track approved requests currently in the print queue."
                    />

                    <AdminDashboardCard
                        title="Completed"
                        description="View all successfully completed print requests."
                    />

                    <AdminDashboardCard
                        title="Rejected"
                        description="View rejected print requests and reasons."
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
                            <h2 style={{ color: '#000000' }}>Pending Print Requests</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Review and approve or reject student print requests
                            </p>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                            ) : jobs.filter(job => job.status === 'pending').length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    No pending requests
                                </div>
                            ) : (
                                jobs.filter(job => job.status === 'pending').map(job => (
                                    <div key={job.id} style={{
                                        marginTop: '2rem',
                                        padding: '1.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        backgroundColor: '#ffffff'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ color: '#003d73', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                    {job.document_name}
                                                </div>
                                                <div style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                                    {job.document_filename}
                                                </div>
                                                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                                    {job.first_name} {job.last_name} ({job.student_id})
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                alignItems: 'flex-end'
                                            }}>
                                                <button style={{
                                                    width: '212.65px',
                                                    height: '36px',
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: 'white',
                                                    color: '#003d73',
                                                    border: '1px solid #003d73',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    opacity: 1
                                                }}>
                                                    View Document
                                                </button>
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', width: '212.65px' }}>
                                                    <button onClick={() => handleApprove(job.id)} style={{
                                                        width: '103.825px',
                                                        height: '36px',
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#10b981',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s',
                                                        opacity: 1
                                                    }}>
                                                        Approve
                                                    </button>
                                                    <button onClick={() => {
                                                        const reason = prompt('Enter rejection reason:');
                                                        if (reason) handleReject(job.id, reason);
                                                    }} style={{
                                                        width: '103.825px',
                                                        height: '36px',
                                                        padding: '0.5rem 1rem',
                                                        backgroundColor: '#ef4444',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        fontSize: '0.875rem',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s',
                                                        opacity: 1
                                                    }}>
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(6, 1fr)',
                                            gap: '1rem',
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid #f3f4f6'
                                        }}>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Pages</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.num_pages}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Type</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.color_mode === 'bw' ? 'B&W' : 'Color'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Paper Size</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.paper_size.toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Images</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.has_images === 'yes' ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Token Cost</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.token_cost}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Date Submitted</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>
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
                            <h2 style={{ color: '#000000' }}>Print Queue</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Track approved requests currently in the print queue
                            </p>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                            ) : jobs.filter(job => job.status === 'approved').length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    No jobs in queue
                                </div>
                            ) : (
                                jobs.filter(job => job.status === 'approved').map(job => (
                                    <div key={job.id} style={{
                                        marginTop: '2rem',
                                        padding: '1.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        backgroundColor: '#ffffff'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <div>
                                                <div style={{ color: '#003d73', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                    {job.document_name}
                                                </div>
                                                <div style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                                    {job.document_filename}
                                                </div>
                                                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                                    {job.first_name} {job.last_name} ({job.student_id})
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.5rem',
                                                alignItems: 'flex-end'
                                            }}>
                                                <button style={{
                                                    width: '212.65px',
                                                    height: '36px',
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: 'white',
                                                    color: '#003d73',
                                                    border: '1px solid #003d73',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    opacity: 1
                                                }}>
                                                    View Document
                                                </button>
                                                <button onClick={() => handleMarkPrinted(job.id)} style={{
                                                    width: '212.65px',
                                                    height: '36px',
                                                    padding: '0.5rem 1rem',
                                                    backgroundColor: '#003366',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'background-color 0.2s',
                                                    opacity: 1
                                                }}>
                                                    Mark Printed
                                                </button>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(6, 1fr)',
                                            gap: '1rem',
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid #f3f4f6'
                                        }}>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Pages</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.num_pages}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Type</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.color_mode === 'bw' ? 'B&W' : 'Color'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Paper Size</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.paper_size.toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Images</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.has_images === 'yes' ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Token Cost</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.token_cost}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Date Submitted</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>
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
                            <h2 style={{ color: '#000000' }}>History</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                View all completed and rejected print requests
                            </p>

                            {loading ? (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
                            ) : jobs.filter(job => job.status === 'printed' || job.status === 'rejected').length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    No history items
                                </div>
                            ) : (
                                jobs.filter(job => job.status === 'printed' || job.status === 'rejected').map(job => (
                                    <div key={job.id} style={{
                                        marginTop: '2rem',
                                        padding: '1.5rem',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        backgroundColor: '#ffffff'
                                    }}>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <div style={{ color: '#003d73', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                                {job.document_name}
                                            </div>
                                            <div style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                                {job.document_filename}
                                            </div>
                                            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                                {job.first_name} {job.last_name} ({job.student_id})
                                            </div>
                                            <div style={{ 
                                                marginTop: '0.5rem',
                                                padding: '0.5rem',
                                                backgroundColor: job.status === 'printed' ? '#d1fae5' : '#fee2e2',
                                                color: job.status === 'printed' ? '#065f46' : '#991b1b',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                fontWeight: '500'
                                            }}>
                                                Status: {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(6, 1fr)',
                                            gap: '1rem',
                                            marginTop: '1rem',
                                            paddingTop: '1rem',
                                            borderTop: '1px solid #f3f4f6'
                                        }}>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Pages</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.num_pages}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Type</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.color_mode === 'bw' ? 'B&W' : 'Color'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Paper Size</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.paper_size.toUpperCase()}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Images</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.has_images === 'yes' ? 'Yes' : 'No'}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Token Cost</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>{job.token_cost}</div>
                                            </div>
                                            <div>
                                                <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Date Submitted</div>
                                                <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>
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
