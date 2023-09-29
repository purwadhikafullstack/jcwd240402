import React, { useState } from "react";

import InputForm from "../../components/InputForm";
import Button from "../../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../api/axios";
import { useFormik } from "formik";
import * as yup from "yup";
import AlertWithIcon from "../../components/AlertWithIcon";
import { removeCookie } from "../../utils/tokenSetterGetter";
import PasswordInput from "../../components/PasswordInput";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  removeCookie("access_token");

  const resetPassword = async (values, { setStatus, setValues }) => {
    try {
      await axios
        .patch(`/user/auth/reset-password/${resetToken}`, values)
        .then((res) => {
          setStatus({ success: true });
          setValues({
            reset_password_token: "",
            new_password: "",
            confirm_password: "",
          });
          setStatus({
            success: true,
            message:
              "Sign up successful. Please check your email for verification.",
          });
          navigate("/reset-password-success");
        });
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
      reset_password_token: "",
      new_password: "",
      confirm_password: "",
    },
    onSubmit: resetPassword,
    validationSchema: yup.object().shape({
      reset_password_token: yup
        .string()
        .required("reset password code is required"),
      new_password: yup
        .string()
        .min(6)
        .required("password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain 6 character with uppercase, lowercase, numbers and special characters"
        ),
      confirm_password: yup
        .string()
        .oneOf(
          [yup.ref("new_password"), null],
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

  const config = [
    {
      label: "reset password code",
      placeholder: "reset password code",
      name: "reset_password_token",
      type: "text",
      value: formik.values.reset_password_token,
      error: !!formik.errors.reset_password_token,
      errorMsg: formik.errors.reset_password_token,
    },
    {
      label: "new password",
      placeholder: "new password",
      name: "new_password",
      type: "password",
      value: formik.values.new_password,
      error: !!formik.errors.new_password,
      errorMsg: formik.errors.new_password,
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

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-96 h-fit shadow-3xl rounded-lg mx-4">
        <h1 className="text-3xl font-bold px-5 pt-3 text-blue3 lg:rounded-xl">
          Reset Password
        </h1>
        <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
          {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}

          <div className="mt-5 px-6 grid gap-y-3 lg:rounded-xl">
            {config.map((item, idx) =>
              item.label === "reset password code" ? (
                <InputForm
                  key={idx}
                  label={item.label}
                  onChange={handleForm}
                  placeholder={item.placeholder}
                  name={item.name}
                  type={item.type}
                  value={item.value}
                  isError={item.error}
                  errorMessage={item.errorMsg}
                />
              ) : (
                <PasswordInput
                  key={idx}
                  label={item.label}
                  onChange={handleForm}
                  placeholder={item.placeholder}
                  name={item.name}
                  type={item.type}
                  value={item.value}
                  isError={item.error}
                  errorMessage={item.errorMsg}
                />
              )
            )}
            <div className="flex flex-col my-4 justify-center items-center mt-3 lg:rounded-lg">
              <Button
                buttonSize="medium"
                buttonText="submit"
                type="submit"
                bgColor="bg-blue3"
                colorText="text-white"
                fontWeight="font-semibold"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
