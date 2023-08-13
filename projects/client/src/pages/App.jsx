import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./user/Home";
import Register from "./user/Register";
import Login from "./user/Login";
import NotifVerify from "./user/NotifVerify";
import NotifVerified from "./user/NotifVerified";
import SignUp from "./user/SignUp";
import NotifForgotPassword from "./user/NotifForgotPassword";
import ResetPassword from "./user/ResetPassword";
import NotifResetPassword from "./user/NotifResetPassword";
import NotFound from "./user/NotFound";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/log-in" element={<Login />} />
          <Route path="/verify" element={<NotifVerify />} />
          <Route path="/verify/:verify_token" element={<NotifVerified />} />
          <Route
            path="/reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route
            path="/reset-password-success"
            element={<NotifResetPassword />}
          />
          <Route path="/forgot-password" element={<NotifForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
