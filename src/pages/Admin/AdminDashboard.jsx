import { useNavigate } from "react-router-dom"
import "../../styles/AdminDashboardStyle.css"

export function AdminDashboard() {
    const navigate = useNavigate()

    const handleLogout = () => {
        navigate('/admin')
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-dashboard__header">
                <div className="admin-dashboard__header-left">
                    <img src="/src/assets/slu_logo.png" alt="SLU logo" />
                    <h1>Admin Printing Service Portal</h1>
                </div>
                <div className="admin-dashboard__header-right">
                    <div className="admin-dashboard__counter">
                        <span>Total Requests: <strong>24</strong></span>
                    </div>
                    <button className="admin-dashboard__logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="admin-dashboard__content">
                <div className="admin-dashboard__grid">
                    <div className="admin-dashboard__card">
                        <h3>Pending to Review</h3>
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
            </main>
        </div>
    )
}
