import React from "react";
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
import ModalForgotPassword from "../../components/ModalForgotPassword";
import AlertWithIcon from "../../components/AlertWithIcon";
import {
  setCookie,
  removeCookie,
  setLocalStorage,
  removeLocalStorage,
} from "../../utils";

const Login = () => {
  removeCookie("access_token");
  removeLocalStorage("refresh_token");
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const loginUser = async (values, { setStatus, setValues }) => {
    try {
      const response = await axios.post("/auth/login", values);

      if (response.status === 200 && response.data.ok) {
        const accessToken = response.data?.accessToken;
        const refreshToken = response.data?.refreshToken;
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
        console.log(response.data.accessToken);
        console.log(response.data.refreshToken);
      } else {
        throw new Error("Login Failed");
      }
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
      }
    }
  };

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
          "password is required"
        ),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
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
                <div className="mt-5 px-6 grid gap-y-4 lg:rounded-xl">
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
                    onChange={handleForm}
                    value={formik.values.password}
                    isError={!!formik.errors.password}
                    errorMessage={formik.errors.password}
                  />

                  <ModalForgotPassword />

                  <div className="flex flex-col justify-center items-center mt-3  lg:rounded-lg">
                    <Button
                      buttonSize="medium"
                      buttonText="Log in"
                      type="submit"
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-semibold"
                    />
                    <h1 className="mt-2 text-xs lg:text-base my-4">
                      Dont have an account yet?{" "}
                      <Link to="/sign-up" className="font-semibold">
                        Sign Up
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

export default Login;
