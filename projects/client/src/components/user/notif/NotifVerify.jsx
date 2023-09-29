import React from "react";

import verifyPage from "../../../assets/images/verify.webp";
import { removeCookie } from "../../../utils/tokenSetterGetter";
import NotifVerifies from "./NotifVerifies";

const NotifVerify = () => {
  const msg =
    "Please Check Your Email to Verify Your Account. You only have 20 minutes to verify your account";
  removeCookie("access_token");
  return <NotifVerifies imgSrc={verifyPage} msg={msg} />;
};

export default NotifVerify;
