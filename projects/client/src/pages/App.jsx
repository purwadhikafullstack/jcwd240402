import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavbarDesktop from "../components/NavbarDesktop";
import NavbarMobile from "../components/NavbarMobile";
import NavigatorMobile from "../components/NavigatorMobile";
import Home from "../pages/Home";
import Register from "./Register";
import Login from "./Login";
import VerifyPage from "./VerifyPage";
import ProfileRegister from "./ProfileRegister";

function App() {
  return (
    <div className="App">
      <Router>
        <NavbarDesktop />
        <NavbarMobile />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-page" element={<VerifyPage />} />
          <Route path="/verify/:token" element={<ProfileRegister />} />
        </Routes>
        <NavigatorMobile />
      </Router>
    </div>
  );
}

export default App;
