import React from "react";

import forgotpassword from "../../../assets/images/forgot_password.png";
import { removeCookie } from "../../../utils/tokenSetterGetter";
import Notif from "./NotifForgotResetPassword";

const NotifForgotPassword = () => {
  const msg = "Please Check Your Email to Get Your Reset Password Code";
  removeCookie("access_token");
  return <Notif imgSrc={forgotpassword} msg={msg} />;
};

export default NotifForgotPassword;
