import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
function App() {
  const handleClick = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className="App">
      <Navbar handleClick={handleClick} />
      <Home handleClick={handleClick} />
      <Footer handleClick={handleClick} />
    </div>
  );
}

export default App;
