export default function PolicyModal({
  policyAgreed,
  setPolicyAgreed,
  confirmSubmission,
  cancelSubmission,
}) {
  return (
    <div className="overlay policy-overlay">
      <div className="popup policy-modal">
        <h2 className="policy-title">
          Computer Laboratories Printing Policies Agreement
        </h2>

        <div className="policy-content">
          <div className="policy-section">
            <h3>General Policies</h3>
            <ul>
              <li>
                Printing is for <strong>academic use only</strong> and requires
                student-provided paper.
              </li>
              <li>
                Each student is given <strong>500 tokens per semester</strong>;
                unused tokens do not carry over.
              </li>
              <li>
                Only <strong>school-related documents</strong> may be printed.
              </li>
              <li>
                Printing is on a <strong>DIY basis</strong>; follow the queue
                and honor system.
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>Token Cost per Page</h3>
            <ul>
              <li>
                <strong>Black & White:</strong> 1 token/page
              </li>
              <li>
                <strong>Color:</strong> 10 tokens/page
              </li>
              <li>
                <strong>Black & White (image):</strong> 10 tokens/page
              </li>
              <li>
                <strong>Color (image):</strong> 15 tokens/page
              </li>
              <li className="policy-note">
                <em>
                  "Image print" = 60% or more of a page covered by images.
                </em>
              </li>
            </ul>
          </div>

          <div className="policy-section">
            <h3>Important Reminders</h3>
            <ul>
              <li>
                Tokens are <strong>non-transferable</strong> and monitored by
                the Laboratory Custodian.
              </li>
              <li>
                Printing requires an <strong>official print job voucher</strong>{" "}
                (no voucher = no print).
              </li>
              <li>
                <strong>Dishonesty</strong> (e.g., undeclared extra printing)
                may result in loss of all print tokens.
              </li>
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
                By agreeing, you acknowledge you have read and understood the
                Computer Laboratories Printing Policies and agree to comply.
              </span>
            </label>
          </div>
        </div>

        <div className="policy-actions">
          <button onClick={cancelSubmission} className="cancel">
            Cancel
          </button>
          <button
            onClick={confirmSubmission}
            className="confirm"
            disabled={!policyAgreed}
          >
            I Agree & Submit
          </button>
        </div>
      </div>
    </div>
  );
}
