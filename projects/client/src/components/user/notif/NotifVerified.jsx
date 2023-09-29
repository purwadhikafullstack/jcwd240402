import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import verified from "../../../assets/images/verified.webp";

import {
  removeCookie,
  removeLocalStorage,
} from "../../../utils/tokenSetterGetter";
import NotifVerifies from "../notif/NotifVerifies";

const NotifVerified = () => {
  const navigate = useNavigate();
  const msg = "Congrats! your account verified";
  removeCookie("access_token");
  removeLocalStorage("refresh_token");
  useEffect(() => {
    setTimeout(() => {
      navigate("/log-in");
    }, 3000);
  });
  return <NotifVerifies imgSrc={verified} msg={msg} />;
};

export default NotifVerified;
