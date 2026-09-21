import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pages = [];
  const window = 2;
  let start = Math.max(1, page - window);
  let end = Math.min(totalPages, page + window);
  if (end - start < window * 2) {
    start = Math.max(1, end - window * 2);
    end = Math.min(totalPages, start + window * 2);
  }
  for (let i = start; i <= end; i++) pages.push(i);

  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4">
      <div className="flex items-center gap-3 text-sm text-navy-600">
        <span>
          Showing {from}–{to} of {total}
        </span>
        {onPageSizeChange && (
          <label className="flex items-center gap-2">
            <span className="text-navy-500">Per page</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="border border-navy-200 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          className="!px-2 !py-1.5"
          disabled={!canPrev}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </Button>

        {start > 1 && (
          <>
            <Button
              variant={page === 1 ? 'primary' : 'ghost'}
              className="!px-2.5 !py-1.5 min-w-[2rem]"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
            {start > 2 && (
              <span className="px-1 text-navy-400 text-sm">…</span>
            )}
          </>
        )}

        {pages.map((p) => (
          <Button
            key={p}
            variant={p === page ? 'primary' : 'ghost'}
            className="!px-2.5 !py-1.5 min-w-[2rem]"
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <span className="px-1 text-navy-400 text-sm">…</span>
            )}
            <Button
              variant={page === totalPages ? 'primary' : 'ghost'}
              className="!px-2.5 !py-1.5 min-w-[2rem]"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          className="!px-2 !py-1.5"
          disabled={!canNext}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}