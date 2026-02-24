import { Briefcase, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import logoImg from "@/assets/logo.png";

const footerLinks = {
  Product: [
    { label: "Browse Jobs", href: "/jobs" },
    { label: "Companies", href: "/jobs" },
    { label: "Salary Guide", href: "/jobs" },
    { label: "Career Advice", href: "/jobs" },
  ],
  Resources: [
    { label: "Blog", href: "/jobs" },
    { label: "Help Center", href: "/jobs" },
    { label: "Accessibility", href: "/jobs" },
  ],
  Company: [
    { label: "About", href: "/jobs" },
    { label: "Careers", href: "/jobs" },
    { label: "Contact", href: "/jobs" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-5 py-8 sm:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="h-9 mb-6">
              <Image
                src={logoImg}
                alt="JobFlow Logo"
                height={36}
                width={140}
                className="h-full w-auto object-contain object-left"
                priority
              />
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[220px]">
              Connecting talent with opportunity. Find your next career move.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-[12px] font-bold text-foreground mb-3 uppercase tracking-widest">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center gap-3 pt-8 mt-8 border-t border-border/40">
          <p className="text-[12px] text-muted-foreground/60 text-center">© 2026 JobFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
