import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboardStyle.css";
import sluLogo from "../../assets/slu_logo.png";
import AdminDashboardCard from "../../components/admin_components/AdminDashboardCard";
import TabButton from "../../components/Tab";
import { HOST, PORT } from "../../config";
import PendingTab from "./tabs/PendingTab";
import QueueTab from "./tabs/QueueTab";
import HistoryTab from "./tabs/HistoryTab";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const [adminId, setAdminId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    printed: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get admin info from sessionStorage
    const storedAdmin = sessionStorage.getItem("admin");
    if (!storedAdmin) {
      navigate("/admin");
      return;
    }

    const admin = JSON.parse(storedAdmin);
    console.log("Stored admin creds:\n", admin);
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
      const url = status
        ? `${HOST}:${PORT}/api/admin/jobs?status=${status}`
        : `${HOST}:${PORT}/api/admin/jobs`;
      const response = await fetch(url);
      const data = await response.json();
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/api/admin/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/api/admin/jobs/${jobId}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId }),
        },
      );

      if (response.ok) {
        await fetchJobs();
        await fetchStats();
      }
    } catch (error) {
      console.error("Error approving job:", error);
    }
  };

  const handleReject = async (jobId, reason) => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/api/admin/jobs/${jobId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId, reason }),
        },
      );

      if (response.ok) {
        await fetchJobs();
        await fetchStats();
      }
    } catch (error) {
      console.error("Error rejecting job:", error);
    }
  };

  const handleMarkPrinted = async (jobId) => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/api/admin/jobs/${jobId}/printed`,
        {
          method: "PUT",
        },
      );

      if (response.ok) {
        await fetchJobs();
        await fetchStats();
      }
    } catch (error) {
      console.error("Error marking job as printed:", error);
    }
  };

  const handleViewDocument = (filename) => {
    if (filename) {
      // Open the document in a new tab ready for printing
      const url = `/api/documents/${encodeURIComponent(filename)}`;
      const printWindow = window.open(url, "_blank");

      // Wait for the document to load, then trigger print dialog
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.print();
        };
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin");
    navigate("/");
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
            <span>
              Pending Requests: <strong>{stats.pending}</strong>
            </span>
          </div>
          <button
            className="admin-dashboard__logout-btn"
            onClick={() => setShowLogoutPopup(true)}
          >
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
            <PendingTab
              printJobs={jobs}
              isLoading={loading}
              onViewDocument={handleViewDocument}
              onApprove={handleApprove}
              onReject={handleReject}
            ></PendingTab>
          )}
          {activeTab === "queue" && (
            <QueueTab
              printJobs={jobs}
              isLoading={loading}
              onViewDocument={handleViewDocument}
              onMarkPrinted={handleMarkPrinted}
            ></QueueTab>
          )}
          {activeTab === "history" && (
            <HistoryTab printJobs={jobs} isLoading={loading}></HistoryTab>
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
              <button
                onClick={handleLogout}
                className="admin-dashboard__confirm-btn"
              >
                Yes, Logout
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="admin-dashboard__cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
