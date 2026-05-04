import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import useActiveSection from "../hooks/useActiveSection";

const NAV_LINKS = [
  { id: "hero", label: "Home" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "team", label: "Team" },
  { id: "membership", label: "Membership" },
  { id: "supplements", label: "Supplements", optional: true },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

const Navbar = ({ handleClick }) => {
  const { content } = useSiteContent();
  const settings = content.siteSettings || {};
  const logoUrl = imgUrl(settings.logo);

  // Hide nav links for sections that have no content (e.g. Supplements when
  // the admin hasn't published any). Keep this list in sync with sections that
  // can be empty. Memoised so `useActiveSection` doesn't re-observe every render.
  const hasSupplements = (content?.supplements || []).length > 0;
  const visibleLinks = useMemo(
    () => NAV_LINKS.filter((l) => !(l.id === "supplements" && !hasSupplements)),
    [hasSupplements]
  );
  const NAV_IDS = useMemo(() => visibleLinks.map((l) => l.id), [visibleLinks]);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close mobile drawer whenever the user navigates to a link.
  const navigate = (e, id) => {
    setOpen(false);
    handleClick(e, id);
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : "navbar-top"}`}>
        <div className="flex items-center gap-10">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="lg:hidden relative min-w-[44px] min-h-[44px] flex flex-col justify-center items-center gap-1.5 text-white touch-manipulation"
          >
            <motion.span
              animate={
                open
                  ? { rotate: 45, y: 7, width: 24 }
                  : { rotate: 0, y: 0, width: 24 }
              }
              transition={{ duration: 0.25 }}
              className="block h-[2px] bg-white rounded"
              style={{ width: 24 }}
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
              className="block h-[2px] w-5 bg-white rounded"
            />
            <motion.span
              animate={
                open
                  ? { rotate: -45, y: -7, width: 24 }
                  : { rotate: 0, y: 0, width: 16 }
              }
              transition={{ duration: 0.25 }}
              className="block h-[2px] bg-white rounded"
            />
          </button>

          <a
            href="/"
            onClick={(e) => navigate(e, "hero")}
            className="flex items-center gap-3 group"
          >
            {logoUrl && (
              <img
                src={logoUrl}
                className="w-16 sm:w-20 aspect-[3/2] object-contain transition-transform duration-300 group-hover:scale-105"
                alt={settings.siteName || "Logo"}
              />
            )}
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-7">
            {visibleLinks.map((l) => (
              <a
                key={l.id}
                href="/"
                onClick={(e) => navigate(e, l.id)}
                className={`nav-link text-sm tracking-wide ${
                  active === l.id ? "is-active" : ""
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <a
          href="/"
          onClick={(e) => navigate(e, "contact")}
          className="button text-sm sm:text-base"
        >
          Join Now
        </a>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-20 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
              className="fixed top-0 left-0 bottom-0 z-30 w-72 bg-ink-900 border-r border-white/10 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <p className="text-sm tracking-[0.3em] text-brand uppercase">
                  Menu
                </p>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="icon-button w-9 h-9"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 px-2 py-4 overflow-y-auto">
                {visibleLinks.map((l, i) => (
                  <motion.a
                    key={l.id}
                    href="/"
                    onClick={(e) => navigate(e, l.id)}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.04 }}
                    className={`flex items-center justify-between px-5 py-3 rounded-lg mx-2 my-1 text-base transition-colors ${
                      active === l.id
                        ? "bg-brand/15 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{l.label}</span>
                    {active === l.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-glow-sm" />
                    )}
                  </motion.a>
                ))}
              </div>
              <div className="drawer-footer">
                <a
                  href="/"
                  onClick={(e) => navigate(e, "contact")}
                  className="button w-full justify-center"
                >
                  Join Now
                </a>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
