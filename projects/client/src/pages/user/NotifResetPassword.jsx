import React from "react";
import logo from "../../assets/images/furnifor.png";
import resetPassword from "../../assets/images/reset_password_success.png";
import { useNavigate } from "react-router-dom";
import { removeCookie } from "../../utils";
import Notif from "../../components/NotifForgotResetPassword";

const NotifResetPassword = () => {
  const msg = "Congrats! change password successful. Please Log in";
  const navigate = useNavigate();
  removeCookie("access_token");

  setTimeout(() => {
    navigate("/log-in");
  }, 3000);
  return <Notif imgSrc={resetPassword} msg={msg} />;
};

export default NotifResetPassword;
