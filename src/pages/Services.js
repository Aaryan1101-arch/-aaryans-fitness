import React, { useState } from "react";

const Services = () => {
  const [showDetailsOnclick, setShowDetailsOnClick] = useState(true);
  return (
    <section
      id="services"
      className="py-16 px-5 xs:px-8 sm:px-12 md:px-16 text-white/90 bg-[#171717]"
    >
      <h1 className="mb-4 text-xl xs:text-2xl sm:text-3xl text-center font-semibold uppercase">
        Our Services
      </h1>
      <p className="mb-2 text-center text-white/60 text-lg font-medium mx-auto">
        Stop searching, start thriving!
      </p>
      <p className="mb-8 text-center text-white/60 sm:text-lg font-medium team:w-2/3 mx-auto">
        Unlock your potential, from fitness feats to career climbs. Let's make
        magic happen!
      </p>
      <div className="relative">
        <div className="md:grid flex overflow-x-auto snap-x snap-mandatory md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 team:gap-12 place-items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-center bg-[url('./assets/team.jpg')] bg-center-top bg-no-repeat bg-cover w-10/12 xs:w-9/12 md:w-full aspect-[5/4] border border-white/30 relative container"
              onClick={() => setShowDetailsOnClick(!showDetailsOnclick)}
            >
              <div
                className={`overlay absolute top-0 left-0 right-0 bg-black/80 overflow-hidden w-full transition-all ease-in-out duration-300
                ${showDetailsOnclick ? "h-0" : "h-[100%]"}`}
              >
                <div className="h-full flex flex-col justify-center items-center">
                  <p className="text-xl font-medium uppercase mb-2">Classes</p>
                  <p className="text-lg mb-1">Morning: 7 AM to 9 AM</p>
                  <p className="text-lg">Evening: 6 PM to 8 PM</p>
                </div>
              </div>
              <div className="card-content w-[70%] bg-black/80 absolute left-0 top-0 pl-3 py-1">
                <p className="text-[#a80717] text-xl font-medium">
                  Body Building
                </p>
              </div>
            </div>
          ))}
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 bg-black/70 rounded-full p-2 absolute md:hidden top-1/2 left-1 transform -translate-y-1/2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 bg-black/70 rounded-full p-2 absolute md:hidden top-1/2 right-1 transform -translate-y-1/2">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </section>
  );
};

export default Services;
