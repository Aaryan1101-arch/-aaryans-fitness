import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/logo.png";

const Navbar = ({ handleClick }) => {
  const [showMenu, setShowMenu] = useState(true);
  const menuRef = useRef();
  useEffect(() => {
    let handle = (e) => {
      if (menuRef && menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(true);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [menuRef]);

  return (
    <nav className="navbar">
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-4">
          <div onClick={() => setShowMenu(!showMenu)} className="cursor-pointer">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 lg:hidden text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </div>
          <a href="/" onClick={(e) => handleClick(e, "hero")}><img src={logo} className="w-20 aspect-[3/2] object-contain" alt="Aaryan's Fitness Center" /></a>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <a href="/" onClick={(e) => handleClick(e, "hero")} className="hover:text-white">Home</a>
          <a href="/" onClick={(e) => handleClick(e, "services")} className="hover:text-white">Services</a>
          <a href="/" onClick={(e) => handleClick(e, "gallery")} className="hover:text-white">Gallery</a>
          <a href="/" onClick={(e) => handleClick(e, "team")} className="hover:text-white">Team</a>
          <a href="/" onClick={(e) => handleClick(e, "membership")} className="hover:text-white">Membership</a>
          <a href="/" onClick={(e) => handleClick(e, "reviews")} className="hover:text-white">Reviews</a>
          <a href="/" onClick={(e) => handleClick(e, "contact")} className="hover:text-white">Contact</a>
        </div>
      </div>
      <div ref={menuRef} className={`bg-black/95 absolute lg:hidden w-56 h-screen top-0 transition-all ease-in-out ${showMenu ? "-left-56" : "left-0"}`}>
        <div onClick={() => setShowMenu(!showMenu)} className="cursor-pointer">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 absolute right-6 top-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="grid grid-cols-1 divide-y divide-white/30 mt-16">
          <a href="/" onClick={(e) => handleClick(e, "hero")} className="hover:text-white px-8 sm:px-12 md:px-16 py-4">Home</a>
          <a href="/" onClick={(e) => handleClick(e, "services")} className="hover:text-white px-8 sm:px-12 md:px-16 py-4">Services</a>
          <a href="/" onClick={(e) => handleClick(e, "gallery")} className="hover:text-white px-8 sm:px-12 md:px-16 py-4">Gallery</a>
          <a href="/" onClick={(e) => handleClick(e, "team")} className="hover:text-white px-8 sm:px-12 md:px-16 py-4">Team</a>
          <a href="/" onClick={(e) => handleClick(e, "membership")} className="hover:text-white px-8 sm:px-12 md:px-16 py-4">Membership</a>
          <a href="/" onClick={(e) => handleClick(e, "reviews")} className="hover:text-white px-8 sm:px-12 md:px-16 py-4">Reviews</a>
          <a href="/" onClick={(e) => handleClick(e, "contact")} className="hover:text-white px-8 sm:px-12 md:px-16 py-4">Contact</a>
        </div>
      </div>
      <a href="/" onClick={(e) => handleClick(e, "contact")} className="button cursor-pointer">Join Now</a>
    </nav>
  );
};

export default Navbar;
