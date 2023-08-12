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

const Register = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const registerUser = async (values, { setStatus, setValues }) => {
    try {
      const response = await axios.post("/auth/register", values);

      if (response.status === 201) {
        setStatus({ success: true });
        setValues({
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

        navigate("/verify");
      } else {
        throw new Error("Register Failed");
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
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    onSubmit: registerUser,
    validationSchema: yup.object().shape({
      username: yup.string().required().min(3).max(20),
      email: yup.string().required("email must be filled").email(),
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
    },
    {
      label: "password",
      placeholder: "password",
      name: "password",
      type: "password",
      value: formik.values.password,
    },
    {
      label: "confirm password",
      placeholder: "confirm password",
      name: "confirm_password",
      type: "password",
      value: formik.values.confirm_password,
    },
  ];
  const inputNameCongfigs = [
    {
      label: "first name",
      placeholder: "first name",
      name: "first_name",
      type: "text",
      value: formik.values.first_name,
    },
    {
      label: "last name",
      placeholder: "last name",
      name: "last_name",
      type: "text",
      value: formik.values.last_name,
    },
  ];
  const inputContactConfigs = [
    {
      label: "username",
      placeholder: "username",
      name: "username",
      type: "text",
      value: formik.values.username,
    },
    {
      label: "phone",
      placeholder: "phone number",
      name: "phone",
      type: "text",
      value: formik.values.phone,
    },
  ];

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
                  <div className="w-screen bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:w-full">
                    <p className="bg-inherit">{errMsg}</p>
                  </div>
                ) : null}
                <div className="mt-5 px-6 grid gap-y-3 lg:rounded-xl">
                  <div className="flex gap-x-4 ">
                    <InputForm
                      width="w-full"
                      label={inputNameCongfigs[0].label}
                      onChange={handleForm}
                      placeholder={inputNameCongfigs[0].placeholder}
                      name={inputNameCongfigs[0].name}
                      type={inputNameCongfigs[0].type}
                      value={inputNameCongfigs[0].value}
                    />
                    <InputForm
                      width="w-full"
                      label={inputNameCongfigs[1].label}
                      onChange={handleForm}
                      placeholder={inputNameCongfigs[1].placeholder}
                      name={inputNameCongfigs[1].name}
                      type={inputNameCongfigs[1].type}
                      value={inputNameCongfigs[1].value}
                    />
                  </div>
                  <div className="flex gap-x-4 ">
                    <InputForm
                      width="w-full"
                      label={inputContactConfigs[0].label}
                      onChange={handleForm}
                      placeholder={inputContactConfigs[0].placeholder}
                      name={inputContactConfigs[0].name}
                      type={inputContactConfigs[0].type}
                      value={inputContactConfigs[0].value}
                    />
                    <InputForm
                      width="w-full"
                      label={inputContactConfigs[1].label}
                      onChange={handleForm}
                      placeholder={inputContactConfigs[1].placeholder}
                      name={inputContactConfigs[1].name}
                      type={inputContactConfigs[1].type}
                      value={inputContactConfigs[1].value}
                    />
                  </div>

                  {inputConfigs.map((config, index) => (
                    <InputForm
                      key={index}
                      label={config.label}
                      onChange={handleForm}
                      placeholder={config.placeholder}
                      name={config.name}
                      type={config.type}
                      value={config.value}
                    />
                  ))}
                  <div className="flex flex-col justify-center items-center mt-3  lg:rounded-lg">
                    <Button
                      buttonSize="medium"
                      buttonText="Register"
                      type="submit"
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-semibold"
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

export default Register;
