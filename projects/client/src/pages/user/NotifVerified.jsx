import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import verified from "../../assets/images/verified.webp";
import axios from "../../api/axios";
import { removeCookie } from "../../utils";
import NotifVerifies from "../../components/NotifVerifies";

const NotifVerified = () => {
  const { verify_token } = useParams();
  const navigate = useNavigate();
  const msg = "Congrats! your account verified";
  removeCookie("access_token");

  useEffect(() => {
    axios.get(`/auth/verify/${verify_token}`).then(
      (res) => {
        if (res.data.ok) {
          setTimeout(() => {
            navigate("/");
          }, 4000);
        }
        navigate("/register");
      },
      [navigate, verify_token]
    );
  });
  return <NotifVerifies imgSrc={verified} msg={msg} />;
};

export default NotifVerified;
