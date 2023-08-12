import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import InputForm from "../components/InputForm";
import PasswordInput from "../components/PasswordInput";
import Button from "../components/Button";
import SidebarAdmin from "../components/SidebarAdminDesktop";
import axios from "axios";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const registerUser = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/register",
        {
          username: values.username,
          first_name: values.firstName,
          last_name: values.lastName,
          password: values.password,
          warehouse_id: values.warehouseId,
        }
      );

      if (response.status === 200) {
        navigate("/admin-login");
      } else {
        throw new Error("Registration Failed");
      }
    } catch (err) {
      setErrMsg(err.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      warehouseId: "",
    },
    onSubmit: registerUser,
    validationSchema: yup.object().shape({
      username: yup.string().required(),
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      password: yup.string().required(),
      warehouseId: yup.number().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <div className="bg-blue1 h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdmin />
      </div>
      <div className="lg:grid lg:justify-center lg:items-center">
        <div className="lg:w-80 lg:drop-shadow-2xl lg:rounded-xl lg:bg-blue5">
          <div className="text-base_black text-center font-semibold pt-4">
            Admin Warehouse
          </div>
          <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
            {errMsg ? (
              <div className="w-screen bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:w-full">
                <p className="bg-inherit">{errMsg}</p>
              </div>
            ) : null}
            <div className="mt-3 px-2 grid gap-y-3 lg:rounded-xl">
              <InputForm
                label="Username"
                placeholder="username"
                name="username"
                type="text"
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              <InputForm
                label="First Name"
                placeholder="First Name"
                name="firstName"
                type="text"
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />
              <InputForm
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                label="username"
                placeholder="username"
                type="text"
              />
              <PasswordInput
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                width="full"
              />
              <InputForm
                label="Warehouse"
                placeholder="1"
                name="warehouseId"
                type="number"
                value={formik.values.warehouseId}
                onChange={formik.handleChange}
              />
              <div className="flex flex-col justify-center items-center mt-3 lg:rounded-lg py-4">
                <Button
                  buttonSize="medium"
                  buttonText="Register"
                  type="submit"
                  bgColor="bg-blue3"
                  colorText="text-white"
                  fontWeight="font-semibold"
                >
                  Register
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
