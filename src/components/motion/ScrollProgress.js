import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin red progress bar fixed to the top of the viewport.
 * Uses framer-motion's useScroll hook so it reads native scroll position.
 */
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-gradient-to-r from-brand-light via-brand to-brand-dark shadow-glow-sm pointer-events-none"
      aria-hidden
    />
  );
};

export default ScrollProgress;
