import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleButton, FacebookButton } from "react-google-button";

import register from "../../assets/images/furnifor.png";
import ButtonLink from "../../components/ButtonLink";
import AuthImageCard from "../../components/AuthImageCard";
import google from "../../assets/icons/google.png";
import facebook from "../../assets/icons/facebook.png";
import {
  removeCookie,
  removeLocalStorage,
  setCookie,
  setLocalStorage,
} from "../../utils/tokenSetterGetter";
import withOutAuthUser from "../../components/user/withoutAuthUser";
import { UserAuth } from "../../context/AuthContext";
import axios from "../../api/axios";
import AlertWithIcon from "../../components/AlertWithIcon";

const SignUp = () => {
  removeCookie("access_token");
  removeLocalStorage("refresh_token");

  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { googleSignIn, user, logOutAuth } = UserAuth();

  const handleGoogleSign = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setErrMsg(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (user != null && Object.keys(user).length !== 0) {
      axios
        .post("user/auth/register/oAuth", {
          email: user.email,
          fullname: user.displayName,
          is_verify: user.emailVerified,
          phone: user.phoneNumber,
        })
        .then((res) => {
          setLocalStorage("refresh_token", res.data?.refreshToken);
          setCookie("access_token", res.data?.accessToken);
          setErrMsg("");
          navigate("/");
        })
        .catch((error) => {
          if (!error.response) {
            setErrMsg("No Server Response");
            logOutAuth();
          } else {
            setErrMsg(`${error.response?.data?.message}, instead please login`);
            setTimeout(() => {
              setErrMsg("");
            }, 4000);
            logOutAuth();
          }
        });
    }
  }, [navigate, user]);

  return (
    <div className="bg-white h-screen lg:h-full lg:mt-32 lg:w-full lg:item-center lg:justify-center lg:grid lg:grid-cols-2 lg:items-center ">
      <AuthImageCard imageSrc={register} />
      <div className="lg:col-span-1 ">
        <div className="h-screen flex justify-center items-center lg:h-full lg:grid lg:justify-center lg:items-center  ">
          <div className="shadow-3xl w-64 lg:w-80 rounded-xl ">
            <div className="flex flex-col mt-4 px-3 justify-start items-start ">
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}
              <h1 className="text-3xl font-bold mx-3 text-blue3 lg:rounded-xl">
                Sign up
              </h1>
            </div>
            <div className="lg:rounded-lg">
              <form className="lg:rounded-xl">
                <div className="mt-5 px-6 justify-center grid gap-y-3 lg:rounded-xl">
                  <div className="w-52  flex flex-col gap-y-2 justify-center">
                    <button
                      className="border-2 gap-x-2 bg-base_bg_grey rounded-lg w-full flex items-center"
                      onClick={handleGoogleSign}
                      type="button"
                    >
                      <div className="flex justify-start">
                        <img src={google} alt="google" className="w-10 " />
                      </div>
                      <div>
                        <h1 className="text-sm">Sign up with Google </h1>
                      </div>
                    </button>
                  </div>

                  <div className="flex justify-center items-center w-52">
                    <hr className="border-2 border-gray-200 rounded-full w-full" />
                    <h1 className="text-gray-300">OR</h1>
                    <hr className="border-2 border-gray-200 rounded-full w-full" />
                  </div>

                  <div className="flex flex-col justify-center items-center lg:rounded-lg">
                    <ButtonLink
                      buttonSize="medium"
                      buttonText="Registration"
                      type="submit"
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-semibold"
                      to="/register"
                    />

                    <h1 className="mt-2 my-4">
                      Have an account?{" "}
                      <Link
                        to="/log-in"
                        className="font-semibold hover:text-blue3 transition-all"
                      >
                        Log in
                      </Link>
                    </h1>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withOutAuthUser(SignUp);
