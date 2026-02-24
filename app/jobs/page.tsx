"use client";

import { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Job, FilterState, SortOption } from "@/lib/types";
import { getAllJobs, getUniqueCategories, getUniqueEmploymentTypes } from "@/lib/api";
import JobCard from "@/components/JobCard";
import JobFilters from "@/components/JobFilters";
import JobDetailModal from "@/components/JobDetailModal";
import Pagination from "@/components/Pagination";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { Search, Briefcase, List, Infinity } from "lucide-react";
import { motion } from "framer-motion";

const JOBS_PER_PAGE = 12;

function JobsContent() {
  const searchParams = useSearchParams();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"pagination" | "infinite">("pagination");
  const [visibleCount, setVisibleCount] = useState(JOBS_PER_PAGE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<Job[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    employment_type: [],
    job_category: searchParams.get("category") || "",
    is_remote: null,
    salary_min: null,
    salary_max: null,
    min_openings: null,
    created_within: null,
    sort_by: "newest" as SortOption,
  });

  useEffect(() => {
    async function fetchJobs() {
      try {
        setError(null);
        const data = await getAllJobs();
        setAllJobs(data);
        jobsRef.current = data;
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  // Extract unique locations for dropdown
  const uniqueLocations = useMemo(() => {
    const locs = new Set<string>();
    allJobs.forEach((job) => {
      const city = job.location.split(",")[0].trim();
      if (city) locs.add(city);
    });
    return Array.from(locs).sort();
  }, [allJobs]);

  const categories = useMemo(() => getUniqueCategories(allJobs), [allJobs]);
  const employmentTypes = useMemo(() => getUniqueEmploymentTypes(allJobs), [allJobs]);

  // Filter + Sort
  const filteredJobs = useMemo(() => {
    let result = allJobs.filter((job) => {
      // Search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.job_category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Location
      if (filters.location) {
        const city = job.location.split(",")[0].trim();
        if (city !== filters.location) return false;
      }

      // Employment Type (multi-select)
      if (filters.employment_type.length > 0) {
        if (!filters.employment_type.includes(job.employment_type)) return false;
      }

      // Job Category
      if (filters.job_category) {
        if (job.job_category !== filters.job_category) return false;
      }

      // Remote
      if (filters.is_remote !== null) {
        if (filters.is_remote ? job.is_remote_work !== 1 : job.is_remote_work !== 0) return false;
      }

      // Salary Range
      if (filters.salary_min !== null) {
        if (job.salary_from < filters.salary_min) return false;
      }
      if (filters.salary_max !== null) {
        if (job.salary_to > filters.salary_max) return false;
      }

      // Min Openings
      if (filters.min_openings !== null) {
        if (job.number_of_opening < filters.min_openings) return false;
      }

      // Created Within
      if (filters.created_within !== null) {
        const created = new Date(job.created_at);
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - filters.created_within);
        if (created < cutoff) return false;
      }

      return true;
    });

    // Sort
    result = [...result].sort((a, b) => {
      switch (filters.sort_by) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "salary_high":
          return b.salary_to - a.salary_to;
        case "salary_low":
          return a.salary_from - b.salary_from;
        case "most_openings":
          return b.number_of_opening - a.number_of_opening;
        default:
          return 0;
      }
    });

    return result;
  }, [allJobs, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);

  const paginatedJobs = useMemo(() => {
    if (viewMode === "infinite") {
      return filteredJobs.slice(0, visibleCount);
    }
    const start = (currentPage - 1) * JOBS_PER_PAGE;
    return filteredJobs.slice(start, start + JOBS_PER_PAGE);
  }, [filteredJobs, currentPage, viewMode, visibleCount]);

  // Infinite scroll observer
  useEffect(() => {
    if (viewMode !== "infinite") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < filteredJobs.length) {
          setVisibleCount((prev) => Math.min(prev + JOBS_PER_PAGE, filteredJobs.length));
        }
      },
      { threshold: 0.1 },
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [viewMode, visibleCount, filteredJobs.length]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
    setVisibleCount(JOBS_PER_PAGE);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const toggleViewMode = () => {
    if (viewMode === "pagination") {
      setViewMode("infinite");
      setVisibleCount(JOBS_PER_PAGE);
    } else {
      setViewMode("pagination");
      setCurrentPage(1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Banner - Refined for Dark Mode Contrast */}
      <div className="relative overflow-hidden bg-background border-b border-border/40">
        <div className="dark:block hidden absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background transition-colors duration-500" />
      
        <div className="dark:hidden absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/30 transition-colors duration-500" />

        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-primary/15 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-50 dark:opacity-30" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 opacity-40 dark:opacity-20" />

        <div className="relative max-w-6xl mx-auto px-5 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4"
          >
            <div className="h-12 w-12 rounded-2xl bg-card border border-border flex items-center justify-center shadow-soft">
              <Briefcase className="h-6 w-6 text-primary" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Find Your <span className="text-primary italic">Next Role</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-base text-muted-foreground mt-1 max-w-xl"
              >
                Explore thousands of curated opportunities from world-class companies and startups.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-5 py-6">
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          totalJobs={allJobs.length}
          locations={uniqueLocations}
          filteredJobs={filteredJobs}
          categories={categories}
          employmentTypes={employmentTypes}
        />

        {/* View Mode Toggle */}
        <div className="flex items-center justify-end mb-4 gap-2">
          <span className="text-xs text-muted-foreground mr-1">View:</span>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleViewMode}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === "pagination"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            Pages
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleViewMode}
            className={`flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-all duration-200 ${
              viewMode === "infinite"
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Infinity className="h-3.5 w-3.5" />
            Infinite
          </motion.button>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-destructive/30 shadow-soft"
          >
            <p className="text-sm text-destructive font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 h-9 px-5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft"
            >
              Retry
            </button>
          </motion.div>
        ) : paginatedJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {paginatedJobs.map((job, i) => (
                <JobCard key={job.id} job={job} onSelect={setSelectedJob} index={i} />
              ))}
            </div>

            {viewMode === "pagination" ? (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            ) : (
              <>
                {visibleCount < filteredJobs.length && (
                  <div ref={sentinelRef} className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      Loading more jobs...
                    </div>
                  </div>
                )}
                {visibleCount >= filteredJobs.length && filteredJobs.length > JOBS_PER_PAGE && (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">Showing all {filteredJobs.length} results</p>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-2xl border border-border/60 shadow-soft"
          >
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">No jobs match your criteria</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your filters or search terms to find more opportunities.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() =>
                handleFilterChange({
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
                })
              }
              className="mt-5 h-9 px-5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-soft hover:shadow-soft-md transition-shadow duration-200"
            >
              Clear all filters
            </motion.button>
          </motion.div>
        )}
      </div>

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <div className="bg-gradient-to-br from-primary via-primary to-[hsl(260,60%,40%)] py-10 sm:py-14">
            <div className="max-w-6xl mx-auto px-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-white/15 animate-pulse" />
                <div className="h-8 w-52 rounded-lg bg-white/15 animate-pulse" />
              </div>
              <div className="h-4 w-72 rounded bg-white/10 animate-pulse ml-[52px]" />
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-5 py-6">
            <LoadingSkeleton />
          </div>
        </div>
      }
    >
      <JobsContent />
    </Suspense>
  );
}
