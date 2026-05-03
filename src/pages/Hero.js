import React from "react";
import { motion } from "framer-motion";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import Reveal from "../components/motion/Reveal";

const Hero = ({ handleClick }) => {
  const { content } = useSiteContent();
  const hero = content.hero;
  const bg = imgUrl(hero.backgroundImage);

  // Stagger the headline word-by-word.
  const words = (hero.headline || "").split(" ");

  return (
    <>
      <section
        id="hero"
        className="relative h-screen w-full overflow-hidden"
      >
        {/* Background image with slow Ken Burns animation */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover animate-ken-burns"
          style={bg ? { backgroundImage: `url(${bg})` } : undefined}
        />
        {/* Gradient + dim overlay so text stays readable on any photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/55 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />

        {/* Headline content */}
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6 sm:px-12">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-eyebrow"
          >
            Welcome to
          </motion.span>

          <h1 className="text-brand text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] drop-shadow-[0_4px_20px_rgba(168,7,23,0.5)]">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.55, delay: 0.25 + i * 0.08 }}
                className="inline-block mr-3"
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.25 + words.length * 0.08 + 0.1,
            }}
            className="mt-5 max-w-2xl text-white/85 text-base xs:text-lg sm:text-xl font-medium"
          >
            {hero.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.5 + words.length * 0.08,
            }}
            className="mt-9 flex flex-col xs:flex-row items-center gap-4"
          >
            <a
              href="/"
              onClick={(e) => handleClick(e, "contact")}
              className="button text-base sm:text-lg px-7 py-3 animate-pulse-glow"
            >
              {hero.ctaLabel || "Start Today"}
            </a>
            <a
              href="/"
              onClick={(e) => handleClick(e, "membership")}
              className="button-ghost text-base sm:text-lg px-7 py-3"
            >
              View Plans
            </a>
          </motion.div>
        </div>

        {/* Animated scroll indicator */}
        <motion.a
          href="/"
          onClick={(e) => handleClick(e, "services")}
          aria-label="Scroll down"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-9 rounded-full border-2 border-white/40 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-2 rounded-full bg-white/70" />
          </motion.div>
        </motion.a>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-20 px-5 xs:px-8 sm:px-12 bg-ink-900 overflow-hidden">
        {/* Decorative red glow blob */}
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[80vw] h-64 rounded-full bg-brand/20 blur-3xl pointer-events-none"
        />
        <Reveal>
          <span className="section-eyebrow">Why us</span>
          <h2 className="section-title">
            {hero.whyChooseUsTitle || "Why Choose Us?"}
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-brand shadow-glow-sm" />
        </Reveal>

        <Reveal stagger delay={0.1} className="grid grid-cols-2 about-4:grid-cols-4 gap-6 sm:gap-10 place-items-center mt-14 max-w-6xl mx-auto relative z-10">
          {(hero.whyChooseUsItems || []).map((item, i) => {
            const iconUrl = imgUrl(item.icon);
            return (
              <div
                key={item._key || i}
                className="group glass-card flex flex-col justify-center items-center py-6 sm:py-8 px-4 w-full max-w-xs aspect-[3/2]"
              >
                <div className="relative mb-3">
                  {/* Soft glow behind the icon on hover */}
                  <span className="absolute inset-0 rounded-full bg-brand/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {iconUrl && (
                    <img
                      src={iconUrl}
                      className="relative w-10 xs:w-12 transition-transform duration-300 group-hover:scale-110"
                      alt={item.title}
                    />
                  )}
                </div>
                <h4 className="text-sm xs:text-base sm:text-lg font-semibold text-white/90 text-center">
                  {item.title}
                </h4>
              </div>
            );
          })}
        </Reveal>

        <Reveal delay={0.2} className="text-center mt-14">
          <p className="text-sm xs:text-lg text-white/60">{hero.tagline1}</p>
          <p className="text-base xs:text-xl mt-2 text-white/90 italic">
            {hero.tagline2}
          </p>
        </Reveal>
      </section>
    </>
  );
};

export default Hero;
