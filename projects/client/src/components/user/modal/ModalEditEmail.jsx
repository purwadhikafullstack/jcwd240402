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

const ModalEditEmail = () => {
  const access_token = getCookie("access_token");

  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const editEmail = async (values, { setStatus, setValues }) => {
    const formData = new FormData();
    formData.append("email", values.email);
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
            navigate("/verify");
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
      email: "",
    },
    onSubmit: editEmail,
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
        className="ml-2 md:ml-4 lg:ml-4"
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
              email
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}

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

export default ModalEditEmail;
