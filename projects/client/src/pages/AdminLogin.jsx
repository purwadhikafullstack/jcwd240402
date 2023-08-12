import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import axios from "axios";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const loginUser = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/admin/login', values);
      if (response.status === 200) {
        navigate('/admin-dashboard');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setErrMsg('Incorrect username or password');
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: loginUser,
    validationSchema: yup.object().shape({
      username: yup.string().required('username is a required field'),
      password: yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <div className="bg-white h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-2 lg:items-center">
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
      <div className="lg:grid lg:justify-center lg:items-center">
        <div className="lg:w-80 lg:drop-shadow-2xl lg:rounded-xl lg:bg-blue5">
          <div className="flex mt-10 justify-between items-end">
            <h1 className="text-3xl font-bold mx-3 text-blue3 lg:rounded-xl">Admin Login</h1>
          </div>
          <div className="lg:rounded-lg">
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg && (
                <div className="bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:w-full">
                  <p className="bg-inherit">{errMsg}</p>
                </div>
              )}
              <div className="mt-5 px-2 grid gap-y-5 lg:rounded-xl">
                <InputForm
                  label="username"
                  placeholder="username"
                  name="username"
                  type="text"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
                <PasswordInput
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                <div className="flex flex-col justify-center items-center mt-3 lg:rounded-lg py-4">
                  <Button
                    buttonSize="medium"
                    buttonText="Login"
                    type="submit"
                    bgColor="bg-blue3"
                    colorText="text-white"
                    fontWeight="font-semibold"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
