import React, { useState } from "react";
import "/src/styles/UploadPage.css";

export const UploadPage = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [dragActive, setDragActive] = useState(false);
    const [documentName, setDocumentName] = useState('');
    const [numPages, setNumPages] = useState('');
    const [colorMode, setColorMode] = useState('bw');
    const [paperSize, setPaperSize] = useState('a4');
    const [hasImages, setHasImages] = useState('no');

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

    return (
        <div id="upload-page">
            <header id="header">
                <div id="header-left">
                    <div id="logo">
                        <img src="/src/assets/slu_logo.png" alt="SLU-logo" />
                    </div>
                    <div id="header-text">
                        <h1>Student Printing Service Portal</h1>
                        <p>Dyslexcic Pares</p>
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
                    <button id="logout-btn">Logout</button>
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
                    className={activeTab === 'upload' ? 'active' : ''}
                    onClick={() => setActiveTab('upload')}
                >
                    <span id="tab-icon">⬆️</span>
                    Upload
                </button>
                <button
                    id="tab-btn"
                    className={activeTab === 'queue' ? 'active' : ''}
                    onClick={() => setActiveTab('queue')}
                >
                    <span id="tab-icon">🖨️</span>
                    Queue
                </button>
                <button
                    id="tab-btn"
                    className={activeTab === 'history' ? 'active' : ''}
                    onClick={() => setActiveTab('history')}
                >
                    <span id="tab-icon">🕐</span>
                    History
                </button>
            </div>

            <div id="content">
                <div id="form-section">
                    <h2>Submit New Print Request</h2>
                    <p id="form-description">Upload your document and provide print job details</p>

                    <div id="form-group">
                        <label>Upload Document (PDF/DOC)</label>
                        <div
                            id={`upload-area ${dragActive ? 'drag-active' : ''}`}
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
                                style={{ display: 'none' }}
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
                                className={colorMode === 'bw' ? 'selected' : ''}
                                onClick={() => setColorMode('bw')}
                            >
                                <div id="option-title">Black & White</div>
                                <div id="option-cost">1 token/page</div>
                            </button>
                            <button
                                id="option-btn"
                                className={colorMode === 'color' ? 'selected' : ''}
                                onClick={() => setColorMode('color')}
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
                                className={paperSize === 'a4' ? 'selected' : ''}
                                onClick={() => setPaperSize('a4')}
                            >
                                <div id="option-title">A4</div>
                                <div id="option-subtitle">210×297mm</div>
                            </button>
                            <button
                                id="option-btn"
                                className={paperSize === 'letter' ? 'selected' : ''}
                                onClick={() => setPaperSize('letter')}
                            >
                                <div id="option-title">Letter</div>
                                <div id="option-subtitle">8.5×11in</div>
                            </button>
                            <button
                                id="option-btn"
                                className={paperSize === 'legal' ? 'selected' : ''}
                                onClick={() => setPaperSize('legal')}
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
                                className={hasImages === 'no' ? 'selected' : ''}
                                onClick={() => setHasImages('no')}
                            >
                                <div id="option-title">No Images</div>
                            </button>
                            <button
                                id="option-btn"
                                className={hasImages === 'yes' ? 'selected' : ''}
                                onClick={() => setHasImages('yes')}
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
            </div>
        </div>
    );
};
