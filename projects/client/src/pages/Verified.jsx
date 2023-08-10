import React, { useEffect } from "react";
import verified from "../assets/images/verified.webp";
import verify from "../assets/images/verify.gif";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

const Verified = () => {
  const { verify_token } = useParams();
  const navigate = useNavigate();

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
  return (
    <div className="w-full h-full flex justify-evenly items-center">
      <div className="absolute flex justify-center flex-col items-center w-52 lg:w-96  lg:m-auto bottom-52">
        <img src={verified} alt="" className="" />
        <img src={verify} alt="" className="absolute top-16 w-44 lg:w-80" />
        <h1 className="text-center absolute bottom-0 lg:bottom-10">
          Congrats! your account verified
        </h1>
      </div>
    </div>
  );
};

export default Verified;
