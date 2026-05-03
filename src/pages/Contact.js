import emailjs from "@emailjs/browser";
import React, { useRef, useState } from "react";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showError, setShowError] = useState(false);
  const form = useRef();
  const resetForm = () => {
    form.current.reset();
  }
  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    emailjs
      .sendForm("service_fq8ktsb", "template_23h1bpw", form.current, {
        publicKey: "1x4DhyPl9-2lpvgpq",
      })
      .then(
        () => {
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
            resetForm();
          }, 2000);
        },
        (error) => {
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 2000);
        }
      )
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <section id="contact" className="py-16 px-5 xs:px-8 sm:px-12 md:px-16 bg-[#111111]">
      <h1 className="mb-12 text-xl xs:text-2xl sm:text-3xl text-center font-semibold text-white/90 uppercase">Contact Us</h1>
      <div className="flex flex-col-reverse form:flex-row items-center justify-center gap-16">
        <div className="w-10/12 sm:w-9/12 form:w-2/4 aspect-[3/2] flex-shrink-0">
          <iframe
            title="Aaryan's Fitness Club"
            width="100%"
            height="100%"
            src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=aryans%20fitness%20club+(Aaryan's%20Fitness%20Club)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          ></iframe>
        </div>
        <div className="mx-auto relative">
          <form ref={form} onSubmit={sendEmail}>
            <div className="mb-6">
              <label
                htmlFor="user_name"
                className="block mb-2 font-medium text-gray-300"
              >
                Full Name
              </label>
              <input required
                id="user_name"
                type="text"
                name="user_name"
                className="block w-80 lg:w-96 p-2.5 text-gray-300 bg-transparent border border-white/30 hover:border-white/60 focus:outline-none focus:border-white/60 rounded-lg placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="user_email"
                className="block mb-2 font-medium text-gray-300"
              >
                Email Address
              </label>
              <input
                id="user_email"
                type="email"
                name="user_email"
                className="block w-80 lg:w-96 p-2.5 text-gray-300 bg-transparent border border-white/30 hover:border-white/60 focus:outline-none focus:border-white/60 rounded-lg placeholder-gray-500"
                placeholder="Enter your email address"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="user_number"
                className="block mb-2 font-medium text-gray-300"
              >
                Contact Number
              </label>
              <input required
                id="user_number"
                type="text"
                name="user_number"
                className="block w-80 lg:w-96 p-2.5 text-gray-300 bg-transparent border border-white/30 hover:border-white/60 focus:outline-none focus:border-white/60 rounded-lg placeholder-gray-500"
                placeholder="Enter your contact number"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block mb-2 font-medium text-gray-300"
              >
                Message
              </label>
              <textarea required
                id="message"
                name="message"
                className="block w-80 lg:w-96 p-2.5 text-gray-300 bg-transparent border border-white/30 hover:border-white/60 focus:outline-none focus:border-white/60 rounded-lg placeholder-gray-500"
                placeholder="Enter your message"
              />
            </div>
            {loading ? (
              <div className="button w-80 lg:w-96 text-center">Sending...</div>
            ) : (
              <input
                type="submit"
                className="button w-80 lg:w-96 cursor-pointer"
                value="Send"
              />
            )}
          </form>
          {showNotification && (
            <div className="notification text-white/90 bg-black/40 text-center text-lg pb-5 absolute rounded-xl backdrop-blur-sm top-0 flex items-center justify-center -ml-2 -mt-2" style={{ width: 'calc(100% + 16px)', height: 'calc(100% + 16px)' }}>
              <div>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 mx-auto text-green-600 mb-2"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                      fill="none"
                      stroke="currentColor"
                      stroke-miterlimit="10"
                      stroke-width="32"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                      d="M352 176L217.6 336 160 272"
                    />
                  </svg>
                </span>
                <p>Message sent successfully!</p>
              </div>
            </div>
          )}
          {showError && (
            <div className="notification text-white/90 bg-black/40 text-center text-lg pb-5 absolute rounded-xl backdrop-blur-sm top-0 flex items-center justify-center -ml-2 -mt-2" style={{ width: 'calc(100% + 16px)', height: 'calc(100% + 16px)' }}>
              <div>
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-14 mx-auto text-[#a80717]"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
                      fill="none"
                      stroke="currentColor"
                      stroke-miterlimit="10"
                      stroke-width="32"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                      d="M320 320L192 192M192 320l128-128"
                    />
                  </svg>
                </span>
                <p className="mt-2 mb-1">Could not send message! </p>
                <span className="block text-base">Please try again</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
