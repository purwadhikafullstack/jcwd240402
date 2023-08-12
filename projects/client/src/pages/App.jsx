import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./user/Home";
import Register from "./user/Register";
import Login from "./user/Login";
import Verify from "./user/Verify";
import Verified from "./user/Verified";
import SignUp from "./user/SignUp";

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
          <Route
            path="/reset-password/:reset_password_token"
            element={<Verified />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
