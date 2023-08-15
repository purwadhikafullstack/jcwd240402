import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import InputForm from "../../components/InputForm";
import Button from "../../components/Button";
import PasswordInput from "../../components/PasswordInput";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const loginUser = async (values, { setStatus, setValues }) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/login",
        values
      );

      if (response.status === 200) {
        setStatus({ success: true });
        setValues({
          username: "",
          password: "",
        });
        setStatus({
          success: true,
          message:
            "Sign up successful. Please check your email for verification.",
        });
        navigate("/admin-dashboard");
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
      username: "",
      password: "",
    },
    onSubmit: loginUser,
    validationSchema: yup.object().shape({
      username: yup.string().required("username is a required field"),
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
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
        <img
          src={
            "https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs/294518105/original/9ccc25635f75ef3a4d8f2fc33b9e81d12c98b72d.jpg"
          }
          alt=""
          className="lg:w-1/2"
        />
        <div className="text-center">
          <p className="font-bold">Admin Portal</p>
          <p>Login to access the administration dashboard.</p>
        </div>
      </div>
      <div className="lg:col-span-1 ">
        <div className="h-screen flex justify-center items-center lg:h-full lg:grid lg:justify-center lg:items-center  ">
          <div className="shadow-2xl w-64 lg:w-80 rounded-xl p-6 ">
            <div className="flex mt-4 px-3 justify-between items-end ">
              <h1 className="text-3xl font-bold mx-3 text-blue3 lg:rounded-xl">
                Login
              </h1>
            </div>
            <div className="lg:rounded-lg">
              <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
                {errMsg ? <div>{errMsg}</div> : null}
                <div className="mt-5 px-6 grid gap-y-4 lg:rounded-xl">
                  <InputForm
                    onChange={handleForm}
                    label="username"
                    placeholder="username"
                    name="username" 
                    type="text"
                    value={formik.values.username} 
                    isError={!!formik.errors.username}
                    errorMessage={formik.errors.username}
                  />
                  <PasswordInput
                    name="password"
                    onChange={handleForm}
                    value={formik.values.password}
                    isError={!!formik.errors.password}
                    errorMessage={formik.errors.password}
                  />

                  <div className="flex flex-col justify-center items-center mt-3  lg:rounded-lg">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;