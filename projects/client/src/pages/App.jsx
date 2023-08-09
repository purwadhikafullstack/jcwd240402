import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarDesktop from "../components/NavbarDesktop";
import NavbarMobile from "../components/NavbarMobile";
import NavigatorMobile from "../components/NavigatorMobile";
import Home from "../pages/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <NavbarDesktop />
        <NavbarMobile />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <NavigatorMobile />
      </Router>
    </div>
  );
}

export default App;
