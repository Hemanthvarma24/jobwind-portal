"use client";

import { Job } from "@/lib/types";
import { formatSalary, parseQualifications } from "@/lib/api";
import { MapPin, Clock, DollarSign, Wifi, Users, Bookmark, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  index?: number;
}

export default function JobCard({ job, onSelect, index = 0 }: JobCardProps) {
  const qualifications = parseQualifications(job.qualifications).slice(0, 3);
  const isRemote = job.is_remote_work === 1;
  const [saved, setSaved] = useState(false);

  const daysAgo = () => {
    const created = new Date(job.created_at);
    const now = new Date();
    const diff = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 30) return `${diff}d ago`;
    return `${Math.floor(diff / 30)}mo ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      onClick={() => onSelect(job)}
      className="group relative flex flex-col h-full bg-card rounded-2xl border border-border/60 shadow-soft hover:shadow-soft-xl cursor-pointer transition-all duration-400 hover:border-primary/30 overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-[3px] bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/60 group-hover:via-primary/40 group-hover:to-transparent transition-all duration-500" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header: Logo + Title + Bookmark */}
        <div className="flex items-start gap-3.5 mb-4">
          <motion.div
            whileHover={{ scale: 1.08 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="h-12 w-12 rounded-xl bg-primary/8 flex items-center justify-center text-lg font-bold text-primary shrink-0 border border-primary/10 shadow-sm"
          >
            {job.company.charAt(0).toUpperCase()}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-[16px] font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-1">
              {job.title}
            </h3>
            <p className="text-[13px] font-medium text-muted-foreground mt-1 truncate">{job.company}</p>

            <div className="flex items-center gap-2.5 mt-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span className="truncate max-w-[120px]">{job.location.split(",")[0]}</span>
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                <Clock className="h-3.5 w-3.5" strokeWidth={2.2} />
                {job.employment_type}
              </span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
              e.stopPropagation();
              setSaved(!saved);
            }}
            className="h-9 w-9 flex items-center justify-center rounded-xl bg-secondary/50 hover:bg-secondary transition-colors shrink-0"
            aria-label="Save job"
          >
            <Bookmark
              className={`h-4.5 w-4.5 transition-all duration-200 ${
                saved ? "text-primary fill-primary scale-110" : "text-muted-foreground"
              }`}
              strokeWidth={2}
            />
          </motion.button>
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {isRemote && (
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-500/20">
              <Wifi className="h-3.5 w-3.5" strokeWidth={2.5} />
              Remote
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-primary/5 dark:bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/10">
            <DollarSign className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} />
            <span className="text-[12px] font-bold text-primary">
              {formatSalary(job.salary_from)} – {formatSalary(job.salary_to)}
            </span>
          </div>
        </div>

        {/* Description - Flexible space */}
        <div className="flex-1">
          <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2 mb-4">{job.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-2">
            {qualifications.map((q, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-[3px] rounded-lg bg-secondary text-[11px] font-semibold text-foreground/70 border border-border/40"
              >
                {q}
              </span>
            ))}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <Users className="h-3.5 w-3.5" strokeWidth={2.2} />
              {job.number_of_opening} Opening{job.number_of_opening > 1 ? "s" : ""}
            </span>
            <span className="text-[11px] font-medium text-muted-foreground/60">{daysAgo()}</span>
          </div>
          <span className="flex items-center gap-1.5 text-[12px] font-bold text-primary group-hover:translate-x-1 transition-transform duration-300">
            Details
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
