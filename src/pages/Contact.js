import emailjs from "@emailjs/browser";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSiteContent } from "../sanity/SiteContent";
import SectionHeading from "../components/motion/SectionHeading";

const FormField = ({ label, id, name, type = "text", required, multiline, placeholder }) => {
  const Tag = multiline ? "textarea" : "input";
  return (
    <div className="mb-5">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-white/70"
      >
        {label}
      </label>
      <Tag
        required={required}
        id={id}
        name={name}
        type={type}
        rows={multiline ? 4 : undefined}
        placeholder={placeholder}
        className="block w-full sm:w-80 lg:w-96 p-3 text-white bg-white/5 border border-white/10 rounded-xl placeholder:text-white/30 hover:border-white/30 focus:outline-none focus:border-brand focus:bg-white/[0.07] focus:ring-2 focus:ring-brand/30 transition-all duration-200"
      />
    </div>
  );
};

const Contact = () => {
  const { content } = useSiteContent();
  const settings = content.siteSettings || {};
  const contact = settings.contact || {};
  const mapEmbedUrl = contact.mapEmbedUrl;
  const siteName = settings.siteName || "Aaryan's Fitness Club";

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // {kind:"success"|"error", text}
  const form = useRef();

  const showToast = (kind, text, ms = 2500) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), ms);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .sendForm("service_fq8ktsb", "template_23h1bpw", form.current, {
        publicKey: "1x4DhyPl9-2lpvgpq",
      })
      .then(
        () => {
          showToast("success", "Message sent successfully!");
          form.current.reset();
        },
        () => {
          showToast("error", "Could not send. Please try again.");
        }
      )
      .finally(() => setLoading(false));
  };

  return (
    <section id="contact" className="section bg-ink-900 overflow-hidden">
      <SectionHeading
        eyebrow="Get in touch"
        title="Contact Us"
        sub="Drop in for a free trial. We answer every message within a day."
      />

      <div className="flex flex-col-reverse form:flex-row items-stretch justify-center gap-10 lg:gap-16 max-w-6xl mx-auto">
        {/* Map + quick contact card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="w-full sm:w-9/12 form:w-1/2 mx-auto form:mx-0 flex flex-col gap-4"
        >
          <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-card">
            {mapEmbedUrl && (
              <iframe
                title={siteName}
                width="100%"
                height="100%"
                src={mapEmbedUrl}
                className="block grayscale-[20%] hover:grayscale-0 transition-all duration-500"
              />
            )}
          </div>
          {/* quick info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {contact.phonePrimary && (
              <a
                href={`tel:${contact.phonePrimary.replace(/\s+/g, "")}`}
                className="glass-card flex items-center gap-3 p-4"
              >
                <span className="w-10 h-10 rounded-full bg-brand/20 text-brand flex items-center justify-center">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                    />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Call
                  </p>
                  <p className="text-white text-sm">{contact.phonePrimary}</p>
                </div>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="glass-card flex items-center gap-3 p-4"
              >
                <span className="w-10 h-10 rounded-full bg-brand/20 text-brand flex items-center justify-center">
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </span>
                <div className="overflow-hidden">
                  <p className="text-xs text-white/40 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-white text-sm truncate">
                    {contact.email}
                  </p>
                </div>
              </a>
            )}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="relative mx-auto form:mx-0"
        >
          <form ref={form} onSubmit={sendEmail}>
            <FormField
              label="Full Name"
              id="user_name"
              name="user_name"
              required
              placeholder="Your name"
            />
            <FormField
              label="Email Address"
              id="user_email"
              name="user_email"
              type="email"
              placeholder="you@example.com"
            />
            <FormField
              label="Contact Number"
              id="user_number"
              name="user_number"
              required
              placeholder="+977 …"
            />
            <FormField
              label="Message"
              id="message"
              name="message"
              required
              multiline
              placeholder="What can we help you with?"
            />
            <button
              type="submit"
              disabled={loading}
              className="button w-full sm:w-80 lg:w-96 justify-center text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeOpacity="0.25"
                      strokeWidth="4"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z"
                    />
                  </svg>
                  Sending…
                </span>
              ) : (
                "Send"
              )}
            </button>
          </form>

          {/* Toast */}
          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-xl backdrop-blur border shadow-card flex items-center gap-3 text-sm ${
                  toast.kind === "success"
                    ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-100"
                    : "bg-brand/15 border-brand/50 text-white"
                }`}
              >
                {toast.kind === "success" ? (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                ) : (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                    />
                  </svg>
                )}
                {toast.text}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
