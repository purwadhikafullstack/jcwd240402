import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "./Register";
import Login from "./Login";
import Verify from "./Verify";
import Verified from "./Verified";
import SignUp from "./SignUp";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verify/:verify_token" element={<Verified />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
