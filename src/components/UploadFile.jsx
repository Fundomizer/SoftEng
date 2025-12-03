/**
 * UploadFile Component - File upload area with drag-and-drop support
 */
export default function UploadFile({
    label = "Upload Document (PDF/DOC)",
    uploadIcon = "⬆️",
    uploadText = "Click to upload or drag and drop",
    uploadSubtext = "PDF, DOC, DOCX (Max 10MB)",
    selectedFile,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileChange
}) {
    return (
        <div id="form-group">
            <label>{label}</label>
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
                    <div id="upload-icon">{selectedFile ? "✓" : uploadIcon}</div>
                    <div id="upload-text">
                        {selectedFile ? `Selected: ${selectedFile.name}` : uploadText}
                    </div>
                    <div id="upload-subtext">
                        {selectedFile
                            ? `Size: ${(selectedFile.size / 1024).toFixed(2)} KB`
                            : uploadSubtext}
                    </div>
                </label>
            </div>
        </div>
    );
}
