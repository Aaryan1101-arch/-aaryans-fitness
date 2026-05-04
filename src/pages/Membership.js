import React from "react";
import { motion } from "framer-motion";
import { useSiteContent } from "../sanity/SiteContent";
import Reveal from "../components/motion/Reveal";
import SectionHeading from "../components/motion/SectionHeading";

const CheckIcon = () => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 20 20"
    className="w-5 text-brand flex-shrink-0"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const PlanCard = ({ plan, index }) => {
  const popular = plan.isPopular;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className={`relative w-full max-w-sm rounded-2xl p-8 sm:p-10 transition-all duration-300 ${
        popular
          ? "border-2 border-brand bg-gradient-to-br from-brand/10 via-ink-800 to-ink-900 shadow-glow"
          : "border border-white/10 bg-white/[0.03] hover:border-white/30 shadow-card"
      }`}
    >
      {popular && (
        <>
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 button text-xs uppercase tracking-widest py-1.5 px-4 animate-pulse-glow">
            ★ Popular
          </span>
          <span
            aria-hidden
            className="absolute -inset-px rounded-2xl bg-gradient-to-br from-brand/40 via-transparent to-transparent opacity-30 pointer-events-none"
          />
        </>
      )}
      <p className="text-sm uppercase tracking-[0.25em] text-white/50 mb-2">
        {plan.name}
      </p>
      <p className="text-4xl font-extrabold text-white">
        {plan.price}
      </p>
      <div className="my-6 divider" />
      <p className="uppercase font-mono font-semibold text-xs text-white/60 mb-4 tracking-widest">
        What's Included
      </p>
      <ul className="space-y-3">
        {(plan.features || []).map((feat, i) => (
          <motion.li
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
            key={i}
            className="flex items-start gap-3"
          >
            <CheckIcon />
            <span className="text-white/75">{feat}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

const Membership = ({ handleClick }) => {
  const { content } = useSiteContent();
  const plans = content.plans || [];

  return (
    <section
      id="membership"
      className="section bg-ink-900 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute top-1/2 -translate-y-1/2 left-0 w-72 h-72 bg-brand/10 rounded-full blur-3xl pointer-events-none"
      />
      <SectionHeading
        eyebrow="Pricing"
        title="Membership"
        sub="Pick the cadence that fits your routine. Switch any time — no lock-in, no penalty."
      />

      <div className="relative z-10 flex justify-center flex-wrap gap-8 lg:gap-10 mt-6 pt-4">
        {plans.map((plan, i) => (
          <PlanCard plan={plan} key={plan._id} index={i} />
        ))}
      </div>

      <Reveal delay={0.15} className="mt-16 max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-ink-800 via-ink-800 to-ink-900 py-7 px-6 lg:py-9 lg:px-12 flex items-center flex-col review:flex-row gap-6 review:gap-12">
          {/* corner glow */}
          <div
            aria-hidden
            className="absolute -right-20 -top-20 w-60 h-60 bg-brand/30 rounded-full blur-3xl pointer-events-none"
          />
          <p className="relative z-10 text-xl sm:text-2xl leading-snug font-semibold text-center review:text-left">
            <span className="text-white">WORKOUT PROGRAM</span>{" "}
            <span className="text-brand">MADE FOR YOU!</span>
          </p>
          <div className="relative z-10 flex flex-col items-center review:items-start">
            <p className="text-white/60 leading-relaxed mb-4 md:w-4/5 review:w-full text-center review:text-left">
              Special programs that we provide for those of you who want to have
              a healthy and ideal body. Free to choose according to your goals!
            </p>
            <a
              href="/"
              onClick={(e) => handleClick(e, "contact")}
              className="button"
            >
              Claim your free trial
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Membership;
