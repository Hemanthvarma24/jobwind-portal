"use client";

import { Job } from "@/lib/types";
import { formatSalary } from "@/lib/api";
import { MapPin, Building2, DollarSign, ArrowRight, Wifi, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface FeaturedJobsProps {
  jobs: Job[];
  onSelect: (job: Job) => void;
}

export default function FeaturedJobs({ jobs, onSelect }: FeaturedJobsProps) {
  if (!jobs.length) return null;

  return (
    <section className="bg-secondary/15 dark:bg-card/5 py-16 sm:py-24 transition-colors duration-300 relative border-y border-border/40">
      {/* Subtle Pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Find Top Jobs</h2>
          </div>
          <motion.div whileHover={{ x: 3 }} transition={{ type: "spring", stiffness: 300 }}>
            <Link
              href="/jobs"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {jobs.slice(0, 6).map((job, i) => {
            const isRemote = job.is_remote_work === 1;

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4 }}
                onClick={() => onSelect(job)}
                className="group flex flex-col h-full bg-card rounded-2xl border border-border/60 p-5 shadow-soft hover:shadow-soft-lg cursor-pointer transition-all duration-300 hover:border-primary/30"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3.5 mb-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="h-11 w-11 rounded-xl bg-primary/8 flex items-center justify-center text-base font-bold text-primary border border-primary/10 shadow-sm shrink-0"
                    >
                      {job.company.charAt(0).toUpperCase()}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[14px] font-bold text-foreground group-hover:text-primary transition-colors truncate leading-tight">
                        {job.title}
                      </h3>
                      <p className="text-[12px] font-medium text-muted-foreground mt-1 flex items-center gap-1.5 truncate">
                        <Building2 className="h-3.5 w-3.5" strokeWidth={2.2} />
                        {job.company}
                      </p>
                      <div className="flex items-center gap-2.5 mt-2 flex-wrap text-[11px] text-muted-foreground/80">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
                          <span className="truncate">{job.location.split(",")[0]}</span>
                        </span>
                        {isRemote && (
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                            <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Remote
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                    <span className="text-[12px] font-bold text-emerald-700 dark:text-emerald-300">
                      {formatSalary(job.salary_from)} – {formatSalary(job.salary_to)}
                    </span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile link */}
        <div className="sm:hidden mt-6 text-center">
          <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            View all jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
