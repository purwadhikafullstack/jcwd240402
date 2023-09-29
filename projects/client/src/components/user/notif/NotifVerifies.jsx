import React from "react";

import verify from "../../../assets/images/verify.gif";
import logo from "../../../assets/images/furnifor.png";

const NotifVerifies = ({ imgSrc, msg }) => {
  return (
    <div className="w-full h-full flex justify-evenly items-center">
      <img src={logo} alt="logo" className="absolute top-14 w-20" />
      <div className="absolute flex justify-center flex-col items-center w-52 lg:w-96 lg:bottom-52 bottom-52">
        <img src={imgSrc} alt="verifies" className="" />
        <img
          src={verify}
          alt="verifies"
          className="absolute top-0 w-44 lg:w-80"
        />
        <h1 className="text-center absolute bottom-0 lg:bottom-10 text-xs font-semibold text-grayText">
          {msg}
        </h1>
      </div>
    </div>
  );
};

export default NotifVerifies;
