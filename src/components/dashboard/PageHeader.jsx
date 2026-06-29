import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

function PageHeader({
  title,
  description,
  rightContent,
}) {
  const location = useLocation();

  const pathSegments = location.pathname
    .split("/")
    .filter(Boolean);

  const currentPage =
    pathSegments[pathSegments.length - 1];

  const formattedPageName = currentPage
    ?.replace(/-/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );

let breadcrumbItems = ["Dashboard"];

if (location.pathname.includes("/members/new")) {
  breadcrumbItems.push("Members");
  breadcrumbItems.push("Add New Member");
} else {
  breadcrumbItems.push(formattedPageName);
}

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">

      {/* LEFT SIDE */}
      <div>

        {/* Breadcrumb */}
<div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[2px]">

  <Link
    to="/admin/dashboard"
    className="text-violet-600 hover:text-violet-700 transition-colors"
  >
    Dashboard
  </Link>

  {location.pathname.includes("/members/new") ? (
    <>
      <FiChevronRight
        size={12}
        className="text-slate-300"
      />

      <Link
        to="/admin/members"
        className="text-slate-400 hover:text-violet-600 transition-colors"
      >
        Members
      </Link>

      <FiChevronRight
        size={12}
        className="text-slate-300"
      />

      <span className="text-slate-500">
        Add New Member
      </span>
    </>
  ) : (
    <>
      <FiChevronRight
        size={12}
        className="text-slate-300"
      />

      <span className="text-slate-500">
        {formattedPageName}
      </span>
    </>
  )}

</div>

        {/* Page Title */}
        <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-1 text-xs font-medium text-slate-400 max-w-2xl">
          {description}
        </p>

      </div>

      {/* RIGHT ACTIONS */}
      {rightContent && (
        <div className="flex items-center gap-2 flex-wrap">
          {rightContent}
        </div>
      )}

    </div>
  );
}

export default PageHeader;