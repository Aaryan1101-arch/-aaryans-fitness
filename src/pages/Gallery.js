import { motion } from "framer-motion";
import React, { useState } from "react";
import { photo } from "../components/Photo";

const Gallery = () => {
  const [image, setImage] = useState(photo);
  const filterImage = (e) => {
    const result = photo.filter((i) => i.category === e);
    setImage(result);
  };
  return (
    <section id="gallery" className="py-16 px-5 xs:px-8 sm:px-12 md:px-16 text-white/90 bg-[#111111]">
      <h1 className="mb-8 text-xl xs:text-2xl sm:text-3xl text-center font-semibold uppercase">Gallery</h1>
      <div className="font-medium xs:text-lg text-center text-white/60 mb-8">
        <ul className="flex flex-wrap text-center gap-4 xs:gap-8 justify-center">
          <button
            onClick={() => filterImage("ambience")}
            className="py-1 border-b-2 border-transparent hover:text-white/90 hover:border-white/30 focus:text-[#a80717] focus:border-[#a80717]"
          >
            Ambience
          </button>
          <button
            onClick={() => filterImage("member")}
            className="py-1 border-b-2 border-transparent hover:text-white/90 hover:border-white/30 focus:text-[#a80717] focus:border-[#a80717]"
          >
            Members
          </button>
          <button
            onClick={() => filterImage("equipment")}
            className="py-1 border-b-2 border-transparent hover:text-white/90 hover:border-white/30 focus:text-[#a80717] focus:border-[#a80717]"
          >
            Equipments
          </button>
          <button
            onClick={() => filterImage("event")}
            className="py-1 border-b-2 border-transparent hover:text-white/90 hover:border-white/30 focus:text-[#a80717] focus:border-[#a80717]"
          >
            Events
          </button>
        </ul>
      </div>
      <div className="relative">
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:grid lg:grid-cols-3 gap-4 sm:gap-8 lg:gap-12 place-items-center">
          {image.map((img) => (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              key={img.id}
              className="w-72 lg:w-full aspect-[3/2] flex-shrink-0 snap-center"
            >
              <img
                className="w-full h-full object-cover"
                src={img.url}
                alt="gallery"
              />
            </motion.div>
          ))}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 bg-black/70 rounded-full p-2 absolute lg:hidden top-1/2 left-1 transform -translate-y-1/2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 bg-black/70 rounded-full p-2 absolute lg:hidden top-1/2 right-1 transform -translate-y-1/2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </section>
  );
};

export default Gallery;
