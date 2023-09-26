import React from "react";
import { useNavigate } from "react-router-dom";

import resetPassword from "../../../assets/images/reset_password_success.png";
import { removeCookie } from "../../../utils/tokenSetterGetter";
import Notif from "../notif/NotifVerifies";

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
