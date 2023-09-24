import React from "react";

import logo from "../../../assets/images/furnifor.png";

const NotifForgotResetPassword = ({ imgSrc, msg }) => {
  return (
    <div className="w-full h-full flex justify-evenly items-center">
      <img src={logo} alt="logo" className="absolute top-14 w-20" />
      <div className="absolute flex justify-center flex-col items-center w-full lg:w-[30rem] lg:bottom-52 bottom-40">
        <img src={imgSrc} alt="forgot password" className="w-96" />
        <h1 className="text-center absolute bottom-0 text-xs mx-4 font-semibold text-grayText ">
          {msg}
        </h1>
      </div>
    </div>
  );
};

export default NotifForgotResetPassword;
