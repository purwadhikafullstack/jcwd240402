import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import login from "../../assets/images/furnifor.png";
import axios from "../../api/axios";
import InputForm from "../../components/InputForm";
import Button from "../../components/Button";
import PasswordInput from "../../components/PasswordInput";
import AuthImageCard from "../../components/AuthImageCard";
import ModalForgotPassword from "../../components/user/modal/ModalForgotPassword";
import AlertWithIcon from "../../components/AlertWithIcon";
import {
  setCookie,
  removeCookie,
  setLocalStorage,
  removeLocalStorage,
} from "../../utils/tokenSetterGetter";
import withOutAuthUser from "../../components/user/withoutAuthUser";
import { UserAuth } from "../../context/AuthContext";
import google from "../../assets/icons/google.png";

const Login = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const { googleSignIn, user, logOutAuth } = UserAuth();

  const loginUser = async (values, { setStatus, setValues }) => {
    removeCookie("access_token");
    removeLocalStorage("refresh_token");
    try {
      await axios.post("/user/auth/login", values).then((res) => {
        const accessToken = res.data?.accessToken;
        const refreshToken = res.data?.refreshToken;
        setLocalStorage("refresh_token", refreshToken);
        setCookie("access_token", accessToken, 1);
        setStatus({ success: true });
        setValues({
          user_identification: "",
          password: "",
        });
        setStatus({
          success: true,
          message:
            "Sign up successful. Please check your email for verification.",
        });
        navigate("/");
      });
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
        setTimeout(() => {
          setErrMsg("");
        }, 3000);
      }
    }
  };

  useEffect(() => {
    if (user != null && Object.keys(user).length !== 0) {
      axios
        .post("user/auth/login/oAuth", {
          email: user.email,
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
          } else {
            setErrMsg(error.response?.data?.message);
            logOutAuth();
            setTimeout(() => {
              setErrMsg("");
            }, 4000);
          }
        });
    }
  }, [logOutAuth, navigate, user]);

  const formik = useFormik({
    initialValues: {
      user_identification: "",
      password: "",
    },
    onSubmit: loginUser,
    validationSchema: yup.object().shape({
      user_identification: yup
        .string()
        .required("username / email is a required field"),
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "password must to contain at least 8 character, 1 number and 1 symbol"
        ),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const handleGoogleSign = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setErrMsg(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-white h-full lg:h-full lg:mt-32 lg:w-full lg:item-center lg:justify-center lg:grid lg:grid-cols-2 lg:items-center ">
      <AuthImageCard imageSrc={login} />

      <div className="lg:col-span-1 ">
        <div className="h-screen flex justify-center items-center lg:h-full lg:grid lg:justify-center lg:items-center  ">
          <div className=" shadow-3xl w-64 lg:w-80 rounded-xl  ">
            <div className="flex mt-4 px-3 justify-between items-end ">
              <h1 className="text-3xl font-bold mx-3 text-blue3 lg:rounded-xl">
                Login
              </h1>
            </div>
            <div className="lg:rounded-lg">
              <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
                {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}

                <div className="mt-5 px-6 grid gap-y-2 lg:rounded-xl">
                  <InputForm
                    onChange={handleForm}
                    label="username/email"
                    placeholder="username/email"
                    name="user_identification"
                    type="text"
                    value={formik.values.user_identification}
                    isError={!!formik.errors.user_identification}
                    errorMessage={formik.errors.user_identification}
                  />
                  <PasswordInput
                    name="password"
                    label="password"
                    onChange={handleForm}
                    value={formik.values.password}
                    isError={!!formik.errors.password}
                    errorMessage={formik.errors.password}
                    placeholder="password"
                  />

                  <ModalForgotPassword />

                  <div className="mb-4 flex justify-center">
                    <Button
                      buttonSize="medium"
                      buttonText="Log in"
                      type="submit"
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-semibold"
                    />
                  </div>
                </div>
              </form>
              <div className="flex flex-col justify-center items-center mx-8 lg:rounded-lg ">
                <div className="flex justify-center items-center w-full">
                  <hr className="border-2 border-gray-200 rounded-full w-full" />
                  <h1 className="text-gray-300">OR</h1>
                  <hr className="border-2 border-gray-200 rounded-full w-full" />
                </div>

                <button
                  className="border-2 gap-x-2 bg-base_bg_grey rounded-lg w-full flex items-center"
                  onClick={handleGoogleSign}
                  type="button"
                >
                  <div className="flex justify-center items-center w-full">
                    <img src={google} alt="google" className="w-10 " />
                    <h1 className="text-sm">Login with Google </h1>
                  </div>
                </button>

                <h1 className="mt-2 text-xs my-4 text-grayText">
                  Dont have an account yet?{" "}
                  <Link to="/sign-up" className="font-semibold">
                    Sign Up
                  </Link>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withOutAuthUser(Login);
