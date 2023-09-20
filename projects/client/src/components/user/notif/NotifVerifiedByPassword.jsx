import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import verified from "../../../assets/images/verified.webp";
import axios from "../../../api/axios";
import {
  removeCookie,
  removeLocalStorage,
} from "../../../utils/tokenSetterGetter";
import NotifVerifies from "./NotifVerifies";
import { useFormik } from "formik";
import Button from "../../Button";
import PasswordInput from "../../PasswordInput";
import AlertWithIcon from "../../AlertWithIcon";

const NotifVerifiedByPassword = () => {
  const { verify_token } = useParams();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const msg = "Congrats! your account verified";
  removeCookie("access_token");
  removeLocalStorage("refresh_token");

  const verifyUser = async (values, { setStatus, setValues }) => {
    try {
      const response = await axios.post(
        `user/auth/verify/${verify_token}`,
        values
      );
      console.log(response.data);
      console.log(!response.data.ok);
      if (response.data.ok) {
        setStatus({ success: true });
        setValues({
          password: "",
        });
        setStatus({
          success: true,
          message: "verification successful",
        });
        setErrMsg("");
        setSuccessMsg(response.data.message);
        setTimeout(() => {
          navigate(`/verified/${verify_token}`);
        }, 2000);
      } else {
        setSuccessMsg("");
        setErrMsg(response.data.message);
      }
    } catch (err) {
      console.log(err);
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      user_identification: "",
      password: "",
    },
    onSubmit: verifyUser,
    validationSchema: yup.object().shape({
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "password must to contain at least 8 character, 1 number and 1 symbol"
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
    <div className="w-full h-screen flex flex-col justify-center items-center">
      {errMsg ? (
        <AlertWithIcon errMsg={errMsg} />
      ) : successMsg ? (
        <AlertWithIcon errMsg={successMsg} color="success" />
      ) : null}
      <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
        <div className="mt-5 px-6 grid py-4 shadow-card-1 gap-y-2 lg:rounded-xl">
          <PasswordInput
            name="password"
            label="password"
            onChange={handleForm}
            value={formik.values.password}
            isError={!!formik.errors.password}
            errorMessage={formik.errors.password}
            placeholder="password"
          />

          <div className="mb-4 flex justify-center">
            <button
              type="submit"
              className="bg-blue3 px-3 text-white py-1 rounded-md text-xs font-semibold"
            >
              verify my account
            </button>
            {/*  <Button
              buttonSize="small"
              buttonText="verify my account"
              type="submit"
              bgColor="bg-blue3"
              colorText="text-white"
              fontWeight="font-semibold"
            /> */}
          </div>
        </div>
      </form>
    </div>
  );
};

export default NotifVerifiedByPassword;
