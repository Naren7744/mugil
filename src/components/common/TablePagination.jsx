import React from "react";

function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  startItem,
  endItem,
  setCurrentPage,
}) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const visiblePages = pageNumbers.filter(
    (page) => page >= currentPage - 2 && page <= currentPage + 2,
  );

  return (
    <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span className="uppercase tracking-widest text-[10px] font-black text-slate-400">
          Showing
        </span>

        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black font-mono">
          {startItem}
        </span>

        <span className="text-slate-400">to</span>

        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-black font-mono">
          {endItem}
        </span>

        <span className="text-slate-400">of</span>

        <span className="px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 font-black font-mono border border-violet-100">
          {totalItems}
        </span>

        <span className="uppercase tracking-widest text-[10px] font-black text-slate-400">
          Entries
        </span>
      </div>

      <div className="flex items-center gap-1.5 font-mono font-bold text-xs">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 bg-white border border-slate-200 rounded-[10px] flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          ←
        </button>

        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all ${
              currentPage === page
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="w-8 h-8 bg-white border border-slate-200 rounded-[10px] flex items-center justify-center text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default TablePagination;
