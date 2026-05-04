import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Full-screen image viewer with prev/next, Escape to close, click-outside to
 * close, and keyboard arrow navigation.
 *
 *   <Lightbox open items={images} index={i} onClose={...} onIndex={setI} />
 *   each item: { url, caption?, alt? }
 */
const Lightbox = ({ open, items, index, onClose, onIndex }) => {
  const goPrev = useCallback(() => {
    if (!items?.length) return;
    onIndex((index - 1 + items.length) % items.length);
  }, [index, items, onIndex]);

  const goNext = useCallback(() => {
    if (!items?.length) return;
    onIndex((index + 1) % items.length);
  }, [index, items, onIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    // Lock body scroll while the lightbox is open.
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose, goPrev, goNext]);

  if (!items?.length) return null;
  const current = items[index];

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Close */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close"
            className="absolute top-4 right-4 icon-button w-11 h-11"
          >
            <svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 icon-button w-12 h-12"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          {/* Image — drag horizontally to swipe on touch */}
          <motion.div
            key={current.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            drag={items.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) goNext();
              else if (info.offset.x > 60) goPrev();
            }}
            className="relative max-w-[90vw] max-h-[85vh] cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={current.url}
              alt={current.alt || current.caption || ""}
              draggable={false}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-glow select-none"
            />
            {current.caption && (
              <p className="text-center text-white/80 text-sm mt-3">
                {current.caption}
              </p>
            )}
            <p className="text-center text-white/40 text-xs mt-1">
              {index + 1} / {items.length}
            </p>
          </motion.div>

          {/* Next */}
          {items.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 icon-button w-12 h-12"
            >
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
