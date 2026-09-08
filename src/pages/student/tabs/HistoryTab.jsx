import HistoryItemDesktop from "../../../components/student_components/HistoryItemDesktop";
import HistoryItemMobile from "../../../components/student_components/HistoryItemMobile";

export default function HistoryTab({
  historyItems,
  currentHistoryItems,
  totalHistoryPages,
  currentHistoryPage,
  onPrevPage,
  onNextPage,
  onPageChange,
  removeFromHistory,
}) {
  return (
    <div>
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
              <HistoryItemDesktop
                key={item.id}
                item={item}
                removeFromHistory={removeFromHistory}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="history-cards mobile-only">
        {currentHistoryItems.map((item) => (
          <HistoryItemMobile
            key={item.id}
            item={item}
            removeFromHistory={removeFromHistory}
          />
        ))}
      </div>

      {historyItems.length === 0 && (
        <div className="empty-state">No history items</div>
      )}

      {totalHistoryPages > 1 && (
        <div id="pagination">
          <button
            id="page-prev"
            onClick={onPrevPage}
            disabled={currentHistoryPage === 1}
          >
            ‹ Previous
          </button>
          {[...Array(totalHistoryPages)].map((_, index) => (
            <button
              key={index + 1}
              id={`page-${index + 1}`}
              className={currentHistoryPage === index + 1 ? "active" : ""}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            id="page-next"
            onClick={onNextPage}
            disabled={currentHistoryPage === totalHistoryPages}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}
