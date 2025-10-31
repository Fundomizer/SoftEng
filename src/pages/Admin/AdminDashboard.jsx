import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../styles/AdminDashboardStyle.css"
import sluLogo from "../../assets/slu_logo.png"

export function AdminDashboard() {
    const navigate = useNavigate()
    const [showLogoutPopup, setShowLogoutPopup] = useState(false)
    const [activeTab, setActiveTab] = useState("pending")

    const handleLogout = () => {
        navigate('/admin')
        setShowLogoutPopup(false)
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-dashboard__header">
                <div className="admin-dashboard__header-left">
                    <img src={sluLogo} alt="SLU logo" />
                    <h1>Admin Printing Service Portal</h1>
                </div>
                <div className="admin-dashboard__header-right">
                    <div className="admin-dashboard__counter">
                        <span>Total Requests: <strong>24</strong></span>
                    </div>
                    <button className="admin-dashboard__logout-btn" onClick={() => setShowLogoutPopup(true)}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="admin-dashboard__content">
                <div className="admin-dashboard__grid">
                    <div className="admin-dashboard__card">
                        <h3>Pending Review</h3>
                        <p>View and manage print requests awaiting review.</p>
                    </div>

                    <div className="admin-dashboard__card">
                        <h3>Print Queue</h3>
                        <p>Track approved requests currently in the print queue.</p>
                    </div>

                    <div className="admin-dashboard__card">
                        <h3>Completed</h3>
                        <p>View all successfully completed print requests.</p>
                    </div>

                    <div className="admin-dashboard__card">
                        <h3>Rejected</h3>
                        <p>View rejected print requests and reasons.</p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div id="tabs">
                    <button
                        id="tab-btn"
                        className={activeTab === "pending" ? "active" : ""}
                        onClick={() => setActiveTab("pending")}
                    >
                        <span id="tab-icon">⏱</span>
                        Pending Review
                    </button>
                    <button
                        id="tab-btn"
                        className={activeTab === "queue" ? "active" : ""}
                        onClick={() => setActiveTab("queue")}
                    >
                        <span id="tab-icon">🖨️</span>
                        Print Queue
                    </button>
                    <button
                        id="tab-btn"
                        className={activeTab === "history" ? "active" : ""}
                        onClick={() => setActiveTab("history")}
                    >
                        <span id="tab-icon">🕐</span>
                        History
                    </button>
                </div>

                {/* Tab Content */}
                <div className="admin-dashboard__tab-content">
                    {activeTab === "pending" && (
                        <div>
                            <h2 style={{ color: '#000000' }}>Pending Print Requests</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Review and approve or reject student print requests
                            </p>

                            <div style={{
                                marginTop: '2rem',
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ color: '#003d73', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            Research Paper
                                        </div>
                                        <div style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                            research_paper.pdf
                                        </div>
                                        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                            Alice Johnson (2234534)
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
                                            <button style={{
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
                                            <button style={{
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
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>12</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Type</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>B&W</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Paper Size</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>A4</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Images</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>Yes</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Token Cost</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>24</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Date Submitted</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>Oct 22, 09:30 AM</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "queue" && (
                        <div>
                            <h2 style={{ color: '#000000' }}>Print Queue</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                Track approved requests currently in the print queue
                            </p>

                            <div style={{
                                marginTop: '2rem',
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ color: '#003d73', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                            Research Paper
                                        </div>
                                        <div style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                            research_paper.pdf
                                        </div>
                                        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                            Alice Johnson (2234534)
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
                                        <button style={{
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
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>12</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Type</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>B&W</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Paper Size</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>A4</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Images</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>Yes</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Token Cost</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>24</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Date Submitted</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>Oct 22, 09:30 AM</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === "history" && (
                        <div>
                            <h2 style={{ color: '#000000' }}>History</h2>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                                View all completed and rejected print requests
                            </p>

                            <div style={{
                                marginTop: '2rem',
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: '#ffffff'
                            }}>
                                <div style={{ marginBottom: '1rem' }}>
                                    <div style={{ color: '#003d73', fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        Research Paper
                                    </div>
                                    <div style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                                        research_paper.pdf
                                    </div>
                                    <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                                        Alice Johnson (2234534)
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
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>12</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Type</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>B&W</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Paper Size</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>A4</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Images</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>Yes</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Token Cost</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>24</div>
                                    </div>
                                    <div>
                                        <div style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Date Submitted</div>
                                        <div style={{ color: '#374151', fontSize: '0.9rem', fontWeight: '500' }}>Oct 22, 09:30 AM</div>
                                    </div>
                                </div>
                            </div>
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
