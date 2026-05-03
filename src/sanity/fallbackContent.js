// Default content used when Sanity isn't configured OR returns nothing.
// Mirrors the original hard-coded site so it never looks broken.

import equipment from "../assets/equipment.webp";
import nutrition from "../assets/nutrition.webp";
import training from "../assets/training.webp";
import unique from "../assets/unique.webp";
import heroBg from "../assets/hero-bg.jpg";
import logo from "../assets/logo.png";
import logoStamp from "../assets/logo-stamp.png";
import teamPhoto from "../assets/team.jpg";

// Use these as `image` placeholders that the components recognise as "use src directly".
const localImg = (src) => ({ _local: true, src });

export const FALLBACK_CONTENT = {
  siteSettings: {
    siteName: "Aaryan's Fitness Club",
    tagline: "The Aaryan's Zone",
    logo: localImg(logo),
    logoStamp: localImg(logoStamp),
    contact: {
      phonePrimary: "+977 9851173983",
      phoneSecondary: "+977 9869636446",
      email: "theaaryansclub@gmail.com",
      addressLine: "Pepsicola, Kathmandu, Nepal",
      mapUrl: "https://maps.app.goo.gl/hGjRzgwaAv9yaCsh6",
      mapEmbedUrl:
        "https://maps.google.com/maps?width=100%25&height=600&hl=en&q=aryans%20fitness%20club+(Aaryan's%20Fitness%20Club)&t=&z=17&ie=UTF8&iwloc=B&output=embed",
    },
    social: {
      facebook: "https://www.facebook.com/BaidhyaAnish?mibextid=ZbWKwL",
      instagram:
        "https://www.instagram.com/theaaryansfitnesszone/?igsh=MTM0eXdocnNiNTdybw%3D%3D",
      whatsapp: "",
    },
    footerCopyright: "© Aaryan's Fitness Club. All Rights Reserved",
  },
  hero: {
    backgroundImage: localImg(heroBg),
    headline: "Aaryan's Fitness Club",
    subheading:
      "At The Aaryan's Zone, we do everything to help you become your best self.",
    ctaLabel: "Start Today",
    whyChooseUsTitle: "Why Choose Us?",
    whyChooseUsItems: [
      { _key: "1", title: "Modern Equipment", icon: localImg(equipment) },
      { _key: "2", title: "Healthy Nutrition", icon: localImg(nutrition) },
      { _key: "3", title: "Expert Training", icon: localImg(training) },
      { _key: "4", title: "Tailored Package", icon: localImg(unique) },
    ],
    tagline1: "Ditch the excuses, grab your motivation backpack!",
    tagline2: '"Get Ready To Reach Your Fitness Goals"',
  },
  plans: [
    {
      _id: "plan-monthly",
      name: "Bill Monthly",
      price: "RS 3000",
      isPopular: false,
      features: [
        "Unlimited Gym Access",
        "Aerobics",
        "Kick Boxing",
        "Cardio Boxing",
        "Calisthenics",
      ],
    },
    {
      _id: "plan-yearly",
      name: "Bill Yearly",
      price: "RS 25000",
      isPopular: true,
      features: [
        "Unlimited Gym Access",
        "Aerobics",
        "Kick Boxing",
        "Cardio Boxing",
        "Calisthenics",
      ],
    },
    {
      _id: "plan-quarterly",
      name: "Bill Quarterly",
      price: "RS 14000",
      isPopular: false,
      features: [
        "Unlimited Gym Access",
        "Aerobics",
        "Kick Boxing",
        "Cardio Boxing",
        "Calisthenics",
      ],
    },
  ],
  services: Array.from({ length: 6 }).map((_, i) => ({
    _id: `service-${i}`,
    title: "Body Building",
    image: localImg(teamPhoto),
    morningHours: "7 AM to 9 AM",
    eveningHours: "6 PM to 8 PM",
  })),
  gallery: Array.from({ length: 15 }).map((_, i) => ({
    _id: `gallery-${i + 1}`,
    image: localImg(`/images/photo${i + 1}.jpg`),
    caption: "Gallery photo",
    category:
      i < 4
        ? "ambience"
        : i < 7
        ? "member"
        : i < 10
        ? "equipment"
        : "event",
  })),
  team: Array.from({ length: 6 }).map((_, i) => ({
    _id: `team-${i}`,
    name: "Lady Trainer",
    role: "Zumba",
    photo: localImg(teamPhoto),
  })),
  reviews: [
    {
      _id: "review-1",
      name: "Tania Andrew",
      rating: 5,
      photo: localImg(
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
      ),
      review:
        "I found solution to all my design needs from Creative Tim. I use them as a freelancer in my hobby projects for fun! And its really affordable, very humble guys !!!",
    },
    {
      _id: "review-2",
      name: "Andrew Tania",
      rating: 5,
      photo: localImg(
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
      ),
      review:
        "I found solution to all my design needs from Creative Tim. I use them as a freelancer in my hobby projects for fun! And its really affordable, very humble guys !!!",
    },
  ],
};
