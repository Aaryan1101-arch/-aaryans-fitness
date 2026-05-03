import React from "react";
import Hero from "./Hero";
import Services from "./Services";
import Gallery from "./Gallery";
import Team from "./Team";
import Membership from "./Membership";
import Reviews from "./Reviews";
import Contact from "./Contact";

const Home = ({ handleClick }) => {
  return (
    <>
      <Hero handleClick={handleClick} />
      <Services />
      <Gallery />
      <Team />
      <Membership handleClick={handleClick} />
      <Reviews />
      <Contact />
    </>
  );
};

export default Home;
