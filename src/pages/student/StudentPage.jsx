import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "/src/styles/StudentPageStyle.css";
import "/src/pages/login/LoginPage.jsx";

export const StudentPage = () => {
    const [activeTab, setActiveTab] = useState("upload");
    const [dragActive, setDragActive] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [numPages, setNumPages] = useState("");
    const [numCopies, setNumCopies] = useState("1");
    const [colorMode, setColorMode] = useState("bw");
    const [paperSize, setPaperSize] = useState("a4");
    const [hasImages, setHasImages] = useState("no");
    const [currentPage, setCurrentPage] = useState(1);
    const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
    const itemsPerPage = 4;
    const historyItemsPerPage = 10;
    const [notification, setNotification] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [availableTokens, setAvailableTokens] = useState(250);

    // Show notification helper
    const showNotification = (message, type = "success") => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    // Calculate token cost in real-time
    const calculateTokenCost = () => {
        if (!numPages || !numCopies) return 0;
        let costPerPage = colorMode === "bw" ? 1 : 4;
        if (hasImages === "yes") costPerPage += 1;
        return parseInt(numPages) * parseInt(numCopies) * costPerPage;
    };

    const estimatedCost = calculateTokenCost();

    // Queue items state - can be dynamically updated
    const [queueItems, setQueueItems] = useState([
        {
            id: "000049",
            title: "Print Job #000049",
            document: "Your Document",
            status: "Pending Review",
            statusClass: "pending",
            icon: "⏱",
            pages: 12,
            mode: "B&W",
            hasImages: "Yes",
            tokenCost: 24,
            submitted: "Oct 22, 09:30 AM",
            reviewed: null,
        },
        {
            id: "000050",
            title: "Print Job #000050",
            document: "Your Document",
            status: "Approved",
            statusClass: "approved",
            icon: "✓",
            pages: 8,
            mode: "B&W",
            hasImages: "No",
            tokenCost: 8,
            submitted: "Oct 21, 02:20 PM",
            reviewed: "Oct 21, 03:45 PM",
        },
        {
            id: "000051",
            title: "Print Job #000051",
            document: "Your Document",
            status: "Printed",
            statusClass: "printed",
            icon: "🖨",
            pages: 15,
            mode: "Color",
            hasImages: "Yes",
            tokenCost: 60,
            submitted: "Oct 20, 10:00 AM",
            reviewed: "Oct 20, 11:30 AM",
        },
        {
            id: "000054",
            title: "Print Job #000054",
            document: "Your Document",
            status: "Rejected",
            statusClass: "rejected",
            icon: "✕",
            pages: 10,
            mode: "B&W",
            hasImages: "Yes",
            tokenCost: 20,
            submitted: "Oct 19, 11:00 AM",
            reviewed: "Oct 19, 02:30 PM",
            rejectionReason: "Document exceeds the maximum page limit for single submission. Please split into multiple requests.",
        },
    ]);

    // History items state - can be dynamically updated
    const [historyItems, setHistoryItems] = useState([
        {
            id: "h001",
            documentTitle: "Research Paper - AI Ethics",
            documentFilename: "ai-ethics-paper.pdf",
            pages: 12,
            mode: "B&W + Images",
            tokens: 24,
            status: "Pending",
            statusClass: "status-pending",
            submitted: "Oct 22, 2025, 09:30 AM",
        },
        {
            id: "h002",
            documentTitle: "Assignment 3 - Data Structures",
            documentFilename: "assignment3.pdf",
            pages: 8,
            mode: "B&W",
            tokens: 8,
            status: "Approved",
            statusClass: "status-approved",
            submitted: "Oct 21, 2025, 02:20 PM",
        },
        {
            id: "h003",
            documentTitle: "Presentation Slides",
            documentFilename: "presentation.pdf",
            pages: 15,
            mode: "Color + Images",
            tokens: 60,
            status: "Printed",
            statusClass: "status-printed",
            submitted: "Oct 20, 2025, 10:00 AM",
        },
        {
            id: "h004",
            documentTitle: "Lab Report - Chemistry",
            documentFilename: "chem-lab-report.pdf",
            pages: 10,
            mode: "B&W + Images",
            tokens: 20,
            status: "Rejected",
            statusClass: "status-rejected",
            submitted: "Oct 19, 2025, 11:00 AM",
        },
    ]);

    const navigate = useNavigate();

    // Calculate pagination for queue
    const totalPages = Math.ceil(queueItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = queueItems.slice(startIndex, endIndex);

    // Calculate pagination for history
    const totalHistoryPages = Math.ceil(historyItems.length / historyItemsPerPage);
    const historyStartIndex = (currentHistoryPage - 1) * historyItemsPerPage;
    const historyEndIndex = historyStartIndex + historyItemsPerPage;
    const currentHistoryItems = historyItems.slice(historyStartIndex, historyEndIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Pagination handlers for history
    const handleHistoryPageChange = (page) => {
        setCurrentHistoryPage(page);
    };

    const handleHistoryPrevPage = () => {
        if (currentHistoryPage > 1) {
            setCurrentHistoryPage(currentHistoryPage - 1);
        }
    };

    const handleHistoryNextPage = () => {
        if (currentHistoryPage < totalHistoryPages) {
            setCurrentHistoryPage(currentHistoryPage + 1);
        }
    };

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
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            handleFileSelection(file);
        }
    };

    const handleFileChange = (e) => {
        // Handle file input change
        const files = e.target.files;
        if (files && files[0]) {
            handleFileSelection(files[0]);
        }
    };

    const handleFileSelection = (file) => {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
            showNotification('Please upload a PDF, DOC, or DOCX file', 'error');
            return;
        }

        if (file.size > maxSize) {
            showNotification('File size must be less than 10MB', 'error');
            return;
        }

        setSelectedFile(file);
        setDocumentName(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
        showNotification(`File "${file.name}" selected successfully`, 'success');
    };

    function updateActiveTab(activeTab) {
        setActiveTab(activeTab);
        // Reset to page 1 when switching tabs
        if (activeTab === 'queue') setCurrentPage(1);
        if (activeTab === 'history') setCurrentHistoryPage(1);
    }

    const [showPopup, setShowPopup] = useState(false);

    const handleLogout = () => {
        navigate("/");
        setShowPopup(false);
    };

    // Submit form handler
    const handleSubmit = () => {
        // Validation
        if (!selectedFile) {
            showNotification('Please upload a document', 'error');
            return;
        }
        if (!documentName.trim()) {
            showNotification('Please enter a document name', 'error');
            return;
        }
        if (!numPages || parseInt(numPages) <= 0) {
            showNotification('Please enter a valid number of pages', 'error');
            return;
        }
        if (estimatedCost > availableTokens) {
            showNotification(`Insufficient tokens! Need ${estimatedCost}, have ${availableTokens}`, 'error');
            return;
        }

        // Simulate submission
        showNotification('Print request submitted successfully!', 'success');
        
        // Deduct tokens
        setAvailableTokens(availableTokens - estimatedCost);
        
        // Reset form
        setSelectedFile(null);
        setDocumentName("");
        setNumPages("");
        setNumCopies("1");
        setColorMode("bw");
        setPaperSize("a4");
        setHasImages("no");
        
        // Switch to queue tab
        setTimeout(() => {
            setActiveTab("queue");
        }, 1000);
    };

    // Example function to add a new item to the queue
    const addToQueue = (newItem) => {
        setQueueItems([...queueItems, newItem]);
        // If adding an item and we're on the last page, stay there
        // Otherwise the new item will appear on a new page automatically
    };

    // Example function to remove an item from the queue
    const removeFromQueue = (itemId) => {
        const newItems = queueItems.filter(item => item.id !== itemId);
        setQueueItems(newItems);
        showNotification('Item removed from queue', 'info');
        // Adjust current page if needed
        const newTotalPages = Math.ceil(newItems.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
        }
    };

    // Example function to add a new item to the history
    const addToHistory = (newItem) => {
        setHistoryItems([newItem, ...historyItems]); // Add to beginning
    };

    // Example function to remove an item from the history
    const removeFromHistory = (itemId) => {
        const newItems = historyItems.filter(item => item.id !== itemId);
        setHistoryItems(newItems);
        showNotification('Item removed from history', 'info');
        // Adjust current page if needed
        const newTotalPages = Math.ceil(newItems.length / historyItemsPerPage);
        if (currentHistoryPage > newTotalPages && newTotalPages > 0) {
            setCurrentHistoryPage(newTotalPages);
        }
    };

    // Clear form
    const clearForm = () => {
        setSelectedFile(null);
        setDocumentName("");
        setNumPages("");
        setNumCopies("1");
        setColorMode("bw");
        setPaperSize("a4");
        setHasImages("no");
        showNotification('Form cleared', 'info');
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
                            <div id="tokens-count">{availableTokens}</div>
                        </div>
                    </div>
                    <button id="logout-btn" onClick={() => setShowPopup(true)}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Notification Toast */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}

            <div id="stats-container">
                <div id="stat-card" className="stat-card-pending">
                    <div id="stat-label">Queue Pending</div>
                    <div id="stat-value">3</div>
                    <span id="stat-badge review">Review</span>
                </div>
                <div id="stat-card" className="stat-card-approved">
                    <div id="stat-label">Queue Approved</div>
                    <div id="stat-value">3</div>
                    <span id="stat-badge ready">Ready</span>
                </div>
                <div id="stat-card" className="stat-card-completed">
                    <div id="stat-label">Total Completed</div>
                    <div id="stat-value">3</div>
                    <span id="stat-badge done">Done</span>
                </div>
                <div id="stat-card" className="stat-card-rejected">
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

                    {/* Token Cost Estimator */}
                    {estimatedCost > 0 && (
                        <div className="token-estimator">
                            <div className="estimator-content">
                                <span className="estimator-label">Estimated Cost:</span>
                                <span className="estimator-value">{estimatedCost} tokens</span>
                            </div>
                            {estimatedCost > availableTokens && (
                                <div className="estimator-warning">
                                    ⚠️ Insufficient tokens! You need {estimatedCost - availableTokens} more tokens.
                                </div>
                            )}
                        </div>
                    )}

                    <div id="form-group">
                        <label>Upload Document (PDF/DOC)</label>
                        <div
                            className={`upload-area ${dragActive ? "drag-active" : ""} ${selectedFile ? "has-file" : ""}`}
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
                                <div id="upload-icon">{selectedFile ? "✓" : "⬆️"}</div>
                                <div id="upload-text">
                                    {selectedFile ? `Selected: ${selectedFile.name}` : "Click to upload or drag and drop"}
                                </div>
                                <div id="upload-subtext">
                                    {selectedFile ? `Size: ${(selectedFile.size / 1024).toFixed(2)} KB` : "PDF, DOC, DOCX (Max 10MB)"}
                                </div>
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div id="form-group">
                            <label>Number of Pages</label>
                            <input
                                type="number"
                                id="text-input"
                                placeholder="Enter number of pages"
                                value={numPages}
                                onChange={(e) => setNumPages(e.target.value)}
                                min="1"
                            />
                        </div>

                        <div id="form-group">
                            <label>Number of Copies</label>
                            <input
                                type="number"
                                id="text-input"
                                placeholder="Enter number of copies"
                                value={numCopies}
                                onChange={(e) => setNumCopies(e.target.value)}
                                min="1"
                            />
                        </div>
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

                    <div className="form-actions">
                        <button id="submit-btn" onClick={handleSubmit}>
                            <span id="submit-icon">⬆️</span>
                            Submit Print Request
                        </button>
                        <button id="clear-btn" onClick={clearForm}>
                            <span>🗑️</span>
                            Clear Form
                        </button>
                    </div>
                </div>

                <div className={activeTab === "queue" ? "content" : "hidden"}>
                    <div id="section-header">
                        <h2>Print Queue</h2>
                        <div className="section-info">
                            <span>Total items: {queueItems.length}</span>
                            {queueItems.length > 0 && (
                                <span>• Showing {startIndex + 1}-{Math.min(endIndex, queueItems.length)} of {queueItems.length}</span>
                            )}
                        </div>
                    </div>
                    <p id="section-subtitle">
                        All pending print requests (Anonymized for privacy)
                    </p>

                    {currentItems.map((item) => (
                        <div key={item.id} id={`job-${item.id}`} className="print-job-card">
                            <div className="job-header">
                                <div className="job-title">
                                    <span className="job-icon">{item.icon}</span>
                                    <div className="job-info">
                                        <h3>{item.title}</h3>
                                        <p className="job-document">{item.document}</p>
                                    </div>
                                </div>
                                <span className={`job-status ${item.statusClass}`}>{item.status}</span>
                            </div>
                            <div className="job-details">
                                <div className="detail-item">
                                    <span className="detail-label">Pages</span>
                                    <span className="detail-value">{item.pages}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Mode</span>
                                    <span className="detail-value">{item.mode}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Images</span>
                                    <span className="detail-value">{item.hasImages}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Token Cost</span>
                                    <span className="detail-value">{item.tokenCost}</span>
                                </div>
                            </div>
                            <div className="job-footer">
                                Submitted: {item.submitted}
                                {item.reviewed && ` • Reviewed: ${item.reviewed}`}
                            </div>
                            {item.rejectionReason && (
                                <div className="rejection-reason">
                                    Rejection reason: {item.rejectionReason}
                                </div>
                            )}
                        </div>
                    ))}

                    {queueItems.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No items in queue
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div id="pagination">
                            <button 
                                id="page-prev" 
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                            >
                                ‹ Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    id={`page-${index + 1}`}
                                    className={currentPage === index + 1 ? 'active' : ''}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button 
                                id="page-next"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next ›
                            </button>
                        </div>
                    )}
                </div>

                <div className={activeTab === "history" ? "content" : "hidden"}>
                    <h3 className="section-subtitle">Print History</h3>
                    <p className="section-description">
                        Complete history of all your print requests
                    </p>

                    {/* Desktop table view */}
                    <div className="table-wrapper desktop-only">
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
                                {currentHistoryItems.map((item) => (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="document-cell">
                                                <span className="document-title">
                                                    {item.documentTitle}
                                                </span>
                                                <span className="document-filename">{item.documentFilename}</span>
                                            </div>
                                        </td>
                                        <td>{item.pages}</td>
                                        <td>{item.mode}</td>
                                        <td>{item.tokens}</td>
                                        <td>
                                            <span className={`status-badge ${item.statusClass}`}>{item.status}</span>
                                        </td>
                                        <td>{item.submitted}</td>
                                        <td>
                                            {(item.status === "Pending" || item.status === "Approved") ? (
                                                <button 
                                                    className="cancel-btn"
                                                    onClick={() => removeFromHistory(item.id)}
                                                >
                                                    Cancel
                                                </button>
                                            ) : (
                                                <span className="not-cancelable">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile card view */}
                    <div className="history-cards mobile-only">
                        {currentHistoryItems.map((item) => (
                            <div key={item.id} className="history-card">
                                <div className="history-card-header">
                                    <div>
                                        <div className="history-document-title">{item.documentTitle}</div>
                                        <div className="history-document-filename">{item.documentFilename}</div>
                                    </div>
                                    <span className={`status-badge ${item.statusClass}`}>{item.status}</span>
                                </div>
                                <div className="history-card-details">
                                    <div className="history-detail-item">
                                        <span className="history-detail-label">Pages:</span>
                                        <span className="history-detail-value">{item.pages}</span>
                                    </div>
                                    <div className="history-detail-item">
                                        <span className="history-detail-label">Mode:</span>
                                        <span className="history-detail-value">{item.mode}</span>
                                    </div>
                                    <div className="history-detail-item">
                                        <span className="history-detail-label">Tokens:</span>
                                        <span className="history-detail-value">{item.tokens}</span>
                                    </div>
                                </div>
                                <div className="history-card-footer">
                                    <div className="history-submitted">{item.submitted}</div>
                                    {(item.status === "Pending" || item.status === "Approved") && (
                                        <button 
                                            className="cancel-btn"
                                            onClick={() => removeFromHistory(item.id)}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {historyItems.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                            No history items
                        </div>
                    )}

                    {totalHistoryPages > 1 && (
                        <div id="pagination">
                            <button 
                                id="page-prev" 
                                onClick={handleHistoryPrevPage}
                                disabled={currentHistoryPage === 1}
                            >
                                ‹ Previous
                            </button>
                            {[...Array(totalHistoryPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    id={`page-${index + 1}`}
                                    className={currentHistoryPage === index + 1 ? 'active' : ''}
                                    onClick={() => handleHistoryPageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button 
                                id="page-next"
                                onClick={handleHistoryNextPage}
                                disabled={currentHistoryPage === totalHistoryPages}
                            >
                                Next ›
                            </button>
                        </div>
                    )}
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
