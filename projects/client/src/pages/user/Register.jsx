import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import register from "../../assets/images/furnifor.png";
import axios from "../../api/axios";
import InputForm from "../../components/InputForm";
import Button from "../../components/Button";
import AuthImageCard from "../../components/AuthImageCard";
import {
  removeCookie,
  removeLocalStorage,
} from "../../utils/tokenSetterGetter";
import AlertWithIcon from "../../components/AlertWithIcon";
import withOutAuthUser from "../../components/user/withoutAuthUser";
import PasswordInput from "../../components/PasswordInput";

const Register = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [dissabledButton, setDissabledButton] = useState(false);
  removeCookie("access_token");
  removeLocalStorage("refresh_token");

  const registerUser = async (values, { setStatus, setValues }) => {
    try {
      await axios
        .post("/user/auth/register", values)
        .then((res) => {
          setStatus({ success: true });
          setValues({
            first_name: "",
            last_name: "",
            phone: "",
            username: "",
            email: "",
            password: "",
            confirm_password: "",
          });
          setStatus({
            success: true,
            message:
              "Sign up successful. Please check your email for verification.",
          });
          setErrMsg("");
          setSuccessMsg("Register successful");
          setDissabledButton(true);
          setTimeout(() => {
            setDissabledButton(true);
            navigate("/verify");
          }, 2000);
        })
        .catch((err) => {
          setErrMsg(err.response?.data?.message);
        });
    } catch (err) {
      setDissabledButton(false);
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: registerUser,
    validationSchema: yup.object().shape({
      first_name: yup
        .string()
        .required("first name is required")
        .min(3)
        .max(20),
      last_name: yup.string().required("last name is required").min(3).max(20),
      phone: yup
        .string()
        .required("phone number is required")
        .min(10)
        .max(13)
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          "Phone number is not valid"
        ),
      username: yup
        .string()
        .required("username is required")
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z0-9_-]+$/, "Username can't contain spaces"),
      email: yup.string().required("email is required").email(),
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain 6 character with uppercase, lowercase, numbers and special characters"
        ),
      confirm_password: yup
        .string()
        .oneOf(
          [yup.ref("password"), null],
          "Password confirmation must match the password"
        )
        .required("Password confirmation is required"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const inputConfigs = [
    {
      label: "email",
      placeholder: "email",
      name: "email",
      type: "email",
      value: formik.values.email,
      error: !!formik.errors.email,
      errorMsg: formik.errors.email,
    },
    {
      label: "password",
      placeholder: "password",
      name: "password",
      type: "password",
      value: formik.values.password,
      error: !!formik.errors.password,
      errorMsg: formik.errors.password,
    },
    {
      label: "confirm password",
      placeholder: "confirm password",
      name: "confirm_password",
      type: "password",
      value: formik.values.confirm_password,
      error: !!formik.errors.confirm_password,
      errorMsg: formik.errors.confirm_password,
    },
  ];
  const inputNameCongfigs = [
    {
      label: "first name",
      placeholder: "first name",
      name: "first_name",
      type: "text",
      value: formik.values.first_name,
      error: !!formik.errors.first_name,
      errorMsg: formik.errors.first_name,
    },
    {
      label: "last name",
      placeholder: "last name",
      name: "last_name",
      type: "text",
      value: formik.values.last_name,
      error: !!formik.errors.last_name,
      errorMsg: formik.errors.last_name,
    },
  ];
  const inputContactConfigs = [
    {
      label: "username",
      placeholder: "username",
      name: "username",
      type: "text",
      value: formik.values.username,
      error: !!formik.errors.username,
      errorMsg: formik.errors.username,
    },
    {
      label: "phone",
      placeholder: "phone number",
      name: "phone",
      type: "text",
      value: formik.values.phone,
      error: !!formik.errors.phone,
      errorMsg: formik.errors.phone,
    },
  ];

  const handleDissabled = () => {
    setDissabledButton(true);
    setTimeout(() => {
      setDissabledButton(false);
    }, 7000);
  };

  return (
    <div className="bg-white h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-2 lg:items-center ">
      <AuthImageCard imageSrc={register} />
      <div className="lg:col-span-1">
        <div className=" lg:grid lg:justify-center lg:items-center  ">
          <div className=" lg:w-[500px] lg:shadow-3xl lg:rounded-xl lg:h-fit ">
            <div className="flex mt-4 px-3 justify-between items-end ">
              <h1 className="text-3xl font-bold mx-3 text-blue3 lg:rounded-xl">
                Register
              </h1>
            </div>
            <div className="lg:rounded-lg">
              <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
                {errMsg ? (
                  <AlertWithIcon errMsg={errMsg} />
                ) : successMsg ? (
                  <AlertWithIcon errMsg={successMsg} color="success" />
                ) : null}
                <div className="mt-5 px-6 grid gap-y-3 lg:rounded-xl">
                  <div className="flex gap-x-4 ">
                    <InputForm
                      width="w-full"
                      label={`${inputNameCongfigs[0].label}*`}
                      onChange={handleForm}
                      placeholder={inputNameCongfigs[0].placeholder}
                      name={inputNameCongfigs[0].name}
                      type={inputNameCongfigs[0].type}
                      value={inputNameCongfigs[0].value}
                      isError={inputNameCongfigs[0].error}
                      errorMessage={inputNameCongfigs[0].errorMsg}
                    />
                    <InputForm
                      width="w-full"
                      label={`${inputNameCongfigs[1].label}*`}
                      onChange={handleForm}
                      placeholder={inputNameCongfigs[1].placeholder}
                      name={inputNameCongfigs[1].name}
                      type={inputNameCongfigs[1].type}
                      value={inputNameCongfigs[1].value}
                      isError={inputNameCongfigs[1].error}
                      errorMessage={inputNameCongfigs[1].errorMsg}
                    />
                  </div>
                  <div className="flex gap-x-4 ">
                    <InputForm
                      width="w-full"
                      label={`${inputContactConfigs[0].label}*`}
                      onChange={handleForm}
                      placeholder={inputContactConfigs[0].placeholder}
                      name={inputContactConfigs[0].name}
                      type={inputContactConfigs[0].type}
                      value={inputContactConfigs[0].value}
                      isError={inputContactConfigs[0].error}
                      errorMessage={inputContactConfigs[0].errorMsg}
                    />
                    <InputForm
                      width="w-full"
                      label={`${inputContactConfigs[1].label}*`}
                      onChange={handleForm}
                      placeholder={inputContactConfigs[1].placeholder}
                      name={inputContactConfigs[1].name}
                      type={inputContactConfigs[1].type}
                      value={inputContactConfigs[1].value}
                      isError={inputContactConfigs[1].error}
                      errorMessage={inputContactConfigs[1].errorMsg}
                    />
                  </div>

                  {inputConfigs.map((config, index) =>
                    config.label === "email" ? (
                      <InputForm
                        key={index}
                        label={`${config.label}*`}
                        onChange={handleForm}
                        placeholder={config.placeholder}
                        name={config.name}
                        type={config.type}
                        value={config.value}
                        isError={config.error}
                        errorMessage={config.errorMsg}
                      />
                    ) : (
                      <PasswordInput
                        key={index}
                        label={`${config.label}*`}
                        onChange={handleForm}
                        placeholder={config.placeholder}
                        name={config.name}
                        type={config.type}
                        value={config.value}
                        isError={config.error}
                        errorMessage={config.errorMsg}
                      />
                    )
                  )}
                  <div className="flex flex-col justify-center items-center mt-3  lg:rounded-lg">
                    <Button
                      onClick={() => {
                        formik.handleSubmit();
                        handleDissabled();
                      }}
                      buttonSize="medium"
                      buttonText="Register"
                      type="submit"
                      bgColor={`${
                        dissabledButton
                          ? "bg-gray-500 hover:bg-gray-500"
                          : "bg-blue3"
                      }`}
                      colorText="text-white"
                      fontWeight="font-semibold"
                      disabled={dissabledButton}
                    />

                    <h1 className="mt-2 lg:my-4">
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

export default withOutAuthUser(Register);
