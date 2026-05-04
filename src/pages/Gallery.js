import { motion, AnimatePresence } from "framer-motion";
import React, { useMemo, useState } from "react";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import SectionHeading from "../components/motion/SectionHeading";
import Lightbox from "../components/Lightbox";

const CATEGORIES = [
  { value: null, label: "All" },
  { value: "ambience", label: "Ambience" },
  { value: "member", label: "Members" },
  { value: "equipment", label: "Equipment" },
  { value: "event", label: "Events" },
];

const Gallery = () => {
  const { content } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const visible = useMemo(() => {
    const all = content.gallery || [];
    if (!activeCategory) return all;
    return all.filter((p) => p.category === activeCategory);
  }, [content.gallery, activeCategory]);

  const lightboxItems = useMemo(
    () =>
      visible
        .map((p) => ({
          url: imgUrl(p.image),
          caption: p.caption,
        }))
        .filter((p) => p.url),
    [visible]
  );

  const openAt = (i) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  return (
    <section
      id="gallery"
      className="section bg-ink-900 overflow-hidden"
    >
      <SectionHeading
        eyebrow="Snapshots"
        title="Gallery"
        sub="Step inside the zone — moments from the floor, our members, and what we love about the space."
      />

      {/* Filter pills */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4 }}
        className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10"
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat.value;
          return (
            <button
              key={String(cat.value)}
              onClick={() => setActiveCategory(cat.value)}
              className={`min-h-[44px] px-5 py-2.5 text-sm rounded-full border transition-all duration-300 touch-manipulation ${
                active
                  ? "bg-brand text-white border-brand shadow-glow-sm"
                  : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </motion.div>

      <motion.div
        layout
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((img, i) => {
            const url = imgUrl(img.image);
            if (!url) return null;
            return (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                key={img._id}
                onClick={() => openAt(i)}
                className="group relative overflow-hidden rounded-xl aspect-square cursor-zoom-in border border-white/5 hover:border-brand/40 transition-colors"
              >
                <img
                  src={url}
                  alt={img.caption || "gallery"}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="touch-reveal-hint absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-xs font-medium">
                    {img.caption || img.category}
                  </span>
                </div>
                {/* Zoom-in hint icon */}
                <div className="touch-reveal-hint absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="text-center text-white/40 mt-10">
          No photos in this category yet.
        </p>
      )}

      <Lightbox
        open={lightboxOpen}
        items={lightboxItems}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onIndex={setLightboxIndex}
      />
    </section>
  );
};

export default Gallery;
