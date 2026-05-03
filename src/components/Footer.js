import React from "react";
import logoStamp from "../assets/logo-stamp.png";

const Footer = ({ handleClick }) => {
  return (
    <section className="bg-[#171717]">
      <hr className="border-white/30 w-11/12 mx-auto" />
      <footer className="px-5 xs:px-8 sm:px-12 md:px-16 py-8 text-white/70 grid grid-cols-1 footer-2:grid-cols-2 footer-4:grid-cols-4 text-center footer-4:text-left gap-8 place-items-center">
        <div className="flex flex-col justify-center items-center">
          <img src={logoStamp} className="w-32 aspect-[3/2] object-contain mb-2" alt="Aaryan's Fitness Center" />
          <p>Aaryan's Fitness Club</p>
          <p>The Aaryan's Zone</p>
        </div>
        <div>
          <p className="text-lg font-medium mb-4">Contact</p>
          <p className="mb-2"><a href="tel:+9779851173983">+977 9851173983</a> / <a href="tel:+9779869636446">9869636446</a></p>
          <p className="mb-2"><a href="mailto:theaaryansclub@gmail.com">theaaryansclub@gmail.com</a></p>
          <p><a href="https://maps.app.goo.gl/hGjRzgwaAv9yaCsh6" rel="noreferrer" target="_blank">Pepsicola, Kathmandu, Nepal</a></p>
        </div>
        <div>
          <p className="text-lg font-medium mb-4">Social</p>
          <p className="mb-2"><a href="https://www.facebook.com/BaidhyaAnish?mibextid=ZbWKwL" rel="noreferrer" target="_blank" className="mb-1">Facebook</a></p>
          <p className="mb-2"><a href="https://www.instagram.com/theaaryansfitnesszone/?igsh=MTM0eXdocnNiNTdybw%3D%3D" rel="noreferrer" target="_blank" className="mb-1">Instagram</a></p>
          <p>Whatsapp</p>
        </div>
        <div>
          <p className="text-lg font-medium mb-4">Useful Links</p>
          <p className="mb-2"><a href="/" onClick={(e) => handleClick(e, "services")}>Services</a></p>
          <p className="mb-2"><a href="/" onClick={(e) => handleClick(e, "gallery")}>Gallery</a></p>
          <p><a href="/" onClick={(e) => handleClick(e, "membership")}>Membership</a></p>
        </div>
      </footer>
      <p className="pb-2 text-white/30 text-center text-sm">© Aaryan's Fitness Club. All Rights Reserved</p>
    </section>
  );
};

export default Footer;
