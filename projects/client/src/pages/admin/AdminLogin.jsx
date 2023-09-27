import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../../api/axios";
import InputForm from "../../components/InputForm";
import Button from "../../components/Button";
import PasswordInput from "../../components/PasswordInput";
import {
  setCookie,
  removeCookie,
  setLocalStorage,
  removeLocalStorage,
} from "../../utils/tokenSetterGetter";
import login from "../../assets/images/furnifor.png";
import withOutAuth from "../../components/admin/withoutAuthAdmin";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const loginUser = async (values, { setStatus, setValues }) => {
    removeCookie("access_token");
    removeLocalStorage("refresh_token");
    try {
      const response = await axios.post("/admin/login", values);
      if (response.status === 200) {
        const accessToken = response.data?.accessToken;
        const refreshToken = response.data?.refreshToken;
        setLocalStorage("refresh_token", refreshToken);
        setCookie("access_token", accessToken, 1);
        setStatus({ success: true });
        setValues({
          username: "",
          password: "",
        });
        setStatus({
          success: true,
        });
        navigate("/admin/admin-dashboard");
      } else {
        throw new Error("Login Failed");
      }
    } catch (err) {
      let serverErrorMsg = err.response?.data?.error;
      if (serverErrorMsg === "Invalid credentials") {
        setErrMsg("Incorrect username/password");
      } else if (!err.response) {
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
      username: yup.string().required("Username is a required"),
      password: yup.string().required("Password is a required"),
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
        <img src={login} alt="logo" className="lg:w-1/2" />
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
                Login Admin
              </h1>
            </div>
            <div className="lg:rounded-lg">
              <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
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
                  {errMsg ? (
                    <div
                      style={{
                        color: "red",
                        marginTop: "8px",
                        textAlign: "center",
                      }}
                    >
                      {errMsg}
                    </div>
                  ) : null}
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

export default withOutAuth(AdminLogin);
