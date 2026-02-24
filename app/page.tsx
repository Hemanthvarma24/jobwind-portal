"use client";

import { useEffect, useState } from "react";
import { Job } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import FeaturedJobs from "@/components/FeaturedJobs";
import CategorySection from "@/components/CategorySection";
import JobDetailModal from "@/components/JobDetailModal";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Users } from "lucide-react";
import { useMemo } from "react";
import { getAllJobs } from "@/lib/api";

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach((j) => {
      counts[j.job_category] = (counts[j.job_category] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([label]) => label)
      .slice(0, 5);
  }, [jobs]);

  return (
    <div className="min-h-screen bg-background">
      <HeroBanner totalJobs={jobs.length} popularTags={popularTags} />
      <CategorySection />
      {!loading && <FeaturedJobs jobs={jobs} onSelect={(job) => setSelectedJob(job)} />}

      {/* CTA Section */}
      <section className="py-14 sm:py-18 bg-card transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[hsl(260,60%,40%)]" />
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-[0.06]">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                  backgroundSize: "28px 28px",
                }}
              />
            </div>
            {/* Glow orb */}
            <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

            <div className="relative z-10 p-8 sm:p-12 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-6"
              >
                <div className="flex -space-x-2">
                  {["👤", "👤", "👤"].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center"
                    >
                      <Users className="h-3.5 w-3.5 text-white/80" />
                    </div>
                  ))}
                </div>
                <span className="text-white/80 text-xs font-medium ml-2">Join 38L+ professionals</span>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                Ready to take the next step?
              </h2>
              <p className="text-sm sm:text-base text-white/70 mb-8 max-w-md mx-auto leading-relaxed">
                Discover opportunities that match your skills, salary expectations, and career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href="/jobs"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-primary shadow-soft-md hover:shadow-soft-lg transition-shadow duration-300"
                >
                  <Briefcase className="h-4 w-4" />
                  Browse All Jobs
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  href="/jobs"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/20 transition-colors duration-300"
                >
                  Post a Job
                  <ArrowRight className="h-4 w-4" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    </div>
  );
}
