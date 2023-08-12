import { Modal } from "flowbite-react";
import { useState } from "react";
import Button from "./Button";
import InputForm from "./InputForm";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useFormik } from "formik";
import * as yup from "yup";

export default function ModalForgotPassword() {
  const [openModal, setOpenModal] = useState();
  const [email, setEmail] = useState("");
  const props = { openModal, setOpenModal, email, setEmail };
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");

  const forgotPassword = async (values, { setStatus, setValues }) => {
    try {
      console.log(values);
      const response = await axios.post("/auth/forgot-password", values);
      if (response.status === 201) {
        setStatus({ success: true });
        setValues({
          email: "",
        });
        setStatus({
          success: true,
          message: "Successful. Please check your email for verification.",
        });

        navigate("/");
        setErrMsg(null);
        props.setOpenModal(undefined);
      } else {
        console.log("error");
        throw new Error("Login Failed");
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
      email: "",
    },
    onSubmit: forgotPassword,
    validationSchema: yup.object().shape({
      email: yup.string().required("email must be filled").email(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const config = {
    label: "email",
    placeholder: "email",
    name: "email",
    type: "email",
    value: formik.values.email,
  };

  return (
    <>
      <button
        onClick={() => {
          props.setOpenModal("form-elements");
        }}
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
              {/* <DismissableAlert color="failure" message={errMsg} /> */}
              <div className="flex flex-col gap-y-2 mb-3">
                <InputForm
                  width="w-full"
                  label={config.label}
                  onChange={handleForm}
                  placeholder={config.placeholder}
                  name={config.name}
                  type={config.type}
                  value={config.value}
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
