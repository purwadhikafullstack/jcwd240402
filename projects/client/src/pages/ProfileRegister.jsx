import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import { useFormik } from "formik";
import * as yup from "yup";

import InputForm from "../components/InputForm";
import Button from "../components/Button";

const ProfileRegister = () => {
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState("");
  const { token } = useParams();
  console.log(token);

  const profileRegister = async (values, { setStatus, setValues }) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(values));
    formData.append("file", image[0]);
    setShowImage(image[0].name);
    try {
      const response = await axios.post(`/auth/profile/${token}`, formData);

      if (response.status === 201) {
        setStatus({ success: true });
        setValues({
          first_name: "",
          last_name: "",
          phone: "",
        });
        setStatus({
          success: true,
          message: "verify account successful",
        });

        navigate("/login");
      } else {
        throw new Error("verify account Failed");
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
      first_name: "",
      last_name: "",
      phone: "",
    },
    onSubmit: profileRegister,
    validationSchema: yup.object().shape({
      first_name: yup.string().required().min(2).max(20),
      last_name: yup.string().required().min(2).max(20),
      phone: yup
        .string()
        .required("required")
        .min(10)
        .max(13)
        .matches(
          /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
          "Phone number is not valid"
        ),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleFile = (e) => {
    const files = e.target.files;
    const file = e.target.files[0];
    setShowImage(URL.createObjectURL(file));
    setImage([...files]);
  };

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const inputConfigs = [
    {
      label: "first name",
      placeholder: "first name",
      name: "first_name",
      type: "text",
      value: formik.values.first_name,
      handle: handleForm,
    },
    {
      label: "last name",
      placeholder: "last_name",
      name: "last_name",
      type: "text",
      value: formik.values.last_name,
      handle: handleForm,
    },
    {
      label: "phone",
      placeholder: "phone number",
      name: "phone",
      type: "text",
      value: formik.values.phone,
      handle: handleForm,
    },
    {
      label: "image profile",
      placeholder: "",
      name: "phone",
      type: "file",
      value: "",
      handle: handleFile,
    },
  ];

  return (
    <div className="bg-white h-full lg:h-full lg:w-full lg:grid lg:grid-cols-2 lg:items-center ">
      <div className="lg:col-span-2 lg:absolute lg:left-[600px] lg:bottom-16 lg:flex lg:border-2 lg:justify-center">
        <div className=" lg:grid lg:justify-center lg:items-center  ">
          <div className=" lg:w-80 lg:drop-shadow-2xl lg:rounded-xl lg:bg-blue5 ">
            <div className="flex mt-10 justify-between items-end ">
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
                <div className="mt-5 px-2 grid gap-y-5 lg:rounded-xl">
                  {inputConfigs.map((config, index) => (
                    <InputForm
                      key={index}
                      label={config.label}
                      onChange={config.handle}
                      placeholder={config.placeholder}
                      name={config.name}
                      type={config.type}
                      value={config.value}
                    />
                  ))}
                  <div className="flex flex-col justify-center items-center mt-3  lg:rounded-lg">
                    <Button
                      buttonSize="small"
                      buttonText="Register"
                      type="submit"
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-semibold"
                    >
                      Register Account
                    </Button>
                    <h1 className="mt-2 lg:my-4">
                      Have an account?{" "}
                      <Link
                        to="/login"
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

export default ProfileRegister;
