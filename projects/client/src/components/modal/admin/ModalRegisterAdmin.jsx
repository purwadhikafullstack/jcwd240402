import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import Button from "../../Button";
import InputForm from "../../InputForm";
import PasswordInput from "../../PasswordInput";
import { getCookie } from "../../../utils/tokenSetterGetter";

const RegisterAdminModal = ({ show, onClose, onSuccessfulRegister }) => {
  const access_token = getCookie("access_token");
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const handleModalClose = () => {
    formik.resetForm();
    setSelectedWarehouse(null);
    setErrMsg("");
    onClose();
  };

  const loadWarehouses = async (inputValue) => {
    try {
      const { data } = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}&cityId=`
      );
      return (
        data.warehouses.map((wh) => ({
          value: wh.id,
          label: wh.warehouse_name,
        })) || []
      );
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  const handleErrors = (error) => {
    const serverErrors = error.response?.data?.errors;
    if (serverErrors) {
      serverErrors.forEach((err) => formik.setFieldError(err.path, err.msg));
    } else {
      setErrMsg(error.message || "Registration failed");
    }
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        if (!selectedWarehouse) throw new Error("Please select a warehouse.");

        const response = await axios.post(
          "/admin/register",
          {
            ...values,
            warehouse_id: selectedWarehouse?.value,
          },
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        if (response.status === 201) {
          formik.resetForm();
          setSelectedWarehouse(null);
          onClose();
          onSuccessfulRegister();
        } else {
          throw new Error("Admin Registration Failed");
        }
      } catch (error) {
        handleErrors(error);
      }
    },
    validationSchema: yup.object({
      username: yup.string().required("Username is required"),
      first_name: yup.string().required("First name is required"),
      last_name: yup.string().required("Last name is required"),
      password: yup.string().required("Password is required"),
      confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    }),
  });

  const renderInputForm = (label, name, type, placeholder) => (
    <InputForm
      label={label}
      name={name}
      type={type}
      placeholder={placeholder}
      value={formik.values[name]}
      onChange={formik.handleChange}
      isError={!!formik.errors[name]}
      errorMessage={formik.errors[name]}
    />
  );

  return (
    <Modal show={show} size="md" popup onClose={handleModalClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Register Admin
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          {errMsg && (
            <div className="bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2">
              <p>{errMsg}</p>
            </div>
          )}
          <div className="px-6 grid gap-y-3">
            {renderInputForm("Username", "username", "text", "Enter username")}
            {renderInputForm(
              "First Name",
              "first_name",
              "text",
              "Enter first name"
            )}
            {renderInputForm(
              "Last Name",
              "last_name",
              "text",
              "Enter last name"
            )}
            <PasswordInput
              label="Password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              isError={!!formik.errors.password}
              errorMessage={formik.errors.password}
            />
            {renderInputForm(
              "Confirm Password",
              "confirmPassword",
              "password",
              "Confirm password"
            )}
            <div className="flex-1 pt-3">
              <AsyncSelect
                classNamePrefix="react-select"
                loadOptions={loadWarehouses}
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                placeholder="Select Warehouse"
                defaultOptions
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 9999,
                    position: "fixed",
                  }),
                }}
                className="relative z-50"
              />
            </div>
            <div className="flex flex-col justify-center items-center mt-3 ">
              <Button
                type="submit"
                buttonSize="medium"
                buttonText="Register"
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

export default RegisterAdminModal;
