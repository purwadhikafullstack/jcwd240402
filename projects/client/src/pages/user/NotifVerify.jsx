import React from "react";
import verifyPage from "../../assets/images/verify.webp";
import verify from "../../assets/images/verify.gif";
import logo from "../../assets/images/furnifor.png";
import { removeCookie } from "../../utils";

const NotifVerify = () => {
  removeCookie("access_token");
  return (
    <div className="w-full h-full flex justify-evenly items-center">
      <img src={logo} alt="" className="absolute top-14 w-20" />
      <div className="absolute flex justify-center flex-col items-center w-52 lg:w-96 lg:bottom-52 bottom-52">
        <img src={verifyPage} alt="" className="" />
        <img src={verify} alt="" className="absolute top-0 w-44 lg:w-80" />
        <h1 className="text-center absolute bottom-0 lg:bottom-10">
          Please Check Your Email to Verify Your Account
        </h1>
      </div>
    </div>
  );
};

export default NotifVerify;
