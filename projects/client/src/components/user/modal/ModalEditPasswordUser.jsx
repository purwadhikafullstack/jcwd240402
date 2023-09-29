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
import PasswordInput from "../../PasswordInput";
import { profileUser } from "../../../features/userDataSlice";

const ModalEditPasswordUser = () => {
  const access_token = getCookie("access_token");
  const [openModal, setOpenModal] = useState();
  const dispatch = useDispatch();
  const props = { openModal, setOpenModal };
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const editPassword = async (values, { setStatus, setValues }) => {
    const formData = new FormData();
    formData.append("password", values.password);
    formData.append("new_password", values.new_password);
    formData.append("new_confirm_password", values.new_confirm_password);
    try {
      await axios
        .patch("/user/profile", formData, {
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

          setErrMsg(null);
          props.setOpenModal(undefined);
          setTimeout(() => {
            removeCookie("access_token");
            removeLocalStorage("refresh_token");
            navigate("/log-in");
          }, 3000);
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
      password: "",
      new_password: "",
      new_confirm_password: "",
    },
    onSubmit: editPassword,
    validationSchema: yup.object().shape({
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain 6 character with uppercase, lowercase, numbers and special characters"
        ),
      new_password: yup
        .string()
        .min(6)
        .required("new password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain 6 character with uppercase, lowercase, numbers and special characters"
        ),
      new_confirm_password: yup
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
  return (
    <>
      <button
        onClick={() => {
          props.setOpenModal("form-elements");
        }}
        type="button"
        className="ml-4"
      >
        <p className="underline decoration-solid text-right text-xs text-blue3">
          Edit
        </p>
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
              new password
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}

              <div className="flex flex-col gap-y-2 mb-3">
                <p className="text-justify text-xs text-gray-500">
                  If you change your password, you'll be logged out and need to
                  log in again with the new password.
                </p>
                <PasswordInput
                  name="password"
                  onChange={handleForm}
                  label="old password"
                  placeholder="old password"
                  value={formik.values.password}
                  isError={!!formik.errors.password}
                  errorMessage={formik.errors.password}
                />
                <PasswordInput
                  name="new_password"
                  onChange={handleForm}
                  label="new password"
                  placeholder="new password"
                  value={formik.values.new_password}
                  isError={!!formik.errors.new_password}
                  errorMessage={formik.errors.new_password}
                />

                <InputForm
                  width="w-full"
                  label="confirm new password"
                  onChange={handleForm}
                  placeholder="confirm password"
                  name="new_confirm_password"
                  type="password"
                  value={formik.values.new_confirm_password}
                  isError={!!formik.errors.new_confirm_password}
                  errorMessage={formik.errors.new_confirm_password}
                />
              </div>
              <div className="w-full">
                <Button
                  buttonSize="small"
                  buttonText="submit"
                  type="submit"
                  bgColor="bg-blue3"
                  colorText="text-white"
                  fontWeight="font-semibold"
                />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalEditPasswordUser;
