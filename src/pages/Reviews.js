import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import SectionHeading from "../components/motion/SectionHeading";

const INTERVAL = 5500;

const Star = ({ size = "w-4 h-4", filled = true }) => (
  <svg
    className={`${size} ${filled ? "text-yellow-300" : "text-white/15"} me-1`}
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 22 20"
  >
    <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
  </svg>
);

const StarsRow = ({ rating = 5, size }) => (
  <div className="flex items-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} size={size} filled={i < rating} />
    ))}
  </div>
);

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
};

const ReviewCarousel = ({ reviews }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const paginate = useCallback((dir) => {
    setDirection(dir);
    setIndex((i) => (i + dir + reviews.length) % reviews.length);
  }, [reviews.length]);

  // Auto-advance; timer resets whenever the user manually navigates.
  useEffect(() => {
    if (reviews.length <= 1) return;
    const id = setInterval(() => paginate(1), INTERVAL);
    return () => clearInterval(id);
  }, [index, paginate, reviews.length]);

  if (!reviews.length) return null;
  const review = reviews[index];
  const photo = imgUrl(review.photo);

  return (
    <div className="flex flex-col gap-4">
      {/* Slide area */}
      <div className="overflow-hidden rounded-2xl">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={review._id || index}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            drag={reviews.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) paginate(1);
              else if (info.offset.x > 60) paginate(-1);
            }}
            className="relative bg-gradient-to-br from-ink-700 via-ink-700 to-ink-800 p-6 sm:p-8 rounded-2xl border border-white/10 shadow-card cursor-grab active:cursor-grabbing select-none"
          >
            {/* decorative quote glyph */}
            <span
              aria-hidden
              className="absolute top-3 right-4 text-7xl font-serif text-brand/20 leading-none pointer-events-none"
            >
              &rdquo;
            </span>
            <div className="flex items-start gap-4">
              {photo && (
                <img
                  src={photo}
                  alt={review.name}
                  draggable={false}
                  className="h-14 w-14 rounded-full object-cover object-center ring-2 ring-brand/40 ring-offset-2 ring-offset-ink-700 flex-shrink-0"
                />
              )}
              <div>
                <p className="text-lg font-medium text-white">{review.name}</p>
                <StarsRow rating={review.rating || 5} />
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-white/70">{review.review}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots + arrows */}
      {reviews.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => paginate(-1)}
            aria-label="Previous review"
            className="icon-button w-9 h-9"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                aria-label={`Review ${i + 1}`}
                className={`rounded-full transition-all duration-300 touch-manipulation ${
                  i === index
                    ? "w-6 h-2 bg-brand shadow-glow-sm"
                    : "w-2 h-2 bg-white/25 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => paginate(1)}
            aria-label="Next review"
            className="icon-button w-9 h-9"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

const Reviews = () => {
  const { content } = useSiteContent();
  const reviews = content.reviews || [];

  const avgRating =
    reviews.length === 0
      ? 5
      : reviews.reduce((s, r) => s + (r.rating || 5), 0) / reviews.length;
  const totalReviews = reviews.length;

  return (
    <section id="reviews" className="section bg-ink-800 overflow-hidden">
      <SectionHeading
        eyebrow="Testimonials"
        title="Reviews"
        sub="What our members say about training at the zone."
      />
      <div className="flex flex-col review:flex-row gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="w-full review:w-1/2"
        >
          <p className="text-2xl sm:text-3xl lg:text-4xl mb-4 lg:mb-6 font-semibold text-center review:text-left text-white leading-tight">
            What Our Happy Members Say About Us
          </p>
          <p className="sm:text-lg text-white/60 text-center review:text-left leading-relaxed">
            Real stories from people who walked in nervous and walked out
            stronger. Your transformation could be next.
          </p>
          <div className="mt-5 lg:mt-7 flex items-center justify-center review:justify-start gap-3">
            <StarsRow rating={Math.round(avgRating)} size="w-6 h-6" />
            <p className="font-medium text-white/70">
              <span className="text-white">{avgRating.toFixed(1)}</span> ·{" "}
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full review:w-1/2"
        >
          <ReviewCarousel reviews={reviews} />
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
