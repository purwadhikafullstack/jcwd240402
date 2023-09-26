import React, { useState } from "react";
import { Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import AlertWithIcon from "../../AlertWithIcon";
import axios from "../../../api/axios";
import InputForm from "../../InputForm";
import {
  getCookie,
  removeCookie,
  removeLocalStorage,
} from "../../../utils/tokenSetterGetter";
import Button from "../../Button";
import { profileUser } from "../../../features/userDataSlice";

const ModalResendVerify = () => {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();
  const [dissabledButton, setDissabledButton] = useState(false);

  const handleDissabled = () => {
    setDissabledButton(true);
    setTimeout(() => {
      setDissabledButton(false);
    }, 6000);
  };

  const resendVerify = async (values, { setStatus, setValues }) => {
    try {
      await axios
        .post("/user/auth/resend-verify", values, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setStatus({ success: true });
          setValues({
            email: "",
          });
          setStatus({
            success: true,
            message: "Successful. Please check your email for verification.",
          });

          axios
            .get("/user/profile", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => dispatch(profileUser(res.data.result)));

          setSuccessMsg("Email already sent! Please check your email");
          setErrMsg(null);
          setTimeout(() => {
            props.setOpenModal(undefined);
            setDissabledButton(false);
            removeCookie("access_token");
            removeLocalStorage("refresh_token");
            navigate("/verify");
          }, 2000);
        })
        .catch((err) => {
          setDissabledButton(false);
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
      email: "",
    },
    onSubmit: resendVerify,
    validationSchema: yup.object().shape({
      email: yup.string().required("email is required").email(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };
  return (
    <>
      <button
        onClick={() => {
          props.setOpenModal("form-elements");
        }}
        type="button"
        className="bg-blue3 px-2 text-xs text-white rounded-lg font-semibold  py-1"
      >
        Verify my account
      </button>
      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold  text-blue3 lg:rounded-xl">
              email
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? (
                <AlertWithIcon errMsg={errMsg} />
              ) : successMsg ? (
                <AlertWithIcon errMsg={successMsg} color="success" />
              ) : null}

              <div className="flex flex-col gap-y-2 mb-3">
                <p className="text-justify text-xs text-gray-500">
                  If you wish to change your email, please note that this will
                  log you out, requiring account re-verification. Kindly check
                  your email for further instructions to complete the
                  verification process.
                </p>

                <InputForm
                  width="w-full"
                  label="email"
                  onChange={handleForm}
                  placeholder="email"
                  name="email"
                  type="text"
                  value={formik.values.email}
                  isError={!!formik.errors.email}
                  errorMessage={formik.errors.email}
                />
              </div>
              <div className="w-full">
                <Button
                  onClick={() => {
                    formik.handleSubmit();
                    handleDissabled();
                  }}
                  buttonSize="small"
                  buttonText="submit"
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
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalResendVerify;
