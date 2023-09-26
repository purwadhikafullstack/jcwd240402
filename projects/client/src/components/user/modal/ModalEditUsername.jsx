import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import AlertWithIcon from "../../AlertWithIcon";
import axios from "../../../api/axios";
import InputForm from "../../InputForm";
import { getCookie } from "../../../utils/tokenSetterGetter";
import Button from "../../Button";
import { profileUser } from "../../../features/userDataSlice";

const ModalEditUsername = () => {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const [errMsg, setErrMsg] = useState("");
  const userData = useSelector((state) => state.profiler.value);

  useEffect(() => {
    formik.setValues({
      username: userData.username || "",
    });
  }, [userData]);

  const editUsername = async (values, { setStatus, setValues }) => {
    const formData = new FormData();
    formData.append("username", values.username);

    try {
      await axios
        .patch("/user/profile", formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setStatus({ success: true });
          setValues({
            username: "",
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
          formik.resetForm();
          setErrMsg("");
          props.setOpenModal(undefined);
        })
        .catch((err) => {
          setErrMsg(err.response?.data?.message);
        });
    } catch (err) {
      setErrMsg(err.response?.data?.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
    },
    onSubmit: editUsername,
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .required("username is required")
        .min(3)
        .max(20)
        .matches(/^[a-zA-Z0-9_-]+$/, "Username can't contain spaces"),
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
        onClose={() => {
          props.setOpenModal(undefined);
          formik.resetForm();
          setErrMsg("");
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold  text-blue3 lg:rounded-xl">
              Username
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}
              <div className="flex flex-col gap-y-2 mb-3">
                <InputForm
                  width="w-full"
                  label="username"
                  onChange={handleForm}
                  placeholder="username"
                  name="username"
                  type="text"
                  value={formik.values.username}
                  isError={!!formik.errors.username}
                  errorMessage={formik.errors.username}
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

export default ModalEditUsername;
