"use client";

import { motion } from "framer-motion";

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="bg-card rounded-2xl border border-border/60 shadow-soft overflow-hidden"
        >
          {/* Accent shimmer */}
          <div className="h-[3px] bg-secondary animate-pulse" />
          <div className="p-5 space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-secondary animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded-lg bg-secondary animate-pulse" />
                <div className="h-3.5 w-1/2 rounded-lg bg-secondary animate-pulse" />
                <div className="h-3 w-2/3 rounded-lg bg-secondary animate-pulse" />
              </div>
            </div>
            <div className="h-7 w-36 rounded-lg bg-secondary animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-secondary animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-secondary animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-lg bg-secondary animate-pulse" />
              <div className="h-6 w-24 rounded-lg bg-secondary animate-pulse" />
            </div>
            <div className="pt-3 border-t border-border/30 flex justify-between">
              <div className="h-3 w-24 rounded bg-secondary animate-pulse" />
              <div className="h-3 w-14 rounded bg-secondary animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
