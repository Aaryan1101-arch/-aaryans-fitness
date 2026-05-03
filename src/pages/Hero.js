import React from "react";
import equipment from "../assets/equipment.webp"
import nutrition from "../assets/nutrition.webp"
import training from "../assets/training.webp"
import unique from "../assets/unique.webp"

const Hero = ({ handleClick }) => {
  return (
    <>
      <div id="hero" className="bg-[url('./assets/hero-bg.jpg')] bg-center-top bg-no-repeat bg-cover h-screen w-full" />
      <div className="absolute h-screen inset-0 flex justify-center items-center bg-black/60">
        <div className="text-center px-8 xs:px-12 sm:px-16">
          <p className="text-[#a80717] text-3xl xs:text-4xl sm:text-5xl font-semibold">Aaryan's Fitness Club</p>
          <p className="mt-2 mb-8 text-white/90 xs:text-lg sm:text-xl font-medium">At <span className="font-semibold">The Aaryan's Zone</span>, we do everything to help you become your best self.</p>
          <a href="/" onClick={(e) => handleClick(e, "contact")} className="button text-lg py-3">Start Today</a>
        </div>
      </div>
      <div className="py-16 text-center px-5 xs:px-8 sm:px-12 bg-[#111111]">
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-semibold text-white/90 uppercase">Why Choose Us?</h1>
        <div className="grid grid-cols-2 about-4:grid-cols-4 gap-12 md:gap-16 place-items-center py-12">
          <div className="text-white/90 ml-auto about-4:mx-auto flex flex-col justify-center items-center rounded-2xl border border-white/30 py-4 sm:py-8 px-2 w-36 xs:w-44 sm:w-60 aspect-[3/2]">
            <img src={equipment} className="w-10 xs:w-12" alt="Modern Equipment" />
            <h4 className="text-sm xs:text-base sm:text-lg font-medium sm:font-semibold mt-2 sm:mt-4">Modern Equipment</h4>
          </div>
          <div className="text-white/90 mr-auto about-4:mx-auto flex flex-col justify-center items-center rounded-2xl border border-white/30 py-4 sm:py-8 px-2 w-36 xs:w-44 sm:w-60 aspect-[3/2]">
            <img src={nutrition} className="w-10 xs:w-12" alt="Healthy Nutrition" />
            <h4 className="text-sm xs:text-base sm:text-lg font-medium sm:font-semibold mt-2 sm:mt-4">Healthy Nutrition</h4>
          </div>
          <div className="text-white/90 ml-auto about-4:mx-auto flex flex-col justify-center items-center rounded-2xl border border-white/30 py-4 sm:py-8 px-2 w-36 xs:w-44 sm:w-60 aspect-[3/2]">
            <img src={training} className="w-10 xs:w-12" alt="Expert Training" />
            <h4 className="text-sm xs:text-base sm:text-lg font-medium sm:font-semibold mt-2 sm:mt-4">Expert Training</h4>
          </div>
          <div className="text-white/90 mr-auto about-4:mx-auto flex flex-col justify-center items-center rounded-2xl border border-white/30 py-4 sm:py-8 px-2 w-36 xs:w-44 sm:w-60 aspect-[3/2]">
            <img src={unique} className="w-10 xs:w-12" alt="Tailored Package" />
            <h4 className="text-sm xs:text-base sm:text-lg font-medium sm:font-semibold mt-2 sm:mt-4">Tailored Package</h4>
          </div>
        </div>
        <p className="text-sm xs:text-lg text-white/60">Ditch the excuses, grab your motivation backpack!</p>
        <p className="xs:text-lg mt-2 text-white/60">"Get Ready To Reach Your Fitness Goals"</p>
      </div>
    </>
  );
};

export default Hero;
