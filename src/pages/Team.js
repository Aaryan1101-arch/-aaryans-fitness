import React from "react";
import { motion } from "framer-motion";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";
import SectionHeading from "../components/motion/SectionHeading";

const Team = () => {
  const { content } = useSiteContent();
  const members = content.team || [];

  return (
    <section
      id="team"
      className="section bg-ink-900 overflow-hidden"
    >
      <SectionHeading
        eyebrow="Coaches"
        title="Our Team"
        sub="Form-focused specialists who push you safely past your limit, then teach you to do it on your own."
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="md:grid flex overflow-x-auto snap-x snap-mandatory md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 no-scrollbar">
          {members.map((m, i) => {
            const photo = imgUrl(m.photo);
            return (
              <motion.div
                key={m._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group flex-shrink-0 snap-center w-10/12 xs:w-9/12 md:w-full aspect-[4/5] relative rounded-2xl overflow-hidden border border-white/10 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div
                  className="absolute inset-0 bg-center-top bg-no-repeat bg-cover transition-transform duration-700 group-hover:scale-110"
                  style={
                    photo ? { backgroundImage: `url(${photo})` } : undefined
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                {/* Name + role: slides up & shows role on hover */}
                <div className="absolute left-0 right-0 bottom-0 p-5 transition-all duration-300 group-hover:pb-7">
                  <p className="text-brand text-xl font-semibold">{m.name}</p>
                  {m.role && (
                    <p className="text-white/80 text-base mt-0.5 transition-all duration-300">
                      {m.role}
                    </p>
                  )}
                  <div className="mt-3 h-[2px] w-10 bg-brand rounded-full transition-all duration-300 group-hover:w-20" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Team;
