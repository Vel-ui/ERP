interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({ current, total, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <nav className="mx-pagination">
      <button
        className="mx-page-btn"
        disabled={current <= 1}
        onClick={() => onChange(current - 1)}
      >
        &lsaquo;
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="mx-page-btn" style={{ pointerEvents: "none" }}>...</span>
        ) : (
          <button
            key={p}
            className={`mx-page-btn ${current === p ? "mx-page-btn-active" : ""}`}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        )
      )}
      <button
        className="mx-page-btn"
        disabled={current >= totalPages}
        onClick={() => onChange(current + 1)}
      >
        &rsaquo;
      </button>
    </nav>
  );
}
