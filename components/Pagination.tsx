"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const delta = 2;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center justify-center gap-1.5 mt-8 mb-2"
    >
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/60 text-muted-foreground shadow-soft hover:shadow-soft-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {getVisiblePages().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="flex h-9 w-9 items-center justify-center text-xs text-muted-foreground"
          >
            ···
          </span>
        ) : (
          <motion.button
            key={page}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPageChange(page as number)}
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage === page
                ? "bg-primary text-primary-foreground shadow-soft-md"
                : "bg-card border border-border/60 text-muted-foreground hover:text-foreground shadow-soft hover:shadow-soft-md"
            }`}
          >
            {page}
          </motion.button>
        ),
      )}

      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-card border border-border/60 text-muted-foreground shadow-soft hover:shadow-soft-md disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>
    </motion.div>
  );
}
