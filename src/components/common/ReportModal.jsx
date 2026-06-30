import { FiX, FiDownload, FiSearch } from "react-icons/fi";
import { useState, useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const HIDDEN_FIELDS = [
  "_id",
  "__v",
  "createdAt",
  "updatedAt",
  "isDeleted",
  "paymentHistory",
  "photo",
  "password",
];

const COLUMN_LABELS = {
  memberId: "Member ID",
  fullName: "Member Name",
  branch: "Branch",
  mobile: "Mobile",
  amountPaid: "Paid Amount",
  balanceAmount: "Balance",
  expiryDate: "Expiry Date",
  paymentMethod: "Payment Method",
  paymentMode: "Payment Mode",
  paymentDate: "Payment Date",
  ownerName: "Owner",
  branchName: "Branch Name",
  branchCode: "Branch Code",
  totalRevenue: "Revenue",
  totalMembers: "Total Members",
  activeMembers: "Active Members",
  pendingAmount: "Pending Amount",
  status: "Status",
  amount: "Amount",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getColumnLabel = (key) =>
  COLUMN_LABELS[key] ||
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

const formatCellValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);

  if (key.toLowerCase().includes("date")) {
    const d = new Date(value);
    return isNaN(d)
      ? String(value)
      : d.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
  }

  if (
    key.toLowerCase().includes("amount") ||
    key.toLowerCase().includes("revenue") ||
    key.toLowerCase().includes("balance") ||
    key === "amount"
  ) {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  }

  if (typeof value === "boolean") return value ? "Yes" : "No";

  return value;
};

const renderCell = (key, value) => {
  if (value === null || value === undefined || value === "")
    return <span className="text-slate-300">—</span>;
  if (typeof value === "object")
    return (
      <span className="text-slate-400 italic text-xs">
        {JSON.stringify(value)}
      </span>
    );

  if (key === "status") {
    const isActive = value === "Active";
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
          isActive
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-emerald-500" : "bg-red-500"}`}
        />
        {value}
      </span>
    );
  }

  return formatCellValue(key, value);
};

// ─── Empty State ──────────────────────────────────────────────────────────────

const EmptyState = ({ filtered, onClose }) => (
  <div className="flex items-center justify-center h-full py-20">
    <div className="max-w-sm text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 shadow-sm mb-5">
        <svg
          className="h-9 w-9 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 17v-6h13M9 5h13M5 5h.01M5 11h.01M5 17h.01"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-slate-800">
        {filtered ? "No Matching Records" : "No Records Found"}
      </h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed">
        {filtered
          ? "Try a different search keyword."
          : "There are no records available for the selected branch or date range."}
      </p>
      {!filtered && (
        <button
          onClick={onClose}
          className="mt-5 rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Close
        </button>
      )}
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const ReportModal = ({
  open,
  onClose,
  title,
  data = [],
  loading,
  onDownload,
}) => {
  const [search, setSearch] = useState("");

  const columns = useMemo(() => {
    if (!data.length) return [];
    return Object.keys(data[0]).filter((k) => !HIDDEN_FIELDS.includes(k));
  }, [data]);

  const filteredData = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.trim().toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) =>
        String(v ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [data, search]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full sm:w-[96%] max-w-7xl h-[92vh] sm:h-[88vh] bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-100 px-6 py-4 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3 min-w-0">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-slate-900 truncate">
                    {title}
                  </h2>
                  <span className="flex-shrink-0 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100">
                    {filteredData.length} records
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  View, search and export report data.
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Search */}
              <div className="relative">
                <FiSearch
                  size={13}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search..."
                  className="w-48 sm:w-56 pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>

              {/* Download */}
              <button
                onClick={() => onDownload(filteredData)}
                disabled={filteredData.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filteredData.length === 0
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-indigo-600 cursor-pointer shadow-sm hover:shadow-md"
                }`}
              >
                <FiDownload size={14} />
                <span className="hidden sm:inline">Download PDF</span>
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
              >
                <FiX size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Body ────────────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto bg-slate-50 p-4">
          {/* Loading */}
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-indigo-500 animate-spin mx-auto" />
                <p className="mt-4 text-sm font-semibold text-slate-600">
                  Loading report...
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Fetching the latest data
                </p>
              </div>
            </div>
          ) : data.length === 0 ? (
            <EmptyState filtered={false} onClose={onClose} />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-auto">
                <table className="min-w-full">
                  <thead className="sticky top-0 z-10 bg-slate-900">
                    <tr>
                      <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-wider font-bold text-slate-400 w-10">
                        #
                      </th>
                      {columns.map((key) => (
                        <th
                          key={key}
                          className="px-5 py-3.5 text-left text-[10px] uppercase tracking-wider font-bold text-white whitespace-nowrap"
                        >
                          {getColumnLabel(key)}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={columns.length + 1}>
                          <EmptyState filtered={true} onClose={onClose} />
                        </td>
                      </tr>
                    ) : (
                      filteredData.map((row, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-slate-100 hover:bg-indigo-50/50 even:bg-slate-50/40 transition-colors duration-100"
                        >
                          <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">
                            {idx + 1}
                          </td>
                          {columns.map((key) => (
                            <td
                              key={key}
                              className="px-5 py-3.5 text-sm text-slate-700 whitespace-nowrap"
                            >
                              {renderCell(key, row[key])}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-800">
                    {filteredData.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-800">
                    {data.length}
                  </span>{" "}
                  records
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="ml-2 text-indigo-500 hover:underline"
                    >
                      Clear filter
                    </button>
                  )}
                </p>
                <button
                  onClick={() => onDownload(filteredData)}
                  disabled={filteredData.length === 0}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    filteredData.length === 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-slate-900 text-white hover:bg-indigo-600 cursor-pointer"
                  }`}
                >
                  <FiDownload size={13} />
                  Download PDF
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
