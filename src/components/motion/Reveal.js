import React from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Wraps children in a motion div that fades + slides into view on scroll.
 * Auto-disables itself when the user has reduced-motion enabled.
 *
 *   <Reveal delay={0.1}><h1>Hi</h1></Reveal>
 *   <Reveal stagger>{children}</Reveal>   // staggers immediate children
 */
const Reveal = ({
  children,
  delay = 0,
  duration = 0.6,
  y = 24,
  once = true,
  stagger = false,
  as: Tag = "div",
  className = "",
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const StaticTag = Tag;
    return (
      <StaticTag className={className} {...rest}>
        {children}
      </StaticTag>
    );
  }

  if (stagger) {
    const container = {
      hidden: {},
      visible: {
        transition: { staggerChildren: 0.08, delayChildren: delay },
      },
    };
    const item = {
      hidden: { opacity: 0, y },
      visible: { opacity: 1, y: 0, transition: { duration } },
    };
    const StaggerTag = motion[Tag] || motion.div;
    return (
      <StaggerTag
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.15 }}
        className={className}
        {...rest}
      >
        {React.Children.map(children, (child, i) =>
          child ? <motion.div variants={item} key={i}>{child}</motion.div> : null
        )}
      </StaggerTag>
    );
  }

  const SimpleTag = motion[Tag] || motion.div;
  return (
    <SimpleTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </SimpleTag>
  );
};

export default Reveal;
