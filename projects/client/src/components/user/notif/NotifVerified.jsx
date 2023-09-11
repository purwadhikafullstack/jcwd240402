import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import verified from "../../../assets/images/verified.webp";
import axios from "../../../api/axios";
import {
  removeCookie,
  removeLocalStorage,
} from "../../../utils/tokenSetterGetter";
import NotifVerifies from "../notif/NotifVerifies";

const NotifVerified = () => {
  const { verify_token } = useParams();
  const navigate = useNavigate();
  const msg = "Congrats! your account verified";
  removeCookie("access_token");
  removeLocalStorage("refresh_token");
  useEffect(() => {
    axios.get(`user/auth/verify/${verify_token}`).then(
      (res) => {
        if (res.data.ok) {
          setTimeout(() => {
            navigate("/log-in");
          }, 4000);
        }
        // navigate("/register");
      },
      [navigate, verify_token]
    );
  });
  return <NotifVerifies imgSrc={verified} msg={msg} />;
};

export default NotifVerified;