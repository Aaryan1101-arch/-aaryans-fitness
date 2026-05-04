import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSiteContent } from "../sanity/SiteContent";

// One unified bar that shows admin-published notices and featured offers.
// Cycles through them every ~6s. Dismissable per-session (sessionStorage).
//
// Layout contract:
//   - we are `fixed top-0 z-40`
//   - we publish our height as `--banner-h` on <html>, so the Navbar (which uses
//     `top: var(--banner-h, 0)`) can sit just under us. When dismissed/empty we
//     publish 0px, restoring the original layout.

const STORAGE_KEY = "afc.topbanner.dismissed.v1";
const ROOT_VAR = "--banner-h";

const toneClass = {
  info:    "bg-brand text-white",
  success: "bg-emerald-600 text-white",
  warning: "bg-amber-500 text-black",
  danger:  "bg-red-600 text-white",
};

function isExternal(url) {
  return /^https?:\/\//i.test(url || "");
}

export default function TopBanner() {
  const { content } = useSiteContent();

  const items = useMemo(() => {
    const notices = content?.notices || [];
    const offers = (content?.offers || []).filter((o) => o.isFeatured !== false);
    const noticeItems = notices.map((n) => ({
      kind: "notice",
      key: `n-${n._id}`,
      tone: n.tone || "info",
      text: n.message,
      ctaLabel: n.linkLabel,
      ctaUrl: n.linkUrl,
    }));
    const offerItems = offers.map((o) => ({
      kind: "offer",
      key: `o-${o._id}`,
      tone: "info",
      badge: o.badge,
      text: o.title + (o.subtitle ? ` — ${o.subtitle}` : ""),
      ctaLabel: o.ctaLabel,
      ctaUrl: o.ctaUrl,
    }));
    return [...noticeItems, ...offerItems];
  }, [content]);

  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setDismissed(true);
    } catch {
      /* fail open */
    }
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  useEffect(() => {
    if (index >= items.length) setIndex(0);
  }, [items.length, index]);

  // Publish own height as a CSS var so the navbar can offset itself.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (dismissed || items.length === 0) {
      root.style.setProperty(ROOT_VAR, "0px");
      return undefined;
    }
    const node = ref.current;
    if (!node) return undefined;
    const update = () => {
      root.style.setProperty(ROOT_VAR, `${node.offsetHeight}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      root.style.setProperty(ROOT_VAR, "0px");
    };
  }, [dismissed, items.length]);

  if (dismissed || items.length === 0) return null;

  const current = items[index];

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* fail open */
    }
  }

  return (
    <div
      ref={ref}
      className={`fixed top-0 left-0 right-0 z-40 w-full ${toneClass[current.tone] || toneClass.info}`}
      role="region"
      aria-label="Site announcements"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center gap-3">
        <div className="flex-1 min-w-0 flex items-center gap-2 text-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2 min-w-0"
            >
              {current.badge && (
                <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest bg-black/25 rounded px-1.5 py-0.5">
                  {current.badge}
                </span>
              )}
              {current.kind === "offer" && !current.badge && (
                <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-widest bg-black/25 rounded px-1.5 py-0.5">
                  Offer
                </span>
              )}
              <span className="truncate font-medium">{current.text}</span>
              {current.ctaUrl && (
                <a
                  href={current.ctaUrl}
                  target={isExternal(current.ctaUrl) ? "_blank" : undefined}
                  rel={isExternal(current.ctaUrl) ? "noopener noreferrer" : undefined}
                  className="flex-shrink-0 underline underline-offset-2 hover:no-underline font-semibold whitespace-nowrap"
                >
                  {current.ctaLabel || "Learn more"} →
                </a>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to announcement ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === index ? "bg-white" : "bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="flex-shrink-0 -mr-1 p-1 rounded hover:bg-black/10 transition-colors"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
