import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/StudentPageStyle.css";
import "/src/pages/login/LoginPage.jsx";

export const StudentPage = () => {
    const [activeTab, setActiveTab] = useState("upload");
    const [dragActive, setDragActive] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [numPages, setNumPages] = useState("");
    const [colorMode, setColorMode] = useState("bw");
    const [paperSize, setPaperSize] = useState("a4");
    const [hasImages, setHasImages] = useState("no");

    const navigate = useNavigate();

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        // Handle the dropped files here
    };

    const handleFileChange = (e) => {
        // Handle file input change
        const files = e.target.files;
        // Process files here
    };

    function updateActiveTab(activeTab) {
        setActiveTab(activeTab);
    }

    const [showPopup, setShowPopup] = useState(false);

    const handleLogout = () => {
        navigate("login");
        setShowPopup(false);
    };

    return (
        <div id="upload-page">
            <header id="header">
                <div id="header-left">
                    <div id="logo">
                        <img src="/src/assets/slu_logo.png" alt="SLU-logo" />
                    </div>
                    <div id="header-text">
                        <h1>Get Faxed: Student Printing Service Portal</h1>
                        <p>User</p>
                    </div>
                </div>
                <div id="header-right">
                    <div id="tokens-badge">
                        <span id="token-icon">🪙</span>
                        <div>
                            <div id="tokens-label">Available Tokens</div>
                            <div id="tokens-count">250</div>
                        </div>
                    </div>
                    <button id="logout-btn" onClick={() => setShowPopup(true)}>
                        Logout
                    </button>
                </div>
            </header>

            <div id="stats-container">
                <div id="stat-card">
                    <div id="stat-label">Queue Pending</div>
                    <div id="stat-value">3</div>
                    <span id="stat-badge review">Review</span>
                </div>
                <div id="stat-card">
                    <div id="stat-label">Queue Approved</div>
                    <div id="stat-value">3</div>
                    <span id="stat-badge ready">Ready</span>
                </div>
                <div id="stat-card">
                    <div id="stat-label">Total Completed</div>
                    <div id="stat-value">3</div>
                    <span id="stat-badge done">Done</span>
                </div>
                <div id="stat-card">
                    <div id="stat-label">Total Rejected</div>
                    <div id="stat-value">2</div>
                    <span id="stat-badge denied">Denied</span>
                </div>
            </div>

            <div id="tabs">
                <button
                    id="tab-btn"
                    className={activeTab === "upload" ? "active" : ""}
                    onClick={() => {
                        setActiveTab("upload");
                        updateActiveTab("upload");
                    }}
                >
                    <span id="tab-icon">⬆️</span>
                    Upload
                </button>
                <button
                    id="tab-btn"
                    className={activeTab === "queue" ? "active" : ""}
                    onClick={() => setActiveTab("queue")}
                >
                    <span id="tab-icon">🖨️</span>
                    Queue
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

            <div id="content">
                <div className={activeTab === "upload" ? "content" : "hidden"}>
                    <h2>Submit New Print Request</h2>
                    <p id="form-description">
                        Upload your document and provide print job details
                    </p>

                    <div id="form-group">
                        <label>Upload Document (PDF/DOC)</label>
                        <div
                            className={`upload-area ${dragActive ? "drag-active" : ""}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            <input
                                type="file"
                                id="file-upload"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <label htmlFor="file-upload" id="upload-label">
                                <div id="upload-icon">⬆️</div>
                                <div id="upload-text">Click to upload or drag and drop</div>
                                <div id="upload-subtext">PDF, DOC, DOCX</div>
                            </label>
                        </div>
                    </div>

                    <div id="form-group">
                        <label>Document Name</label>
                        <input
                            type="text"
                            id="text-input"
                            placeholder="e.g., Assignment 1 - Introduction to CS"
                            value={documentName}
                            onChange={(e) => setDocumentName(e.target.value)}
                        />
                    </div>

                    <div id="form-group">
                        <label>Number of Pages</label>
                        <input
                            type="number"
                            id="text-input"
                            placeholder="Enter number of pages"
                            value={numPages}
                            onChange={(e) => setNumPages(e.target.value)}
                        />
                    </div>

                    <div id="form-group">
                        <label>Color Mode</label>
                        <div id="option-grid two-col">
                            <button
                                id="option-btn"
                                className={colorMode === "bw" ? "selected" : ""}
                                onClick={() => setColorMode("bw")}
                            >
                                <div id="option-title">Black & White</div>
                                <div id="option-cost">1 token/page</div>
                            </button>
                            <button
                                id="option-btn"
                                className={colorMode === "color" ? "selected" : ""}
                                onClick={() => setColorMode("color")}
                            >
                                <div id="option-title">Color</div>
                                <div id="option-cost">4 tokens/page</div>
                            </button>
                        </div>
                    </div>

                    <div id="form-group">
                        <label>Paper Size</label>
                        <div id="option-grid three-col">
                            <button
                                id="option-btn"
                                className={paperSize === "a4" ? "selected" : ""}
                                onClick={() => setPaperSize("a4")}
                            >
                                <div id="option-title">A4</div>
                                <div id="option-subtitle">210×297mm</div>
                            </button>
                            <button
                                id="option-btn"
                                className={paperSize === "letter" ? "selected" : ""}
                                onClick={() => setPaperSize("letter")}
                            >
                                <div id="option-title">Letter</div>
                                <div id="option-subtitle">8.5×11in</div>
                            </button>
                            <button
                                id="option-btn"
                                className={paperSize === "legal" ? "selected" : ""}
                                onClick={() => setPaperSize("legal")}
                            >
                                <div id="option-title">Legal</div>
                                <div id="option-subtitle">8.5×14in</div>
                            </button>
                        </div>
                    </div>

                    <div id="form-group">
                        <label>Contains Images?</label>
                        <div id="option-grid two-col">
                            <button
                                id="option-btn"
                                className={hasImages === "no" ? "selected" : ""}
                                onClick={() => setHasImages("no")}
                            >
                                <div id="option-title">No Images</div>
                            </button>
                            <button
                                id="option-btn"
                                className={hasImages === "yes" ? "selected" : ""}
                                onClick={() => setHasImages("yes")}
                            >
                                <div id="option-title">Has Images</div>
                                <div id="option-cost">+1 token/page</div>
                            </button>
                        </div>
                    </div>

                    <button id="submit-btn">
                        <span id="submit-icon">⬆️</span>
                        Submit Print Request
                    </button>
                </div>

                <div className={activeTab === "queue" ? "content" : "hidden"}>
                    <div id="section-header">
                        <h2>Print Queue</h2>
                    </div>
                    <p id="section-subtitle">
                        All pending print requests (Anonymized for privacy)
                    </p>

                    <div id="job-000049" class="print-job-card">
                        <div class="job-header">
                            <div class="job-title">
                                <span class="job-icon">⏱</span>
                                <div class="job-info">
                                    <h3>Print Job #000049</h3>
                                    <p class="job-document">Your Document</p>
                                </div>
                            </div>
                            <span class="job-status">Pending Review</span>
                        </div>
                        <div class="job-details">
                            <div class="detail-item">
                                <span class="detail-label">Pages</span>
                                <span class="detail-value">12</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mode</span>
                                <span class="detail-value">B&W</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Images</span>
                                <span class="detail-value">Yes</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Token Cost</span>
                                <span class="detail-value">24</span>
                            </div>
                        </div>
                        <div class="job-footer">Submitted: Oct 22, 09:30 AM</div>
                    </div>

                    <div id="job-000050" class="print-job-card">
                        <div class="job-header">
                            <div class="job-title">
                                <span class="job-icon">✓</span>
                                <div class="job-info">
                                    <h3>Print Job #000050</h3>
                                    <p class="job-document">Your Document</p>
                                </div>
                            </div>
                            <span class="job-status">Approved</span>
                        </div>
                        <div class="job-details">
                            <div class="detail-item">
                                <span class="detail-label">Pages</span>
                                <span class="detail-value">8</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mode</span>
                                <span class="detail-value">B&W</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Images</span>
                                <span class="detail-value">No</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Token Cost</span>
                                <span class="detail-value">8</span>
                            </div>
                        </div>
                        <div class="job-footer">
                            Submitted: Oct 21, 02:20 PM • Reviewed: Oct 21, 03:45 PM
                        </div>
                    </div>

                    <div id="job-000051" class="print-job-card">
                        <div class="job-header">
                            <div class="job-title">
                                <span class="job-icon">🖨</span>
                                <div class="job-info">
                                    <h3>Print Job #000051</h3>
                                    <p class="job-document">Your Document</p>
                                </div>
                            </div>
                            <span class="job-status">Printed</span>
                        </div>
                        <div class="job-details">
                            <div class="detail-item">
                                <span class="detail-label">Pages</span>
                                <span class="detail-value">15</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mode</span>
                                <span class="detail-value">Color</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Images</span>
                                <span class="detail-value">Yes</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Token Cost</span>
                                <span class="detail-value">60</span>
                            </div>
                        </div>
                        <div class="job-footer">
                            Submitted: Oct 20, 10:00 AM • Reviewed: Oct 20, 11:30 AM
                        </div>
                    </div>

                    <div id="job-000054" class="print-job-card">
                        <div class="job-header">
                            <div class="job-title">
                                <span class="job-icon">✕</span>
                                <div class="job-info">
                                    <h3>Print Job #000054</h3>
                                    <p class="job-document">Your Document</p>
                                </div>
                            </div>
                            <span class="job-status">Rejected</span>
                        </div>
                        <div class="job-details">
                            <div class="detail-item">
                                <span class="detail-label">Pages</span>
                                <span class="detail-value">10</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Mode</span>
                                <span class="detail-value">B&W</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Images</span>
                                <span class="detail-value">Yes</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Token Cost</span>
                                <span class="detail-value">20</span>
                            </div>
                        </div>
                        <div class="job-footer">
                            Submitted: Oct 19, 11:00 AM • Reviewed: Oct 19, 02:30 PM
                        </div>
                        <div class="rejection-reason">
                            Rejection reason: Document exceeds the maximum page limit for
                            single submission. Please split into multiple requests.
                        </div>
                    </div>

                    <div id="pagination">
                        <button id="page-prev" disabled>
                            ‹ Previous
                        </button>
                        <button id="page-1">1</button>
                        <button id="page-2">2</button>
                        <button id="page-next">Next ›</button>
                    </div>
                </div>

                <div className={activeTab === "history" ? "content" : "hidden"}>
                    <h3 class="section-subtitle">Print History</h3>
                    <p class="section-description">
                        Complete history of all your print requests
                    </p>

                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>Document</th>
                                    <th>Pages</th>
                                    <th>Mode</th>
                                    <th>Tokens</th>
                                    <th>Status</th>
                                    <th>Submitted</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="document-cell">
                                            <span class="document-title">
                                                Research Paper - AI Ethics
                                            </span>
                                            <span class="document-filename">ai-ethics-paper.pdf</span>
                                        </div>
                                    </td>
                                    <td>12</td>
                                    <td>B&W + Images</td>
                                    <td>24</td>
                                    <td>
                                        <span class="status-badge status-pending">Pending</span>
                                    </td>
                                    <td>Oct 22, 2025, 09:30 AM</td>
                                    <td>
                                        <button class="delete-btn">🗑️</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="document-cell">
                                            <span class="document-title">
                                                Assignment 3 - Data Structures
                                            </span>
                                            <span class="document-filename">assignment3.pdf</span>
                                        </div>
                                    </td>
                                    <td>8</td>
                                    <td>B&W</td>
                                    <td>8</td>
                                    <td>
                                        <span class="status-badge status-approved">Approved</span>
                                    </td>
                                    <td>Oct 21, 2025, 02:20 PM</td>
                                    <td>
                                        <button class="delete-btn">🗑️</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="document-cell">
                                            <span class="document-title">Presentation Slides</span>
                                            <span class="document-filename">presentation.pdf</span>
                                        </div>
                                    </td>
                                    <td>15</td>
                                    <td>Color + Images</td>
                                    <td>60</td>
                                    <td>
                                        <span class="status-badge status-printed">Printed</span>
                                    </td>
                                    <td>Oct 20, 2025, 10:00 AM</td>
                                    <td>
                                        <button class="delete-btn">🗑️</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="document-cell">
                                            <span class="document-title">Lab Report - Chemistry</span>
                                            <span class="document-filename">chem-lab-report.pdf</span>
                                        </div>
                                    </td>
                                    <td>10</td>
                                    <td>B&W + Images</td>
                                    <td>20</td>
                                    <td>
                                        <span class="status-badge status-rejected">Rejected</span>
                                    </td>
                                    <td>Oct 19, 2025, 11:00 AM</td>
                                    <td>
                                        <button class="delete-btn">🗑️</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div id="pagination">
                        <button id="page-prev" disabled>
                            ‹ Previous
                        </button>
                        <button id="page-1">1</button>
                        <button id="page-2">2</button>
                        <button id="page-next">Next ›</button>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="overlay">
                    <div className="popup">
                        <p>Are you sure you want to logout?</p>
                        <button onClick={handleLogout} className="confirm">
                            Yes
                        </button>
                        <button onClick={() => setShowPopup(false)} className="cancel">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
