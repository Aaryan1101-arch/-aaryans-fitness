import React from "react";

const Membership = ({ handleClick }) => {
  const svg = <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20" className="w-5 text-[#a80717]" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" fill="currentColor"></path>
  </svg>;
  return (
    <section id="membership" className="py-16 px-5 xs:px-8 sm:px-12 md:px-16 text-white/90 bg-[#111111]">
      <h1 className="mb-4 text-xl xs:text-2xl sm:text-3xl text-center font-semibold uppercase">Membership</h1>
      <p className="mb-8 team:mb-12 text-center text-white/60 sm:text-lg font-medium team:w-2/3 mx-auto">We offer a range of membership options designed to help you reach your fitness goals, with an emphasis on individual programs.</p>
      <div className="flex justify-center flex-wrap gap-12">
        <div className=" border-[#a80717] border-2 rounded-2xl w-80 p-10">
          <p className="font-medium mb-2">Bill Monthly</p>
          <p className="text-2xl font-semibold">RS 3000</p>
          <hr className="my-4 border-white/60" />
          <p className="uppercase font-mono font-semibold text-sm mb-4">What's Included</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Unlimited Gym Access</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Aerobics</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Kick Boxing</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Cardio Boxing</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Calisthenics</p>
            </div>
          </div>
        </div>
        <div className=" border-[#a80717] border-2 rounded-2xl w-80 p-10 relative">
          <p className="font-medium mb-2">Bill Yearly</p>
          <p className="text-2xl font-semibold">RS 25000</p>
          <hr className="my-4 border-white/60" />
          <p className="uppercase font-mono font-semibold text-sm mb-4">What's Included</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Unlimited Gym Access</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Aerobics</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Kick Boxing</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Cardio Boxing</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Calisthenics</p>
            </div>
          </div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 button py-2 px-3 rounded">
            <p className="uppercase font-mono font-medium text-sm">Popular Pricing</p>
          </div>
        </div>
        <div className=" border-[#a80717] border-2 rounded-2xl w-80 p-10">
          <p className="font-medium mb-2">Bill Quarterly</p>
          <p className="text-2xl font-semibold">RS 14000</p>
          <hr className="my-4 border-white/60" />
          <p className="uppercase font-mono font-semibold text-sm mb-4">What's Included</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Unlimited Gym Access</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Aerobics</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Kick Boxing</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Cardio Boxing</p>
            </div>
            <div className="flex items-center gap-2">
              {svg}
              <p className="text-white/60">Calisthenics</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 border border-white/30 py-5 lg:py-8 px-5 lg:px-12 rounded-lg flex items-center flex-col review:flex-row gap-5 review:gap-12">
        <p className="text-xl sm:text-2xl leading-relaxed font-semibold text-center review:text-left">WORKOUT PROGRAM MADE FOR YOU!</p>
        <div className="flex flex-col items-center review:items-start">
          <p className="text-white/60 leading-relaxed mb-4 md:w-4/5 review:w-full text-center review:text-left">Special programs that we provide for those of you who want to have a healthy and ideal body. Free to choose according to your goals!</p>
          <a href="/" onClick={(e) => handleClick(e, "contact")} className="button">Claim your free trial</a>
        </div>
      </div>
    </section>
  );
};

export default Membership;
