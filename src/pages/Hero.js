import React from "react";
import { motion } from "framer-motion";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import Reveal from "../components/motion/Reveal";

const Hero = ({ handleClick }) => {
  const { content } = useSiteContent();
  const hero = content.hero;
  const bg = imgUrl(hero.backgroundImage);

  const words = (hero.headline || "").split(" ");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        id="hero"
        className="relative min-h-screen min-h-[100svh] w-full overflow-hidden flex flex-col"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover animate-ken-burns"
          style={bg ? { backgroundImage: `url(${bg})` } : undefined}
        />
        {/* Dark overlay — heavier at top (behind nav) and bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Content — flex-1 fills remaining height so it centers correctly */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-12 pt-28 pb-24">

          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-eyebrow"
          >
            Welcome to
          </motion.span>

          {/* Headline — white text, flex layout guarantees word spacing */}
          <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-white text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08]">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.1 }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          {/* Red accent rule under the headline */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.5 + words.length * 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "center" }}
            className="mt-4 h-[3px] w-16 rounded-full bg-brand shadow-glow-sm"
          />

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 + words.length * 0.1 }}
            className="mt-5 max-w-xl text-white/75 text-base xs:text-lg sm:text-xl font-normal leading-relaxed"
          >
            {hero.subheading}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55 + words.length * 0.1 }}
            className="mt-10 flex flex-col xs:flex-row items-center gap-4"
          >
            <a
              href="/"
              onClick={(e) => handleClick(e, "contact")}
              className="button text-base sm:text-lg px-8 py-3.5 animate-pulse-glow"
            >
              {hero.ctaLabel || "Start Today"}
            </a>
            <a
              href="/"
              onClick={(e) => handleClick(e, "membership")}
              className="button-ghost text-base sm:text-lg px-8 py-3.5"
            >
              View Plans
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.a
          href="/"
          onClick={(e) => handleClick(e, "services")}
          aria-label="Scroll down"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute z-10 bottom-8 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-9 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </motion.div>
        </motion.a>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="relative py-20 px-5 xs:px-8 sm:px-12 bg-ink-900 overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-64 rounded-full bg-brand/15 blur-3xl pointer-events-none"
        />
        <Reveal>
          <span className="section-eyebrow">Why us</span>
          <h2 className="section-title">
            {hero.whyChooseUsTitle || "Why Choose Us?"}
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-brand shadow-glow-sm" />
        </Reveal>

        <Reveal stagger delay={0.1} className="grid grid-cols-2 about-4:grid-cols-4 gap-5 sm:gap-8 place-items-center mt-12 max-w-5xl mx-auto relative z-10">
          {(hero.whyChooseUsItems || []).map((item, i) => {
            const iconUrl = imgUrl(item.icon);
            return (
              <div
                key={item._key || i}
                className="group glass-card flex flex-col justify-center items-center py-7 sm:py-9 px-4 w-full max-w-[260px] aspect-[3/2]"
              >
                <div className="relative mb-3">
                  <span className="absolute inset-0 rounded-full bg-brand/25 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {iconUrl && (
                    <img
                      src={iconUrl}
                      className="relative w-10 xs:w-12 transition-transform duration-300 group-hover:scale-110"
                      alt={item.title}
                    />
                  )}
                </div>
                <h4 className="text-sm xs:text-base sm:text-lg font-semibold text-white/90 text-center leading-snug">
                  {item.title}
                </h4>
              </div>
            );
          })}
        </Reveal>

        <Reveal delay={0.2} className="text-center mt-14">
          <p className="text-sm xs:text-base text-white/55">{hero.tagline1}</p>
          <p className="text-base xs:text-lg mt-2 text-white/85 italic font-medium">
            {hero.tagline2}
          </p>
        </Reveal>
      </section>
    </>
  );
};

export default Hero;
