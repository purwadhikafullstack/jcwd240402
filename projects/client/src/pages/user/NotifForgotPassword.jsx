import React from "react";
import logo from "../../assets/images/furnifor.png";
import forgotpassword from "../../assets/images/forgot_password.png";
import { removeCookie } from "../../utils";

const NotifForgotPassword = () => {
  removeCookie("access_token");
  return (
    <div className="w-full h-full flex justify-evenly items-center">
      <img src={logo} alt="" className="absolute top-14 w-20" />
      <div className="absolute flex justify-center flex-col items-center w-full lg:w-[30rem] lg:bottom-52 bottom-52">
        <img src={forgotpassword} alt="" className="w-96" />
        <h1 className="text-center absolute bottom-0 text-xs mx-4 lg:text-base lg:bottom-10">
          Please Check Your Email to Get Your Reset Password Code
        </h1>
      </div>
    </div>
  );
};

export default NotifForgotPassword;
