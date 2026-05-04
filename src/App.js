import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TopBanner from "./components/TopBanner";
import Home from "./pages/Home";
import BackToTop from "./components/motion/BackToTop";
import ScrollProgress from "./components/motion/ScrollProgress";
import { useSiteContent, imgUrl } from "./sanity/SiteContent";

const Admin = lazy(() => import("./admin"));

function PublicSite() {
  const { content } = useSiteContent();
  const settings = content.siteSettings;

  useEffect(() => {
    if (settings?.siteName) document.title = settings.siteName;
  }, [settings?.siteName]);

  useEffect(() => {
    const favUrl = imgUrl(settings?.favicon);
    if (!favUrl) return;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = favUrl;
  }, [settings?.favicon]);

  const handleClick = (e, sectionId) => {
    e.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="App">
      <ScrollProgress />
      <TopBanner />
      <Navbar handleClick={handleClick} />
      <Home handleClick={handleClick} />
      <Footer handleClick={handleClick} />
      <BackToTop />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
            <Admin />
          </Suspense>
        }
      />
      <Route path="*" element={<PublicSite />} />
    </Routes>
  );
}

export default App;
