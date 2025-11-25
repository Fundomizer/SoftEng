/**
 * UploadFile Component
 *
 * Renders a file upload area with drag-and-drop support and customizable labels/icons.
 * Displays selected file name and size when a file is chosen.
 *
 * Props:
 * - label {string}        : Label displayed above the upload area.
 * - uploadIcon {string}   : Icon shown in the upload area (default "⬆️").
 * - uploadText {string}   : Default text shown when no file is selected (default "Click to upload or drag and drop").
 * - uploadSubtext {string}: Default subtext shown when no file is selected (default "PDF, DOC, DOCX (Max 10MB)").
 * - selectedFile {File?}  : Currently selected file object (optional).
 * - dragActive {boolean}  : Whether drag state is active (optional).
 * - handleDrag {function} : Handler for drag events.
 * - handleDrop {function} : Handler for drop events.
 * - handleFileChange {function} : Handler for file input change.
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
