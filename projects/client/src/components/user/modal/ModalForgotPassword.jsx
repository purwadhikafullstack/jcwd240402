import { Modal } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";

import Button from "../../Button";
import InputForm from "../../InputForm";
import axios from "../../../api/axios";
import AlertWithIcon from "../../AlertWithIcon";

export default function ModalForgotPassword() {
  const [openModal, setOpenModal] = useState();
  const [email, setEmail] = useState("");
  const props = { openModal, setOpenModal, email, setEmail };
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [dissabledButton, setDissabledButton] = useState(false);

  const handleDissabled = () => {
    setDissabledButton(true);
    setTimeout(() => {
      setDissabledButton(false);
    }, 6000);
  };

  const forgotPassword = async (values, { setStatus, setValues }) => {
    try {
      await axios.post("/user/auth/forgot-password", values).then((res) => {
        setStatus({ success: true });
        setValues({
          email: "",
        });
        setStatus({
          success: true,
          message: "Successful. Please check your email for verification.",
        });

        navigate("/forgot-password");
        setErrMsg(null);
        props.setOpenModal(undefined);
      });
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
        setTimeout(() => {
          setErrMsg("");
        }, 2000);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    onSubmit: forgotPassword,
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
      >
        <p className="underline decoration-solid text-right text-xs text-base_grey">
          Forgot Password?
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
              Forgot Password
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}
              <div className="flex flex-col gap-y-2 mb-3">
                <InputForm
                  width="w-full"
                  label="email"
                  onChange={handleForm}
                  placeholder="email"
                  name="email"
                  type="email"
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

            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <Link
                to="/sign-up"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
                onClick={() => props.setOpenModal(undefined)}
              >
                Create account
              </Link>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
