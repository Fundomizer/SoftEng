import InputFormGroup from "../../../components/student_components/FormGroup";
import ButtonFormGroup from "../../../components/student_components/ButtonFormGroup";
import UploadFile from "../../../components/UploadFile";

export default function UploadTab({
    documentName,
    setDocumentName,
    numPages,
    setNumPages,
    numCopies,
    setNumCopies,
    colorMode,
    setColorMode,
    paperSize,
    setPaperSize,
    hasImages,
    setHasImages,
    selectedFile,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileChange,
    estimatedCost,
    availableTokens,
    onSubmit,
}) {
    return (
        <div>
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
                <button id="submit-btn" onClick={onSubmit}>
                    <span id="submit-icon">⬆️</span>
                    Submit Print Request
                </button>
            </div>
        </div>
    );
}
