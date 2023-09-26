import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";

import AlertWithIcon from "../../AlertWithIcon";
import axios from "../../../api/axios";
import InputForm from "../../InputForm";
import { getCookie } from "../../../utils/tokenSetterGetter";
import Button from "../../Button";
import { profileUser } from "../../../features/userDataSlice";

const ModalEditFirstName = () => {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const [errMsg, setErrMsg] = useState("");
  const userData = useSelector((state) => state.profiler.value);

  useEffect(() => {
    formik.setValues({
      first_name: userData.User_detail?.first_name || "",
    });
  }, [userData]);

  const editFirstName = async (values, { setStatus, setValues }) => {
    const formData = new FormData();
    formData.append("first_name", values.first_name);
    try {
      await axios
        .patch("/user/profile", formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setStatus({ success: true });
          setValues({
            first_name: "",
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
      first_name: "",
    },
    onSubmit: editFirstName,
    validationSchema: yup.object().shape({
      first_name: yup
        .string()
        .required("first name is required")
        .min(3)
        .max(20),
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
              first name
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}
              <div className="flex flex-col gap-y-2 mb-3">
                <InputForm
                  width="w-full"
                  label="first name"
                  onChange={handleForm}
                  placeholder="first name"
                  name="first_name"
                  type="text"
                  value={formik.values.first_name}
                  isError={!!formik.errors.first_name}
                  errorMessage={formik.errors.first_name}
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

export default ModalEditFirstName;
