import React from "react";

const Team = () => {
  return (
    <section
      id="team"
      className="py-16 px-5 xs:px-8 sm:px-12 md:px-16 text-white/90 bg-[#171717]"
    >
      <h1 className="mb-4 text-xl xs:text-2xl sm:text-3xl text-center font-semibold uppercase">
        Our Team
      </h1>
      <p className="mb-8 text-center text-white/60 sm:text-lg font-medium team:w-2/3 mx-auto">
        Our specialists are very prepared and fit the bill to furnish you with
        shape centered alterations that will push you as far as possible without
        bargaining your security.
      </p>
      <div className="relative">
        <div className="md:grid flex overflow-x-auto snap-x snap-mandatory lg:grid-cols-3 md:grid-cols-2 gap-4 sm:gap-8 team:gap-12 lg:place-items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 snap-center bg-[url('./assets/team.jpg')] bg-center-top bg-no-repeat bg-cover w-10/12 xs:w-9/12 md:w-full aspect-[5/4] border border-white/30 relative"
            >
              <div className="card-content w-[70%] bg-black/90 absolute left-0 bottom-0 pl-3 py-0.5">
                <p className="text-[#a80717] text-xl font-medium mb-0.5">
                  Lady Trainer
                </p>
                <p className="text-lg">Zumba</p>
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

export default Team;
