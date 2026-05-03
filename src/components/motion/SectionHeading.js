import React from "react";
import { motion } from "framer-motion";

/**
 * Standard section heading with red eyebrow + animated underline accent.
 *   <SectionHeading eyebrow="Our Plans" title="Membership" sub="Pick a plan that fits your schedule." />
 */
const SectionHeading = ({ eyebrow, title, sub }) => {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.4 }}
          className="section-eyebrow"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="section-title"
      >
        {title}
      </motion.h2>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        style={{ transformOrigin: "center" }}
        className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-brand shadow-glow-sm"
      />
      {sub && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="section-sub"
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
