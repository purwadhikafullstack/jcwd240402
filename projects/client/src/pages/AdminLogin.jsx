import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Button from "../components/Button";
import InputForm from "../components/InputForm";
import PasswordInput from "../components/PasswordInput";

const RegisterAdminModal = ({ show, onClose }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const loadWarehouses = async (inputValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/warehouse/warehouse-list?searchName=${inputValue}&cityId=`
      );
      const results = response.data.warehouses.map((warehouse) => ({
        value: warehouse.id,
        label: warehouse.warehouse_name,
      }));
      return results.length ? results : [];
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    first_name: yup.string().required("First name is required"),
    last_name: yup.string().required("Last name is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      password: "",
      confirmPassword: "",
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        if (!selectedWarehouse) {
          throw new Error("Please select a warehouse.");
        }
        const response = await axios.post("http://localhost:8000/api/admin/register", {
          ...values,
          warehouse_id: selectedWarehouse?.value,
        });

        if (response.status === 201) {
          onClose();
        } else {
          throw new Error("Admin Registration Failed");
        }
      } catch (error) {
        const serverError = error.response?.data?.errors?.[0];
        if (serverError && serverError.path === "username") {
          formik.setFieldError("username", serverError.msg);
        } else {
          setErrMsg(error.message || "Registration failed");
        }
      }
    },
    validationSchema,
  });

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
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
            {/* Username Field */}
            <InputForm
              label="Username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={formik.values.username}
              onChange={formik.handleChange}
              isError={formik.touched.username && !!formik.errors.username}
              errorMessage={formik.errors.username}
            />
            {/* First Name Field */}
            <InputForm
              label="First Name"
              name="first_name"
              type="text"
              placeholder="Enter first name"
              value={formik.values.first_name}
              onChange={formik.handleChange}
              isError={formik.touched.first_name && !!formik.errors.first_name}
              errorMessage={formik.errors.first_name}
            />
            {/* Last Name Field */}
            <InputForm
              label="Last Name"
              name="last_name"
              type="text"
              placeholder="Enter last name"
              value={formik.values.last_name}
              onChange={formik.handleChange}
              isError={formik.touched.last_name && !!formik.errors.last_name}
              errorMessage={formik.errors.last_name}
            />
            {/* Password Field */}
            <PasswordInput
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              isError={formik.touched.password && !!formik.errors.password}
              errorMessage={formik.errors.password}
            />
            {/* Confirm Password Field */}
            <InputForm
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              isError={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
              errorMessage={formik.errors.confirmPassword}
            />
            {/* Warehouse Selection */}
            <div className="flex-1">
              <AsyncSelect
                classNamePrefix="react-select"
                loadOptions={loadWarehouses}
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                placeholder="Select Warehouse"
              />
            </div>
            {/* Submit Button */}
            <div className="flex flex-col justify-center items-center mt-3">
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


