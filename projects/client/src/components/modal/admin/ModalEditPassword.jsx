import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import axios from "../../../api/axios";
import PasswordInput from "../../PasswordInput";
import InputForm from "../../InputForm";
import Button from "../../Button";
import { getCookie } from "../../../utils/tokenSetterGetter";

const ChangePasswordModal = ({
  show,
  onClose,
  adminId,
  handleSuccessfulEdit,
}) => {
  const access_token = getCookie("access_token");
  const hasResetForm = useRef(false);
  const [errMsg, setErrMsg] = useState("");

  const changePassword = async (values) => {
    try {
      const response = await axios.patch(
        `/admin/change-pass/${adminId}`,
        values,
        { headers: { Authorization: `Bearer ${access_token}` } }
      );

      if (response.status === 200) {
        onClose();
        formik.resetForm();
        handleSuccessfulEdit();
      } else {
        throw new Error("Change Password Failed");
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
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: changePassword,
    validationSchema: yup.object().shape({
      newPassword: yup
        .string()
        .min(8)
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_+=!@#$%^&*])(?=.{8,})/,
          "Password must have at least 8 characters, 1 number, 1 capital, and 1 symbol."
        ),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    if (!show && !hasResetForm.current) {
      formik.resetForm();
      hasResetForm.current = true;
    } else if (show) {
      hasResetForm.current = false;
    }
  }, [show, formik]);

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Change Password
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          {errMsg && (
            <div className="bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2">
              <p className="bg-inherit">{errMsg}</p>
            </div>
          )}
          <div className="mt-5 px-6 grid gap-y-3">
            <PasswordInput
              label="New Password"
              name="newPassword"
              placeholder="Enter new password"
              onChange={formik.handleChange}
              value={formik.values.newPassword}
              errorMessage={formik.errors.newPassword}
            />
            <InputForm
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Enter confirm password"
              onChange={formik.handleChange}
              value={formik.values.confirmPassword}
              errorMessage={formik.errors.confirmPassword}
            />
            <div className="flex flex-col justify-center items-center mt-3">
              <Button
                type="submit"
                buttonSize="medium"
                buttonText="Save"
                bgColor="bg-blue3"
                colorText="text-white"
                fontWeight="font-semibold"
              />
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
