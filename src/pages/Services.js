import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import SectionHeading from "../components/motion/SectionHeading";

const ServiceCard = ({ service, index }) => {
  const [open, setOpen] = useState(false);
  const img = imgUrl(service.image);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => setOpen((v) => !v)}
      className="group relative flex-shrink-0 snap-center w-10/12 xs:w-9/12 md:w-full aspect-[5/4] rounded-2xl overflow-hidden border border-white/10 cursor-pointer shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Background image with hover zoom */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
        style={img ? { backgroundImage: `url(${img})` } : undefined}
      />
      {/* Bottom gradient so the title is always readable */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

      {/* Title chip */}
      <div className="absolute top-4 left-0 bg-black/80 backdrop-blur-sm pl-4 pr-6 py-2 card-content border-l-4 border-brand">
        <p className="text-brand text-base sm:text-lg font-semibold">
          {service.title}
        </p>
      </div>

      {/* Desktop: shows on hover via group-hover. Mobile: toggled by click state. */}
      <div
        className={`absolute top-0 left-0 right-0 bg-black/85 backdrop-blur overflow-hidden w-full transition-all ease-in-out duration-300 ${
          open ? "h-full" : "h-0 group-hover:h-full"
        }`}
      >
        <div className="h-full flex flex-col justify-center items-center px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-brand mb-3">
            Class times
          </p>
          <p className="text-xl font-medium text-white mb-2">{service.title}</p>
          <div className="text-white/80 text-base text-center space-y-1">
            <p>
              <span className="text-white/40">Morning · </span>
              {service.morningHours}
            </p>
            <p>
              <span className="text-white/40">Evening · </span>
              {service.eveningHours}
            </p>
          </div>
        </div>
      </div>

      {/* "tap" hint — hidden once overlay is open, hidden on desktop (hover handles it) */}
      {!open && (
        <div className="touch-reveal-hint absolute bottom-3 right-3 md:hidden opacity-0 group-hover:opacity-0 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 text-[11px] font-medium text-white/80 pointer-events-none">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-3.5 h-3.5 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" /></svg>
          Tap for hours
        </div>
      )}
    </motion.div>
  );
};

const Services = () => {
  const { content } = useSiteContent();
  const services = content.services || [];

  return (
    <section
      id="services"
      className="section bg-ink-800 overflow-hidden"
    >
      <SectionHeading
        eyebrow="What we do"
        title="Our Services"
        sub="Stop searching, start thriving. From strength to mindfulness — pick the discipline that moves you."
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="md:grid flex overflow-x-auto snap-x snap-mandatory scroll-px-5 xs:scroll-px-8 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 no-scrollbar pb-2 md:pb-0">
          {services.map((service, i) => (
            <ServiceCard key={service._id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
