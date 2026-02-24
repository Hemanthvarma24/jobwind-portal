"use client";

import { useTheme } from "./ThemeProvider";
import { Moon, Sun, Menu, X, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full bg-background border-b border-border/60 shadow-soft"
    >
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="relative flex h-14 min-w-[120px] items-center justify-start"
            >
              <Image
                src={logoImg}
                alt="JobFlow Logo"
                height={56}
                width={200}
                className="h-full w-auto object-contain object-left"
                priority
              />
            </motion.div>
          </Link>

          {/* Center Search */}
          <div className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full group">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"
                strokeWidth={2}
              />
              <input
                type="text"
                placeholder="Search jobs, companies..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-secondary/60 text-sm text-foreground placeholder:text-muted-foreground border border-transparent outline-none focus:bg-card focus:border-primary/30 focus:shadow-soft-md transition-all duration-300"
              />
            </div>
          </div>

          {/* Right Nav */}
          <div className="flex items-center gap-1">
            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-0.5">
              {[
                { href: "/", label: "Home" },
                { href: "/jobs", label: "Jobs" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/80 transition-all duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-border mx-2" />

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -10, opacity: 0, rotate: -30 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 10, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            

            {/* Mobile Menu */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden"
            >
              <div className="pb-4 space-y-1">
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    className="w-full h-10 pl-9 pr-3 rounded-xl bg-secondary/60 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                  />
                </div>
                {[
                  { href: "/", label: "Home" },
                  { href: "/jobs", label: "Browse Jobs" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/80 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
