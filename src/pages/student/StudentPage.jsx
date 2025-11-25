import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import "/src/styles/StudentPageStyle.css";
import "/src/pages/login/LoginPage.jsx";
import StatCard from "../../components/StudentComponents/StatCard";
import TabButton from "../../components/Tab";
import InputFormGroup from "../../components/StudentComponents/FormGroup";
import ButtonFormGroup from "../../components/StudentComponents/ButtonFormGroup";
import UploadFile from "../../components/UploadFile";
import PrintJobCard from "../../components/StudentComponents/PrintJobCard";
import HistoryItemDesktop from "../../components/StudentComponents/HistoryItemDesktop";
import HistoryItemMobile from "../../components/StudentComponents/HistoryItemMobile";

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
    const [showPolicyModal, setShowPolicyModal] = useState(false);
    const [policyAgreed, setPolicyAgreed] = useState(false);

    const handleLogout = () => {
        navigate("/");
        setShowPopup(false);
    };

    // Submit form handler - shows policy modal first
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

        // Show policy modal before submission
        setPolicyAgreed(false);
        setShowPolicyModal(true);
    };

    // Actually submit the form after policy agreement
    const confirmSubmission = () => {
        if (!policyAgreed) {
            showNotification('Please agree to the policies to continue', 'error');
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

        // Close modal
        setShowPolicyModal(false);
        setPolicyAgreed(false);

        // Switch to queue tab
        setTimeout(() => {
            setActiveTab("queue");
        }, 1000);
    };

    // Cancel policy modal
    const cancelSubmission = () => {
        setShowPolicyModal(false);
        setPolicyAgreed(false);
        showNotification('Print request cancelled', 'info');
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
                <StatCard
                    label="Queue Pending" value={3} badge={"Review"} type={"stat-card-pending"}
                />
                <StatCard
                    label="Queue Approved" value={3} badge="Ready" type="stat-card-approved"
                />
                <StatCard
                    label="Total Completed" value={3} badge="Done" type="stat-card-completed"
                />

                <StatCard
                    label="Total Rejected" value={2} badge="Denied" type="stat-card-rejected"
                />
            </div>

            <div id="tabs">
                <TabButton
                    label="Upload"
                    icon="⬆️"
                    tabKey="upload"
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    updateActiveTab={updateActiveTab}
                />

                <TabButton
                    label="Queue"
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

                    <UploadFile
                        label="Upload Document (PDF/DOC)"
                        uploadIcon="⬆️"
                        uploadText="Click to upload or drag and drop"
                        uploadSubtext="PDF, DOC, DOCX (Max 10MB)"
                        selectedFile={selectedFile}
                        dragActive={dragActive}
                        handleDrag={handleDrag}
                        handleDrop={handleDrop}
                        handleFileChange={handleFileChange}
                    />


                    <InputFormGroup
                        type="text"
                        label="Document Name"
                        placeholder="e.g., Assignment 1 - Introduction to CS"
                        value={documentName}
                        onChange={(e) => setDocumentName(e.target.value)}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <InputFormGroup
                            type="number"
                            label="Number of Pages"
                            placeholder="Enter number of pages"
                            value={numPages}
                            onChange={(e) => setNumPages(e.target.value)}
                        />

                        <InputFormGroup
                            type="number"
                            label="Number of Copies"
                            placeholder="Enter number of copies"
                            value={numCopies}
                            onChange={(e) => setNumCopies(e.target.value)}
                        />
                    </div>

                    <ButtonFormGroup
                        label="Color Mode"
                        options={[
                            { value: "bw", title: "Black & White", subtitle: "1 token/page" },
                            { value: "color", title: "Color", subtitle: "4 tokens/page" }
                        ]}
                        selected={colorMode}
                        onChange={setColorMode}
                        columns={2}
                    />

                    <ButtonFormGroup
                        label="Paper Size"
                        options={[
                            { value: "a4", title: "A4", subtitle: "210×297mm" },
                            { value: "letter", title: "Letter", subtitle: "8.5×11in" },
                            { value: "legal", title: "Legal", subtitle: "8.5×14in" }
                        ]}
                        selected={paperSize}
                        onChange={setPaperSize}
                        columns={3}
                    />

                    <ButtonFormGroup
                        label="Contains Images?"
                        options={[
                            { value: "no", title: "No Images" },
                            { value: "yes", title: "Has Images", subtitle: "+1 token/page" }
                        ]}
                        selected={hasImages}
                        onChange={setHasImages}
                        columns={2}
                    />

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
                        <PrintJobCard key={item.id} printJob={item} />
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
                                    <HistoryItemDesktop key={item.id} item={item} removeFromHistory={removeFromHistory} />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile card view */}
                    <div className="history-cards mobile-only">
                        {currentHistoryItems.map((item) => (
                            <HistoryItemMobile key={item.id} item={item} removeFromHistory={removeFromHistory} />
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

            {showPolicyModal && (
                <div className="overlay policy-overlay">
                    <div className="popup policy-modal">
                        <h2 className="policy-title">Computer Laboratories Printing Policies Agreement</h2>

                        <div className="policy-content">
                            <div className="policy-section">
                                <h3>General Policies</h3>
                                <ul>
                                    <li>Printing is for <strong>academic use only</strong> and requires student-provided paper.</li>
                                    <li>Each student is given <strong>500 tokens per semester</strong>; unused tokens do not carry over.</li>
                                    <li>Only <strong>school-related documents</strong> may be printed.</li>
                                    <li>Printing is on a <strong>DIY basis</strong>; follow the queue and honor system.</li>
                                </ul>
                            </div>

                            <div className="policy-section">
                                <h3>Token Cost per Page</h3>
                                <ul>
                                    <li><strong>Black & White:</strong> 1 token/page</li>
                                    <li><strong>Color:</strong> 10 tokens/page</li>
                                    <li><strong>Black & White (image):</strong> 10 tokens/page</li>
                                    <li><strong>Color (image):</strong> 15 tokens/page</li>
                                    <li className="policy-note"><em>"Image print" = 60% or more of a page covered by images.</em></li>
                                </ul>
                            </div>

                            <div className="policy-section">
                                <h3>Important Reminders</h3>
                                <ul>
                                    <li>Tokens are <strong>non-transferable</strong> and monitored by the Laboratory Custodian.</li>
                                    <li>Printing requires an <strong>official print job voucher</strong> (no voucher = no print).</li>
                                    <li><strong>Dishonesty</strong> (e.g., undeclared extra printing) may result in loss of all print tokens.</li>
                                </ul>
                            </div>

                            <div className="policy-agreement">
                                <label className="checkbox-container">
                                    <input
                                        type="checkbox"
                                        checked={policyAgreed}
                                        onChange={(e) => setPolicyAgreed(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="agreement-text">
                                        By agreeing, you acknowledge you have read and understood the Computer Laboratories Printing Policies and agree to comply.
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="policy-actions">
                            <button
                                onClick={confirmSubmission}
                                className="confirm"
                                disabled={!policyAgreed}
                            >
                                I Agree & Submit
                            </button>
                            <button onClick={cancelSubmission} className="cancel">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
