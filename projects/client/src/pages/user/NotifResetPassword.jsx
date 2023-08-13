import React from "react";
import logo from "../../assets/images/furnifor.png";
import resetPassword from "../../assets/images/reset_password_success.png";
import { useNavigate } from "react-router-dom";

const NotifResetPassword = () => {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/log-in");
  }, 3000);
  return (
    <div className="w-full h-full flex justify-evenly items-center">
      <img src={logo} alt="" className="absolute top-14 w-20" />
      <div className="absolute flex justify-center flex-col items-center w-full lg:w-[30rem] lg:bottom-52 bottom-40">
        <img src={resetPassword} alt="" className="w-96" />
        <h1 className="text-center absolute bottom-0 text-xs mx-4 lg:text-base ">
          Congrats! change password successful. Please Log in
        </h1>
      </div>
    </div>
  );
};

export default NotifResetPassword;
