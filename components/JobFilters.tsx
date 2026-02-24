"use client";

import { SORT_OPTIONS } from "@/lib/api";
import { FilterState, Job, SortOption } from "@/lib/types";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  X,
  Wifi,
  ChevronDown,
  Download,
  FileText,
  ArrowUpDown,
  Calendar,
  Users,
  DollarSign,
  Check,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JobFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalJobs: number;
  locations: string[];
  filteredJobs: Job[];
  categories: string[];
  employmentTypes: string[];
}

function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function JobFilters({
  filters,
  onFilterChange,
  totalJobs,
  locations,
  filteredJobs,
  categories,
  employmentTypes,
}: JobFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);
  const [empTypeOpen, setEmpTypeOpen] = useState(false);
  const empTypeRef = useRef<HTMLDivElement>(null);

  const debouncedSearch = useDebounce(searchInput, 500);

  // Sync debounced search to filters
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onFilterChange({ ...filters, search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  // Close employment type dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (empTypeRef.current && !empTypeRef.current.contains(e.target as Node)) {
        setEmpTypeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
      onFilterChange({ ...filters, [key]: value });
    },
    [filters, onFilterChange],
  );

  const toggleEmploymentType = (type: string) => {
    const current = filters.employment_type;
    const updated = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];
    updateFilter("employment_type", updated);
  };

  const clearFilters = () => {
    setSearchInput("");
    onFilterChange({
      search: "",
      location: "",
      employment_type: [],
      job_category: "",
      is_remote: null,
      salary_min: null,
      salary_max: null,
      min_openings: null,
      created_within: null,
      sort_by: "newest",
    });
  };

  // Active filter chips
  const activeFilters: { label: string; key: string; onRemove: () => void }[] = [];

  if (filters.search) {
    activeFilters.push({
      label: `Search: "${filters.search}"`,
      key: "search",
      onRemove: () => {
        setSearchInput("");
        updateFilter("search", "");
      },
    });
  }
  if (filters.location) {
    activeFilters.push({
      label: `Location: ${filters.location}`,
      key: "location",
      onRemove: () => updateFilter("location", ""),
    });
  }
  if (filters.job_category) {
    activeFilters.push({
      label: `Category: ${filters.job_category}`,
      key: "category",
      onRemove: () => updateFilter("job_category", ""),
    });
  }
  if (filters.employment_type.length > 0) {
    filters.employment_type.forEach((t) => {
      activeFilters.push({
        label: t,
        key: `emp_${t}`,
        onRemove: () => toggleEmploymentType(t),
      });
    });
  }
  if (filters.is_remote === true) {
    activeFilters.push({
      label: "Remote Only",
      key: "remote",
      onRemove: () => updateFilter("is_remote", null),
    });
  }
  if (filters.is_remote === false) {
    activeFilters.push({
      label: "On-site Only",
      key: "onsite",
      onRemove: () => updateFilter("is_remote", null),
    });
  }
  if (filters.salary_min !== null) {
    activeFilters.push({
      label: `Min Salary: $${filters.salary_min.toLocaleString()}`,
      key: "sal_min",
      onRemove: () => updateFilter("salary_min", null),
    });
  }
  if (filters.salary_max !== null) {
    activeFilters.push({
      label: `Max Salary: $${filters.salary_max.toLocaleString()}`,
      key: "sal_max",
      onRemove: () => updateFilter("salary_max", null),
    });
  }
  if (filters.min_openings !== null) {
    activeFilters.push({
      label: `Min Openings: ${filters.min_openings}`,
      key: "openings",
      onRemove: () => updateFilter("min_openings", null),
    });
  }
  if (filters.created_within !== null) {
    activeFilters.push({
      label: `Last ${filters.created_within} days`,
      key: "created",
      onRemove: () => updateFilter("created_within", null),
    });
  }

  // CSV Export
  const exportCSV = () => {
    const headers = [
      "Title",
      "Company",
      "Location",
      "Salary From",
      "Salary To",
      "Employment Type",
      "Job Category",
      "Remote",
      "Openings",
      "Created At",
    ];
    const rows = filteredJobs.map((job) => [
      `"${job.title.replace(/"/g, '""')}"`,
      `"${job.company.replace(/"/g, '""')}"`,
      `"${job.location.replace(/"/g, '""')}"`,
      job.salary_from,
      job.salary_to,
      `"${job.employment_type}"`,
      `"${job.job_category}"`,
      job.is_remote_work === 1 ? "Yes" : "No",
      job.number_of_opening,
      job.created_at,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `job_results_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // PDF Export
  const exportPDF = async () => {
    const appliedFilters = activeFilters.map((f) => f.label).join(", ") || "None";
    const tableRows = filteredJobs
      .map(
        (job) => `
      <tr>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">${job.title}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">${job.company}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">${job.location}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">$${job.salary_from.toLocaleString()} – $${job.salary_to.toLocaleString()}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">${job.employment_type}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">${job.is_remote_work === 1 ? "Yes" : "No"}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #e5e7eb;font-size:12px">${job.number_of_opening}</td>
      </tr>`,
      )
      .join("");

    // Fetch logo as base64 so it embeds in the PDF without external URL issues
    let logoDataUrl = "";
    try {
      const res = await fetch("/logo.png");
      if (res.ok) {
        const blob = await res.blob();
        logoDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }
    } catch {
      // logo fetch failed, will show text fallback
    }

    const logoHtml = logoDataUrl
      ? `<img src="${logoDataUrl}" alt="Logo" style="height:50px;object-fit:contain;object-position:left;" />`
      : `<span style="font-size:22px;font-weight:800;color:#1a1a2e;letter-spacing:-0.5px;">JobFlow</span>`;

    const html = `
      <html><head><title>Job Listings</title>
      <style>
        @page { margin: 0; }
        * { box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #1a1a2e;
          margin: 0;
          padding: 0;
        }
        .page-wrapper {
          padding: 30px 36px;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .pdf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
          margin-bottom: 20px;
        }
        .pdf-header-right {
          font-size: 12px;
          color: #6b7280;
          text-align: right;
        }
        .meta { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        th { text-align: left; padding: 8px 10px; background: #f3f4f6; font-size: 12px; font-weight: 600; border-bottom: 2px solid #d1d5db; }
        td { font-size: 12px; padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
        tr:last-child td { border-bottom: none; }
        .pdf-footer {
          margin-top: auto;
          padding-top: 16px;
          border-top: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          color: #9ca3af;
        }
        .pdf-footer-title {
          font-size: 14px;
          font-weight: 700;
          color: #374151;
          letter-spacing: 0.3px;
        }
      </style>
      </head><body>
        <div class="page-wrapper">
          <div class="pdf-header">
            ${logoHtml}
            <div class="pdf-header-right">
              <div><strong>Applied Filters:</strong> ${appliedFilters}</div>
              <div>Total Results: ${filteredJobs.length}</div>
            </div>
          </div>
          <table>
            <thead><tr>
              <th>Title</th><th>Company</th><th>Location</th><th>Salary</th><th>Type</th><th>Remote</th><th>Openings</th>
            </tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <div class="pdf-footer">
            <span class="pdf-footer-title">Job Listings</span>
            <span>Total: ${filteredJobs.length} job${filteredJobs.length !== 1 ? "s" : ""}</span>
          </div>
        </div>
      </body></html>
    `;

    // Print using a hidden iframe — no new tab opens
    const existingFrame = document.getElementById("__pdf_print_frame__");
    if (existingFrame) existingFrame.remove();

    const iframe = document.createElement("iframe");
    iframe.id = "__pdf_print_frame__";
    iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;border:none;";
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        // Remove frame after printing
        setTimeout(() => iframe.remove(), 1000);
      }, 500);
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-bold text-foreground">{totalJobs.toLocaleString()} Jobs</h2>
          <p className="text-xs text-muted-foreground mt-0.5">matching your criteria</p>
        </motion.div>

        <div className="flex items-center gap-2">
          {/* Export Buttons */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportCSV}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-card border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground shadow-soft hover:shadow-soft-md transition-all duration-200"
            title="Export CSV"
          >
            <Download className="h-3.5 w-3.5" />
            CSV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportPDF}
            className="hidden sm:flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-card border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground shadow-soft hover:shadow-soft-md transition-all duration-200"
            title="Export PDF"
          >
            <FileText className="h-3.5 w-3.5" />
            PDF
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden flex items-center gap-2 h-9 px-4 rounded-xl bg-card border border-border/60 text-sm font-medium text-foreground shadow-soft hover:shadow-soft-md transition-all duration-200"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilters.length > 0 && (
              <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground px-1">
                {activeFilters.length}
              </span>
            )}
          </motion.button>
        </div>
      </div>

      {/* Filter Panel */}
      <div className={`lg:block ${mobileOpen ? "block" : "hidden lg:block"}`}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          className="bg-card rounded-2xl border border-border/60 p-4 sm:p-5 mb-5 shadow-soft"
        >
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <SlidersHorizontal className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
              </div>
              <span className="text-sm font-semibold text-foreground">Filter & Sort</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Mobile Export */}
              <div className="flex sm:hidden items-center gap-1.5">
                <button
                  onClick={exportCSV}
                  className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-secondary text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Download className="h-3 w-3" /> CSV
                </button>
                <button
                  onClick={exportPDF}
                  className="flex items-center gap-1 h-7 px-2.5 rounded-lg bg-secondary text-[11px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <FileText className="h-3 w-3" /> PDF
                </button>
              </div>
              {activeFilters.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearFilters}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-semibold transition-colors px-2.5 py-1 rounded-lg hover:bg-primary/5"
                >
                  <X className="h-3 w-3" />
                  Clear all
                </motion.button>
              )}
            </div>
          </div>

          {/* Row 1: Search + Location + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-2.5">
            {/* Search (debounced) */}
            <div className="relative group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Job title, company, or keyword..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary/30 focus:bg-card focus:shadow-soft outline-none transition-all duration-300"
              />
            </div>

            {/* Location dropdown */}
            <div className="relative">
              <MapPin
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                strokeWidth={2}
              />
              <select
                value={filters.location}
                onChange={(e) => updateFilter("location", e.target.value)}
                className="w-full h-10 pl-10 pr-8 rounded-xl bg-secondary text-sm text-foreground border border-transparent focus:border-primary/30 focus:bg-card outline-none appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <ArrowUpDown
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                strokeWidth={2}
              />
              <select
                value={filters.sort_by}
                onChange={(e) => updateFilter("sort_by", e.target.value as SortOption)}
                className="w-full h-10 pl-10 pr-8 rounded-xl bg-secondary text-sm text-foreground border border-transparent focus:border-primary/30 focus:bg-card outline-none appearance-none cursor-pointer transition-all duration-300"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Row 2: Category + Employment Type + Created Within */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-2.5">
            {/* Category */}
            <div className="relative">
              <select
                value={filters.job_category}
                onChange={(e) => updateFilter("job_category", e.target.value)}
                className="w-full h-10 px-3.5 pr-8 rounded-xl bg-secondary text-sm text-foreground border border-transparent focus:border-primary/30 focus:bg-card outline-none appearance-none cursor-pointer transition-all duration-300"
              >
                {categories.map((cat: string) => (
                  <option key={cat} value={cat === "All Categories" ? "" : cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>

            {/* Employment Type (multi-select dropdown) */}
            <div className="relative" ref={empTypeRef}>
              <button
                onClick={() => setEmpTypeOpen(!empTypeOpen)}
                className="w-full h-10 px-3.5 pr-8 rounded-xl bg-secondary text-sm text-foreground border border-transparent hover:border-primary/20 outline-none text-left truncate transition-all duration-300 flex items-center justify-between"
              >
                <span className="truncate">
                  {filters.employment_type.length === 0
                    ? "All Employment Types"
                    : `${filters.employment_type.length} type${filters.employment_type.length > 1 ? "s" : ""} selected`}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${empTypeOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {empTypeOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 top-full left-0 right-0 mt-1 bg-card rounded-xl border border-border/60 shadow-soft-lg overflow-hidden"
                  >
                    <div className="max-h-56 overflow-y-auto py-1.5">
                      {employmentTypes.map((type: string) => {
                        const isChecked = filters.employment_type.includes(type);
                        return (
                          <button
                            key={type}
                            onClick={() => toggleEmploymentType(type)}
                            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-foreground hover:bg-secondary/60 transition-colors text-left"
                          >
                            <div
                              className={`h-4 w-4 rounded border flex items-center justify-center transition-all duration-200 shrink-0 ${
                                isChecked ? "bg-primary border-primary" : "border-border hover:border-primary/40"
                              }`}
                            >
                              {isChecked && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
                            </div>
                            <span className="truncate text-[13px]">{type}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Created Within */}
            <div className="relative">
              <Calendar
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                strokeWidth={2}
              />
              <select
                value={filters.created_within ?? ""}
                onChange={(e) => updateFilter("created_within", e.target.value ? Number(e.target.value) : null)}
                className="w-full h-10 pl-10 pr-8 rounded-xl bg-secondary text-sm text-foreground border border-transparent focus:border-primary/30 focus:bg-card outline-none appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="">Any Time</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Row 3: Salary Range + Openings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1fr_1fr_1fr] gap-2.5 mt-2.5">
            <div className="relative group">
              <DollarSign
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"
                strokeWidth={2}
              />
              <input
                type="number"
                placeholder="Min salary"
                value={filters.salary_min ?? ""}
                onChange={(e) => updateFilter("salary_min", e.target.value ? Number(e.target.value) : null)}
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary/30 focus:bg-card focus:shadow-soft outline-none transition-all duration-300"
              />
            </div>
            <div className="relative group">
              <DollarSign
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"
                strokeWidth={2}
              />
              <input
                type="number"
                placeholder="Max salary"
                value={filters.salary_max ?? ""}
                onChange={(e) => updateFilter("salary_max", e.target.value ? Number(e.target.value) : null)}
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary/30 focus:bg-card focus:shadow-soft outline-none transition-all duration-300"
              />
            </div>
            <div className="relative group col-span-2 sm:col-span-1">
              <Users
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"
                strokeWidth={2}
              />
              <input
                type="number"
                placeholder="Min openings"
                value={filters.min_openings ?? ""}
                onChange={(e) => updateFilter("min_openings", e.target.value ? Number(e.target.value) : null)}
                className="w-full h-10 pl-10 pr-3 rounded-xl bg-secondary text-sm text-foreground placeholder:text-muted-foreground border border-transparent focus:border-primary/30 focus:bg-card focus:shadow-soft outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Quick Chips: Remote / On-site */}
          <div className="flex flex-wrap gap-2 mt-4 pt-3.5 border-t border-border/40">
            {[
              { label: "Remote Only", icon: <Wifi className="h-3 w-3" strokeWidth={2.5} />, value: true as const },
              { label: "On-site", icon: null, value: false as const },
            ].map((chip) => (
              <motion.button
                key={chip.label}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => updateFilter("is_remote", filters.is_remote === chip.value ? null : chip.value)}
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  filters.is_remote === chip.value
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {chip.icon}
                {chip.label}
              </motion.button>
            ))}
          </div>

          {/* Active Filter Chips */}
          <AnimatePresence>
            {activeFilters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 pt-3 border-t border-border/40"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Active Filters
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeFilters.map((filter) => (
                    <motion.button
                      key={filter.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={filter.onRemove}
                      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-primary/10 text-[11px] font-semibold text-primary hover:bg-primary/15 transition-colors"
                    >
                      {filter.label}
                      <X className="h-3 w-3" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
