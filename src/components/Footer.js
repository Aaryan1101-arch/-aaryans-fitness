import React from "react";
import { useSiteContent, imgUrl } from "../sanity/SiteContent";

const SocialIcon = ({ kind }) => {
  switch (kind) {
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.62.77-1.62 1.56V12h2.76l-.44 2.89h-2.32v6.99A10 10 0 0 0 22 12Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
          <path d="M20.52 3.48A11.79 11.79 0 0 0 12.04 0C5.5 0 .2 5.3.2 11.84c0 2.09.55 4.13 1.6 5.92L0 24l6.4-1.68a11.84 11.84 0 0 0 5.64 1.43h.01c6.53 0 11.84-5.31 11.85-11.84 0-3.16-1.23-6.13-3.38-8.43ZM12.05 21.6a9.75 9.75 0 0 1-4.97-1.36l-.36-.21-3.79 1 1.01-3.7-.23-.38a9.74 9.74 0 1 1 8.34 4.65Zm5.36-7.32c-.29-.15-1.74-.86-2.01-.96-.27-.1-.47-.15-.66.15-.2.29-.76.96-.93 1.16-.17.2-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.45-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.15-.17.2-.29.29-.49.1-.2.05-.37-.02-.51-.07-.15-.66-1.59-.9-2.18-.24-.57-.48-.49-.66-.5-.17-.01-.37-.01-.57-.01-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43 0 1.43 1.05 2.81 1.2 3.01.15.2 2.06 3.13 5 4.39.7.3 1.24.48 1.66.62.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.99-1.39.24-.69.24-1.27.17-1.4-.07-.13-.27-.2-.56-.34Z" />
        </svg>
      );
    default:
      return null;
  }
};

const SocialLink = ({ href, kind, label }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      rel="noreferrer"
      target="_blank"
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-brand/20 hover:border-brand/50 transition-all duration-200 inline-flex items-center justify-center hover:-translate-y-0.5"
    >
      <SocialIcon kind={kind} />
    </a>
  );
};

const Footer = ({ handleClick }) => {
  const { content } = useSiteContent();
  const settings = content.siteSettings || {};
  const contact = settings.contact || {};
  const social = settings.social || {};
  const stamp = imgUrl(settings.logoStamp) || imgUrl(settings.logo);

  return (
    <section className="relative bg-ink-950 overflow-hidden">
      {/* Top divider with brand glow */}
      <div className="divider" />
      <div
        aria-hidden
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-40 bg-brand/15 blur-3xl pointer-events-none"
      />

      <footer className="relative px-5 xs:px-8 sm:px-12 md:px-16 py-12 text-white/70 grid grid-cols-1 footer-2:grid-cols-2 footer-4:grid-cols-4 text-center footer-4:text-left gap-10 place-items-center footer-4:place-items-start">
        <div className="flex flex-col footer-4:items-start items-center">
          {stamp && (
            <img
              src={stamp}
              className="w-32 aspect-[3/2] object-contain mb-3"
              alt={settings.siteName}
            />
          )}
          <p className="text-white text-base font-semibold">
            {settings.siteName}
          </p>
          {settings.tagline && (
            <p className="text-white/50 text-sm mt-1">{settings.tagline}</p>
          )}
          {/* Socials right under the logo */}
          <div className="flex gap-3 mt-4">
            <SocialLink
              href={social.facebook}
              kind="facebook"
              label="Facebook"
            />
            <SocialLink
              href={social.instagram}
              kind="instagram"
              label="Instagram"
            />
            <SocialLink
              href={social.whatsapp}
              kind="whatsapp"
              label="WhatsApp"
            />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand mb-4">
            Contact
          </p>
          {contact.phonePrimary && (
            <p className="mb-2 hover:text-white transition-colors">
              <a href={`tel:${contact.phonePrimary.replace(/\s+/g, "")}`}>
                {contact.phonePrimary}
              </a>
              {contact.phoneSecondary && (
                <>
                  {" / "}
                  <a
                    href={`tel:${contact.phoneSecondary.replace(/\s+/g, "")}`}
                  >
                    {contact.phoneSecondary}
                  </a>
                </>
              )}
            </p>
          )}
          {contact.email && (
            <p className="mb-2 hover:text-white transition-colors">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          )}
          {contact.addressLine && (
            <p className="hover:text-white transition-colors">
              {contact.mapUrl ? (
                <a href={contact.mapUrl} rel="noreferrer" target="_blank">
                  {contact.addressLine}
                </a>
              ) : (
                contact.addressLine
              )}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand mb-4">
            Useful Links
          </p>
          <ul className="space-y-2">
            {[
              ["services", "Services"],
              ["gallery", "Gallery"],
              ["membership", "Membership"],
              ["reviews", "Reviews"],
              ["contact", "Contact"],
            ].map(([id, label]) => (
              <li key={id}>
                <a
                  href="/"
                  onClick={(e) => handleClick(e, id)}
                  className="hover:text-white transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-brand mb-4">
            Visit
          </p>
          <p className="text-white/60 leading-relaxed text-sm">
            Open daily<br />
            5:00 AM — 9:00 PM
          </p>
          <a
            href="/"
            onClick={(e) => handleClick(e, "contact")}
            className="button mt-4 inline-flex"
          >
            Book a Trial
          </a>
        </div>
      </footer>

      <div className="divider" />
      <p className="py-5 text-white/30 text-center text-xs sm:text-sm">
        {settings.footerCopyright ||
          "© Aaryan's Fitness Club. All Rights Reserved"}
      </p>
    </section>
  );
};

export default Footer;
