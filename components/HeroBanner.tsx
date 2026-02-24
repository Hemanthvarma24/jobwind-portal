"use client";

import { Search, MapPin, Sparkles, ChevronRight } from "lucide-react";
import Image from "next/image";
import bannerImg from "@/assets/banner.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface HeroBannerProps {
  totalJobs: number;
  popularTags: string[];
}

export default function HeroBanner({ totalJobs, popularTags }: HeroBannerProps) {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.set("search", searchTitle);
    if (searchLocation) params.set("location", searchLocation);
    router.push(`/jobs?${params.toString()}`);
  };

  const handleTrending = (term: string) => {
    router.push(`/jobs?search=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative overflow-hidden bg-background pt-8 pb-16 sm:pt-12 sm:pb-24">
      {/* Premium Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] -translate-y-1/2 translate-x-1/3 opacity-50 dark:opacity-20" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/10 blur-[100px] -translate-y-1/2 -translate-x-1/3 opacity-40 dark:opacity-10" />

      {/* Subtle Pattern Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                Unlock your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 dark:from-primary dark:to-blue-400">
                  career potential
                </span>
                <span className="inline-block animate-bounce-slow ml-2">🚀</span>
              </h1>

              <p className="mt-6 text-base sm:text-xl text-muted-foreground/90 max-w-xl leading-relaxed">
                Connect with top companies worldwide. Browse thousands of verified roles tailored to your expertise and
                ambition.
              </p>
            </motion.div>

            {/* Search Hub */}
            <motion.form
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="mt-10 max-w-2xl"
            >
              <div className="p-1.5 bg-card rounded-[22px] border border-border shadow-soft-xl group focus-within:border-primary/40 focus-within:shadow-primary/5 transition-all duration-300">
                <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border/60">
                  <div className="flex items-center gap-3 px-5 py-4 flex-1">
                    <Search className="h-5 w-5 text-primary shrink-0" strokeWidth={2.5} />
                    <input
                      type="text"
                      placeholder="Role, skill, or company"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/70 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-3 px-5 py-4 flex-1">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0" strokeWidth={2} />
                    <input
                      type="text"
                      placeholder="Location or remote"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/70 outline-none"
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="m-0.5 h-12 px-8 rounded-2xl bg-primary text-primary-foreground text-sm font-bold shadow-soft-md hover:shadow-soft-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn shrink-0"
                  >
                    Search
                    <ChevronRight
                      className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform"
                      strokeWidth={3}
                    />
                  </motion.button>
                </div>
              </div>
            </motion.form>

            {/* Trending Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 flex flex-wrap items-center gap-2.5"
            >
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 mr-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Popular:
              </span>
              {popularTags.slice(0, 5).map((term) => (
                <motion.button
                  key={term}
                  whileHover={{ y: -2, backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTrending(term)}
                  className="px-4 py-1.5 rounded-xl bg-secondary/80 text-[12px] font-semibold text-muted-foreground hover:shadow-soft transition-all duration-200 border border-border/40 hover:border-primary/30"
                >
                  {term}
                </motion.button>
              ))}
            </motion.div>
          </div>

          {/* Right Content: Premium Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
            className="hidden lg:block lg:col-span-5 relative"
          >
            <div className="relative group">
              {/* Image Glow */}
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-90 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <div className="relative rounded-[32px] overflow-hidden border border-border/60 shadow-soft-xl transition-all duration-500 group-hover:shadow-primary/10 group-hover:border-primary/20 transform group-hover:scale-[1.01]">
                <Image
                  src={bannerImg}
                  alt="Find your dream job"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 sm:mt-24 pt-8 border-t border-border/40"
        >
          {[
            {
              value: `${(totalJobs / 1000).toFixed(1)}k+`,
              label: "Live Listings",
              color: "text-blue-500",
              bg: "bg-blue-500/10",
            },
            { value: "97k+", label: "Global Companies", color: "text-primary", bg: "bg-primary/10" },
            { value: "3.8M", label: "Active Talent", color: "text-indigo-500", bg: "bg-indigo-500/10" },
            { value: "85%", label: "Placement Rate", color: "text-emerald-500", bg: "bg-emerald-500/10" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              className="p-5 bg-card/40 backdrop-blur-sm rounded-2xl border border-border/40 hover:border-primary/20 hover:bg-card transition-all duration-300"
            >
              <div className={`h-10 w-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-2xl font-black text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
