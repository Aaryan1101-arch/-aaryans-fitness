import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import SectionHeading from "../components/motion/SectionHeading";

// Catalog-only supplements display. No purchase flow — users grab these at the
// front desk. Visual pattern matches Services: filter pills, then a
// horizontal snap-scroll on mobile that becomes a grid on md+ screens.
//
// Card hierarchy (most → least important):
//   1. product image (60% of card vertical)
//   2. brand caps + product name + price
//   3. an in-stock dot beside the price
//   4. expanded description on tap (matches Services interaction)

const FILTERS = [
  { value: null,           label: "All" },
  { value: "protein",      label: "Protein" },
  { value: "pre-workout",  label: "Pre-workout" },
  { value: "creatine",     label: "Creatine" },
  { value: "vitamin",      label: "Vitamins" },
  { value: "general",      label: "Other" },
];

function SupplementCard({ s, index }) {
  const [open, setOpen] = useState(false);
  const img = imgUrl(s.image);
  const inStock = s.inStock !== false;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      onClick={() => setOpen((v) => !v)}
      className="group relative flex-shrink-0 snap-center w-[78%] xs:w-[68%] sm:w-[44%] md:w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm shadow-card hover:shadow-card-hover hover:border-brand/40 transition-all duration-300 cursor-pointer"
    >
      {/* Image — keeps a consistent aspect ratio across the row */}
      <div className="aspect-[4/3] relative bg-white/[0.02] overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={s.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-[10px] uppercase tracking-[0.3em]">
            No image
          </div>
        )}

        {/* Subtle bottom fade so chips read on any image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none" />

        {/* Featured chip — same accent treatment as Services title chip */}
        {s.isFeatured && (
          <div className="absolute top-3 left-0 bg-black/80 backdrop-blur-sm pl-3 pr-5 py-1 card-content border-l-4 border-brand">
            <p className="text-brand text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em]">
              Featured
            </p>
          </div>
        )}

        {/* Out-of-stock veil reads instantly without taking up card space */}
        {!inStock && (
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px] flex items-center justify-center">
            <span className="text-white/90 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] border border-white/30 rounded px-3 py-1">
              Out of stock
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 space-y-1.5">
        {s.brand && (
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/40 truncate">
            {s.brand}
          </p>
        )}
        <p className="text-white font-semibold leading-tight truncate">
          {s.name}
        </p>

        <div className="flex items-center justify-between gap-3 pt-1">
          {s.price ? (
            <p className="text-brand-light font-semibold text-sm whitespace-nowrap">
              {s.price}
            </p>
          ) : (
            <span /> /* spacer */
          )}
          <span
            className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium ${
              inStock ? "text-emerald-300/90" : "text-white/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                inStock ? "bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400/60" : "bg-white/30"
              }`}
            />
            {inStock ? "Available" : "Sold out"}
          </span>
        </div>

        {/* Serving info — small, meta-level */}
        {s.servingInfo && (
          <p className="text-white/40 text-xs pt-1">{s.servingInfo}</p>
        )}

        {/* Description — collapses by default, expands on tap (matches Services) */}
        <AnimatePresence initial={false}>
          {open && s.description && (
            <motion.p
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: "auto", opacity: 1, marginTop: 4 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.25 }}
              className="text-white/65 text-sm leading-relaxed overflow-hidden"
            >
              {s.description}
            </motion.p>
          )}
        </AnimatePresence>

        {s.description && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
            className="text-[11px] text-white/40 hover:text-brand-light transition-colors uppercase tracking-wider mt-1"
          >
            {open ? "Show less" : "Read more"} →
          </button>
        )}
      </div>
    </motion.div>
  );
}

const Supplements = () => {
  const { content } = useSiteContent();
  const supplements = content?.supplements || [];
  const [filter, setFilter] = useState(null);

  const visible = useMemo(() => {
    if (!filter) return supplements;
    return supplements.filter((s) => (s.category || "general") === filter);
  }, [supplements, filter]);

  // Hide section entirely when there's nothing to show.
  if (!supplements.length) return null;

  // Only show filters that actually have items (cleaner UX than dead pills).
  const availableFilters = FILTERS.filter(
    (f) => f.value === null || supplements.some((s) => (s.category || "general") === f.value)
  );

  return (
    <section id="supplements" className="section bg-ink-800 overflow-hidden">
      <SectionHeading
        eyebrow="Fuel your training"
        title="Supplements"
        sub="A curated selection available at the club. Ask at the front desk to grab any of these."
      />

      {/* Filter pills — same treatment as Gallery's filters */}
      {availableFilters.length > 2 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10"
        >
          {availableFilters.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={String(f.value)}
                onClick={() => setFilter(f.value)}
                className={`min-h-[44px] px-5 py-2.5 text-sm rounded-full border transition-all duration-300 touch-manipulation ${
                  active
                    ? "bg-brand text-white border-brand shadow-glow-sm"
                    : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/30"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>
      )}

      {/* The "supplements bar":
          - mobile: single horizontal scroll-snap row
          - md+   : 3-up grid
          - lg+   : 4-up grid
          (Same shape as Services so users get the same gesture.) */}
      <div className="relative max-w-6xl mx-auto">
        <div className="md:grid flex overflow-x-auto snap-x snap-mandatory scroll-px-5 xs:scroll-px-8 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 no-scrollbar pb-2 md:pb-0">
          {visible.map((s, i) => (
            <SupplementCard key={s._id} s={s} index={i} />
          ))}
        </div>
      </div>

      {visible.length === 0 && (
        <p className="text-center text-white/40 mt-10">
          Nothing in this category right now.
        </p>
      )}

      {/* Mobile-only swipe hint — fades when the user has interacted */}
      {visible.length > 1 && (
        <p className="md:hidden text-center text-[11px] text-white/30 mt-4 uppercase tracking-[0.25em]">
          Swipe →
        </p>
      )}
    </section>
  );
};

export default Supplements;
