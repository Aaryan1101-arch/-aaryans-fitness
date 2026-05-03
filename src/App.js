import { useEffect } from "react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BackToTop from "./components/motion/BackToTop";
import ScrollProgress from "./components/motion/ScrollProgress";
import { useSiteContent, imgUrl } from "./sanity/SiteContent";

function App() {
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
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="App">
      <ScrollProgress />
      <Navbar handleClick={handleClick} />
      <Home handleClick={handleClick} />
      <Footer handleClick={handleClick} />
      <BackToTop />
    </div>
  );
}

export default App;
