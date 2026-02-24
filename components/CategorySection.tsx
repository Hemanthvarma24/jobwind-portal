"use client";

import { Code, Palette, Database, Shield, Smartphone, LineChart, Server, Bug, Layers, Wrench } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { getAllJobs } from "@/lib/api";
import { Job } from "@/lib/types";

// Base visual config for known categories
const categoryConfig: Record<string, { icon: any; gradient: string; iconColor: string }> = {
  "Front-end Developer": {
    icon: Code,
    gradient: "from-blue-500/10 to-indigo-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  "Back-end Developer": {
    icon: Server,
    gradient: "from-emerald-500/10 to-teal-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  "Full-stack Developer": {
    icon: Layers,
    gradient: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  "Mobile App Developer": {
    icon: Smartphone,
    gradient: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  "UI/UX Designer": {
    icon: Palette,
    gradient: "from-pink-500/10 to-rose-500/10",
    iconColor: "text-pink-600 dark:text-pink-400",
  },
  "Security Engineer": {
    icon: Shield,
    gradient: "from-red-500/10 to-orange-500/10",
    iconColor: "text-red-600 dark:text-red-400",
  },
  "Data Scientist": {
    icon: LineChart,
    gradient: "from-cyan-500/10 to-blue-500/10",
    iconColor: "text-cyan-600 dark:text-cyan-400",
  },
  "Database Administrator": {
    icon: Database,
    gradient: "from-teal-500/10 to-green-500/10",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  "QA Engineer": {
    icon: Bug,
    gradient: "from-amber-500/10 to-yellow-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  "DevOps Engineer": {
    icon: Wrench,
    gradient: "from-indigo-500/10 to-violet-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function CategorySection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs for categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const dynamicCategories = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      counts[job.job_category] = (counts[job.job_category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([label, count]) => {
        const config = categoryConfig[label] || {
          icon: Layers,
          gradient: "from-slate-500/10 to-gray-500/10",
          iconColor: "text-slate-600 dark:text-slate-400",
        };
        return {
          label,
          count: count > 1000 ? `${(count / 1000).toFixed(1)}k+` : `${count}`,
          rawCount: count,
          ...config,
        };
      })
      .sort((a, b) => b.rawCount - a.rawCount)
      .slice(0, 10);
  }, [jobs]);

  return (
    <section className="bg-background py-16 sm:py-24 transition-colors duration-300 relative overflow-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 opacity-30 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Explore by Category</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Browse opportunities across different roles and specializations
          </p>
        </motion.div>

        {!loading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
          >
            {dynamicCategories.map((cat) => (
              <motion.div key={cat.label} variants={itemVariants}>
                <Link
                  href={`/jobs?category=${encodeURIComponent(cat.label)}`}
                  className="group flex flex-col items-start gap-4 p-5 bg-card/50 dark:bg-card/30 backdrop-blur-sm rounded-2xl border border-border/40 hover:border-primary/30 hover:bg-card hover:shadow-soft-lg transition-all duration-400"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${cat.gradient} border border-white/10`}
                  >
                    <cat.icon className={`h-6 w-6 ${cat.iconColor}`} strokeWidth={2.2} />
                  </motion.div>
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors leading-tight truncate w-full">
                      {cat.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1.5 font-medium">{cat.count} listings</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="h-[140px] rounded-2xl bg-secondary animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
