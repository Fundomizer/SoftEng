import PrintJobCard from "../../../components/student_components/PrintJobCard";

export default function QueueTab({
    filteredQueueItems,
    currentItems,
    startIndex,
    endIndex,
    totalPages,
    currentPage,
    onPrevPage,
    onNextPage,
    onPageChange,
}) {
    return (
        <div>
            <div id="section-header">
                <h2>Print Queue</h2>
                <div className="section-info">
                    <span>Total items: {filteredQueueItems.length}</span>
                    {filteredQueueItems.length > 0 && (
                        <span>• Showing {startIndex + 1}-{Math.min(endIndex, filteredQueueItems.length)} of {filteredQueueItems.length}</span>
                    )}
                </div>
            </div>
            <p id="section-subtitle">
                All pending and approved print requests from all students. Your jobs are highlighted in blue.
            </p>

            {currentItems.map((item) => (
                <PrintJobCard key={item.id} printJob={item} />
            ))}

            {filteredQueueItems.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                    No items in queue
                </div>
            )}

            {totalPages > 1 && (
                <div id="pagination">
                    <button
                        id="page-prev"
                        onClick={onPrevPage}
                        disabled={currentPage === 1}
                    >
                        ‹ Previous
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            id={`page-${index + 1}`}
                            className={currentPage === index + 1 ? 'active' : ''}
                            onClick={() => onPageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button
                        id="page-next"
                        onClick={onNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next ›
                    </button>
                </div>
            )}
        </div>
    );
}
