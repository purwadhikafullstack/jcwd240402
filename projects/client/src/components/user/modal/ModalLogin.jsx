import { Modal } from "flowbite-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";

import Button from "../../Button";
import PasswordInput from "../../PasswordInput";
import InputForm from "../../InputForm";
import axios from "../../../api/axios";
import ModalForgotPassword from "./ModalForgotPassword";
import AlertWithIcon from "../../AlertWithIcon";
import { setCookie, setLocalStorage } from "../../../utils/tokenSetterGetter";
import { profileUser } from "../../../features/userDataSlice";

export default function ModalLogin({
  buttonText = "Log in",
  bgColor = "bg-blue3",
  buttonSize = "small",
  colorText = "text-white",
}) {
  const [openModal, setOpenModal] = useState();
  const [email, setEmail] = useState("");
  const props = { openModal, setOpenModal, email, setEmail };
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const currentURL = location.pathname;
  const loginUser = async (values, { setStatus, setValues }) => {
    try {
      await axios.post("/user/auth/login", values).then((res) => {
        const accessToken = res.data.accessToken;
        const refreshToken = res.data.refreshToken;
        setLocalStorage("refresh_token", refreshToken);
        setCookie("access_token", accessToken, 1);

        setStatus({
          success: true,
          message: "Login successful.",
        });

        setValues({
          user_identification: "",
          password: "",
        });
        navigate(`${currentURL}`);
        if (accessToken && refreshToken) {
          axios
            .get("/user/profile", {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
            .then((res) => dispatch(profileUser(res.data.result)));
        }

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
      user_identification: "",
      password: "",
    },
    onSubmit: loginUser,
    validationSchema: yup.object().shape({
      user_identification: yup
        .string()
        .required("username / email / phone is a required field"),
      password: yup
        .string()
        .min(6)
        .required()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "The password must contain 6 character with uppercase, lowercase, numbers and special characters"
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
    <>
      <Button
        onClick={() => props.setOpenModal("form-elements")}
        buttonSize={buttonSize}
        buttonText={buttonText}
        bgColor={bgColor}
        colorText={colorText}
        fontWeight="font-semibold"
      >
        Login
      </Button>
      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => {
          props.setOpenModal(undefined);
          setErrMsg(false);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold  text-blue3 lg:rounded-xl">
              Login
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}

              <div className="flex flex-col gap-y-2 mb-3">
                <InputForm
                  width="w-full"
                  label="username/email"
                  onChange={handleForm}
                  placeholder="username / email"
                  name="user_identification"
                  type="text"
                  value={formik.values.user_identification}
                  isError={!!formik.errors.user_identification}
                  errorMessage={formik.errors.user_identification}
                />

                <PasswordInput
                  width="w-full"
                  name="password"
                  onChange={handleForm}
                  placeholder="password"
                  label="password"
                  value={formik.values.password}
                  isError={!!formik.errors.password}
                  errorMessage={formik.errors.password}
                />
              </div>
              <div className="flex justify-end mb-3">
                <ModalForgotPassword />
              </div>
              <div className="w-full">
                <Button
                  buttonSize="small"
                  buttonText="Log in"
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
                onClick={() => {
                  props.setOpenModal(undefined);
                }}
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
