import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sluLogo from "../../assets/slu_logo.png"
import "../../styles/StudentPageStyle.css";
import StatCard from "../../components/StudentComponents/StatCard";
import TabButton from "../../components/Tab";
import InputFormGroup from "../../components/StudentComponents/FormGroup";
import ButtonFormGroup from "../../components/StudentComponents/ButtonFormGroup";
import UploadFile from "../../components/UploadFile";
import PrintJobCard from "../../components/StudentComponents/PrintJobCard";
import HistoryItemDesktop from "../../components/StudentComponents/HistoryItemDesktop";
import HistoryItemMobile from "../../components/StudentComponents/HistoryItemMobile";
import { HOST, PORT } from "../../config";

export const StudentPage = () => {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState(null);
    const [studentName, setStudentName] = useState("User");
    const [activeTab, setActiveTab] = useState("upload");
    const [dragActive, setDragActive] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [numPages, setNumPages] = useState(1);
    const [numCopies, setNumCopies] = useState(1);
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
    const [queueItems, setQueueItems] = useState([]);
    const [historyItems, setHistoryItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch student data on mount
    useEffect(() => {
        // Get student info from sessionStorage
        const storedStudent = sessionStorage.getItem('student');
        if (!storedStudent) {
            navigate('/');
            return;
        }

        const student = JSON.parse(storedStudent);

        setStudentId(student.id);
        setStudentName(student.name);
        setAvailableTokens(student.tokens);

        // Fetch print jobs
        fetchPrintJobs(student.id);

        // Auto-refresh every 30 seconds
        const refreshInterval = setInterval(() => {
            fetchPrintJobs(student.id);
        }, 5000);

        return () => clearInterval(refreshInterval);
    }, [navigate]);

    // Fetch print jobs from API
    const fetchPrintJobs = async (id) => {
        try {
            const response = await fetch(`${HOST}:${PORT}/api/student/${id}/jobs`);
            const jobs = await response.json();

            // Transform jobs for display
            const transformedJobs = jobs.map(job => ({
                id: job.job_number,
                title: `Print Job #${job.job_number}`,
                document: 'Your Document', // Anonymous in queue
                documentTitle: job.document_name,
                documentFilename: job.document_filename,
                status: job.status.charAt(0).toUpperCase() + job.status.slice(1),
                statusClass: `status-${job.status}`,
                icon: getStatusIcon(job.status),
                pages: job.num_pages,
                mode: job.color_mode === 'bw' ? 'B&W' : (job.color_mode === 'color' ? 'Color' : job.color_mode),
                hasImages: job.has_images === 'yes' ? 'Yes' : 'No',
                tokens: job.token_cost,
                tokenCost: job.token_cost,
                submitted: new Date(job.submitted_at).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }),
                reviewed: job.reviewed_at ? new Date(job.reviewed_at).toLocaleString('en-US', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : null,
                rejectionReason: job.rejection_reason
            }));

            setQueueItems(transformedJobs);
            setHistoryItems(transformedJobs);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            showNotification('Failed to load print jobs', 'error');
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: '⏱',
            approved: '✓',
            printed: '🖨',
            rejected: '✕'
        };
        return icons[status] || '?';
    };

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

    // Reset pagination when switching tabs
    useEffect(() => {
        if (activeTab === 'queue') setCurrentPage(1);
        if (activeTab === 'history') setCurrentHistoryPage(1);
    }, [activeTab]);

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
    const confirmSubmission = async () => {
        if (!policyAgreed) {
            showNotification('Please agree to the policies to continue', 'error');
            return;
        }

        try {
            // Create FormData to send file and other data
            const formData = new FormData();
            formData.append('document', selectedFile);
            formData.append('documentName', documentName);
            formData.append('numPages', parseInt(numPages));
            formData.append('numCopies', parseInt(numCopies));
            formData.append('colorMode', colorMode);
            formData.append('paperSize', paperSize);
            formData.append('hasImages', hasImages);
            formData.append('tokenCost', estimatedCost);

            const response = await fetch(`${HOST}:${PORT}/api/student/${studentId}/jobs`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
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

                // Refresh jobs
                await fetchPrintJobs(studentId);

                // Switch to queue tab
                setTimeout(() => {
                    setActiveTab("queue");
                }, 1000);
            } else {
                showNotification(data.error || 'Failed to submit print request', 'error');
            }
        } catch (error) {
            console.error('Submit error:', error);
            showNotification('Failed to submit print request', 'error');
        }
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

    // Cancel/Reject a print job from history
    const removeFromHistory = async (itemId) => {
        if (!studentId) {
            showNotification('Student ID not found. Please login again.', 'error');
            return;
        }

        if (!window.confirm('Are you sure you want to cancel this print job? Your tokens will be refunded.')) {
            return;
        }

        try {
            // Call API to reject the job
            const response = await fetch(`${HOST}:${PORT}/api/student/jobs/${itemId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    studentId,
                    reason: 'Cancelled by student'
                })
            });

            const data = await response.json();

            if (response.ok) {
                showNotification('Print job cancelled and tokens refunded', 'success');

                // Update the local state immediately
                setQueueItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId
                            ? { ...item, status: 'Rejected', statusClass: 'status-rejected', icon: '✕' }
                            : item
                    )
                );

                setHistoryItems(prevItems =>
                    prevItems.map(item =>
                        item.id === itemId
                            ? { ...item, status: 'Rejected', statusClass: 'status-rejected', icon: '✕' }
                            : item
                    )
                );

                // Refetch tokens as they should be refunded
                const tokensResponse = await fetch(`${HOST}:${PORT}/api/student/${studentId}/tokens`);
                const tokensData = await tokensResponse.json();
                setAvailableTokens(tokensData.tokens);

                // Refresh jobs from server to ensure consistency
                await fetchPrintJobs(studentId);
            } else {
                showNotification(data.error || 'Failed to cancel print job', 'error');
            }
        } catch (error) {
            console.error('Cancel job error:', error);
            showNotification('Failed to cancel print job. Please try again.', 'error');
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
                        <img src={sluLogo} alt="SLU-logo" />
                    </div>
                    <div id="header-text">
                        <h1>Get Faxed: Student Printing Service Portal</h1>
                        <p>{studentName}</p>
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
                    label="Queue Pending" value={queueItems.filter(job => job.status === 'Pending').length} badge={"Review"} type={"stat-card-pending"}
                />
                <StatCard
                    label="Queue Approved" value={queueItems.filter(job => job.status === 'Approved').length} badge="Ready" type="stat-card-approved"
                />
                <StatCard
                    label="Total Completed" value={queueItems.filter(job => job.status === 'Printed').length} badge="Done" type="stat-card-completed"
                />

                <StatCard
                    label="Total Rejected" value={queueItems.filter(job => job.status === 'Rejected').length} badge="Denied" type="stat-card-rejected"
                />
            </div>

            <div id="tabs">
                <TabButton
                    label="Upload"
                    icon="⬆️"
                    tabKey="upload"
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
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
