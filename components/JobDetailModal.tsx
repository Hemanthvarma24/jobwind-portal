"use client";

import { Job } from "@/lib/types";
import { formatSalary, parseQualifications } from "@/lib/api";
import {
  X,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Wifi,
  WifiOff,
  Users,
  Phone,
  Calendar,
  Tag,
  GraduationCap,
  ExternalLink,
  Bookmark,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface JobDetailModalProps {
  job: Job | null;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: 30,
    scale: 0.97,
    transition: { duration: 0.25 },
  },
};

export default function JobDetailModal({ job, onClose }: JobDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (job) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [job]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          ref={overlayRef}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => {
            if (e.target === overlayRef.current) onClose();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[680px] max-h-[88vh] overflow-hidden bg-card rounded-2xl shadow-soft-xl border border-border/60 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border/50 px-6 py-5">
              <div className="flex items-start gap-4">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 20 }}
                  className="h-14 w-14 rounded-xl bg-primary/8 flex items-center justify-center text-xl font-bold text-primary border border-primary/10 shrink-0"
                >
                  {job.company.charAt(0).toUpperCase()}
                </motion.div>

                <div className="flex-1 min-w-0 pr-10">
                  <h2 className="text-lg font-bold text-foreground leading-tight">{job.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" strokeWidth={2} />
                    {job.company}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" strokeWidth={2.2} />
                      {job.location}
                    </span>
                    <span className="text-border">·</span>
                    <span>{job.employment_type}</span>
                    {job.is_remote_work === 1 && (
                      <>
                        <span className="text-border">·</span>
                        <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                          <Wifi className="h-3 w-3" /> Remote
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center rounded-xl bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </motion.button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="h-10 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-soft-md hover:shadow-soft-lg transition-shadow duration-300 flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Apply Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSaved(!saved)}
                  className={`h-10 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                    saved
                      ? "border-primary text-primary bg-primary/8"
                      : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Bookmark className={`h-4 w-4 ${saved ? "fill-primary" : ""}`} />
                  {saved ? "Saved" : "Save"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="h-10 w-10 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Share2 className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
              {/* Salary Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 p-4 bg-emerald-50/80 dark:bg-emerald-500/8 rounded-xl border border-emerald-200/60 dark:border-emerald-500/15"
              >
                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/15 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                    {formatSalary(job.salary_from)} – {formatSalary(job.salary_to)}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Annual salary range</p>
                </div>
              </motion.div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <DetailItem
                  icon={<Clock className="h-4 w-4" />}
                  label="Type"
                  value={job.employment_type}
                  delay={0.22}
                />
                <DetailItem
                  icon={<Users className="h-4 w-4" />}
                  label="Openings"
                  value={`${job.number_of_opening} position${job.number_of_opening > 1 ? "s" : ""}`}
                  delay={0.26}
                />
                <DetailItem
                  icon={<Calendar className="h-4 w-4" />}
                  label="Deadline"
                  value={job.application_deadline}
                  delay={0.3}
                />
                <DetailItem
                  icon={job.is_remote_work === 1 ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                  label="Work Type"
                  value={job.is_remote_work === 1 ? "Remote friendly" : "On-site"}
                  delay={0.34}
                />
                <DetailItem icon={<Tag className="h-4 w-4" />} label="Category" value={job.job_category} delay={0.38} />
                <DetailItem icon={<Phone className="h-4 w-4" />} label="Contact" value={job.contact} delay={0.42} />
              </div>

              <hr className="border-border/40" />

              {/* Description */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <h3 className="text-sm font-semibold text-foreground mb-2.5 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                  </div>
                  About the Role
                </h3>
                <p className="text-sm text-muted-foreground leading-[1.75]">{job.description}</p>
              </motion.div>

              {/* Qualifications */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Requirements
                </h3>
                <ul className="space-y-2.5">
                  {parseQualifications(job.qualifications).map((q, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.45 + i * 0.06 }}
                      className="flex items-start gap-2.5 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="h-[18px] w-[18px] text-primary mt-0.5 shrink-0" strokeWidth={2} />
                      <span>{q}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Company Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-secondary/50 rounded-xl p-4 flex items-center gap-4 border border-border/40"
              >
                <div className="h-12 w-12 rounded-xl bg-card flex items-center justify-center text-lg font-bold text-primary border border-border/60">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{job.company}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailItem({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-start gap-2.5"
    >
      <div className="mt-0.5 text-muted-foreground/60">{icon}</div>
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
        <p className="text-sm text-foreground font-medium mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}
