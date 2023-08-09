import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import login from "../assets/images/login.webp";
import InputForm from "../components/InputForm";
import axios from "../api/axios";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";
import googleButton from "../assets/google_signin_buttons/web/1x/btn_google_signin_dark_pressed_web.png";

const Login = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const googleNavigate = (url) => {
    window.location.href = url;
  };

  const auth = async () => {
    const response = await axios.post("/auth/google-auth");
    const res = await axios.get("/auth/google-auth");
    console.log(res);
    const data = await response.data.url;
    console.log(data);
    googleNavigate(data);
  };

  const loginUser = async (values, { setStatus, setValues }) => {
    try {
      const response = await axios.post("/auth/login", values);

      if (response.status === 200) {
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
        .required("username / email / phone is a required field"),
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain 6 character with uppercase, lowercase, numbers and special characters"
        ),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const config = {
    label: "username/email",
    placeholder: "username/email",
    name: "user_identification",
    type: "text",
    value: formik.values.user_identification,
  };

  return (
    <div className="bg-white h-full lg:h-screen lg:w-full lg:item-center lg:justify-center lg:grid lg:grid-cols-2 lg:items-center ">
      <div className="lg:col-span-1 lg:grid">
        <img src={login} alt="" className="hidden lg:block lg:w-1/2 lg:ml-52" />
        <div className="hidden lg:grid lg:justify-center ">
          <p className="text-center font-bold">Easy Buying at Warehouse</p>
          <p>
            Join and experience the convenience of transacting at Warehouse.
          </p>
        </div>
      </div>
      <div className="lg:col-span-1 ">
        <div className=" lg:grid lg:justify-center lg:items-center  ">
          <div className=" lg:w-80 lg:drop-shadow-2xl lg:rounded-xl lg:bg-blue5 ">
            <div className="flex mt-10 justify-between items-end ">
              <h1 className="text-3xl font-bold mx-3 text-blue3 lg:rounded-xl">
                Login
              </h1>
            </div>
            <div className="lg:rounded-lg">
              <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
                {errMsg ? (
                  <div className="w-screen bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:w-full">
                    <p className="bg-inherit">{errMsg}</p>
                  </div>
                ) : null}
                <div className="mt-5 px-2 grid gap-y-5 lg:rounded-xl">
                  <InputForm
                    label={config.label}
                    onChange={handleForm}
                    placeholder={config.placeholder}
                    name={config.name}
                    type={config.type}
                    value={config.value}
                  />
                  <PasswordInput
                    name="password"
                    onChange={handleForm}
                    value={formik.values.password}
                  />

                  <div className="flex flex-col justify-center items-center mt-3  lg:rounded-lg">
                    <Button
                      buttonSize="small"
                      buttonText="Log in"
                      type="submit"
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-semibold"
                    />
                    <h1 className="mt-2 lg:my-4">
                      Dont have an account yet?{" "}
                      <Link to="/register" className="font-semibold">
                        Sign Up
                      </Link>
                    </h1>
                    <button
                      className="btn-auth"
                      type="button"
                      onClick={() => auth()}
                    >
                      <img
                        className="btn-auth-img"
                        src={googleButton}
                        alt="google sign in"
                      />
                    </button>
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
