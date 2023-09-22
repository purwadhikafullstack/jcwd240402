import React, { useState } from "react";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import Button from "../../Button";
import InputForm from "../../InputForm";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../../../api/axios";
import TextAreaForm from "../../TextAreaForm";
import { getCookie } from "../../../utils/tokenSetterGetter";
import emptyImage from "../../../assets/images/emptyImage.jpg";

const RegisterWarehouseModal = ({ show, onClose }) => {
  const access_token = getCookie("access_token");
  const [selectedCity, setSelectedCity] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const handleModalClose = () => {
    formik.resetForm();
    setSelectedCity(null);
    setErrMsg("");
    onClose();
  };

  const handleErrors = (error) => {
    const serverErrors = error.response?.data?.errors;
    if (serverErrors) {
      serverErrors.forEach((err) => formik.setFieldError(err.path, err.msg));
    } else {
      setErrMsg(error.message || "Registration failed");
    }
  };

  const addWarehouse = async (values) => {
    try {
      if (!selectedCity) throw new Error("Please select a city.");

      const formData = new FormData();
      formData.append("warehouse_name", values.warehouse_name);
      formData.append("address_warehouse", values.address_warehouse);
      formData.append("warehouse_contact", values.warehouse_contact);
      formData.append("city_id", selectedCity.value);
      formData.append("file", image);

      const response = await axios.post("/warehouse/register", formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (response.status === 201) {
        formik.resetForm();
        setSelectedCity(null);
        onClose();
        setShowImage(false);
        setImage(null);
      } else {
        throw new Error("Warehouse Registration Failed");
      }
    } catch (error) {
      handleErrors(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      warehouse_name: "",
      address_warehouse: "",
      warehouse_contact: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: addWarehouse,
    validationSchema: yup.object().shape({
      warehouse_name: yup.string().required("Warehouse Name is required"),
      address_warehouse: yup.string().required("Address is required"),
      warehouse_contact: yup.string().required("Contact is required"),
    }),
  });

  const loadCities = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/city/?searchName=${inputValue}&page=1`
      );
      return response.data.cities.map((city) => ({
        value: city.id,
        label: city.name,
      }));
    } catch (error) {
      console.error("Error loading cities:", error);
      return [];
    }
  };

  const handleFile = (e) => {
    const selectedImage = e.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setImage(selectedImage);
  };

  return (
    <Modal
      show={show}
      size="3xl"
      popup
      onClose={() => {
        handleModalClose();
        setShowImage(false);
        setImage(null);
      }}
    >
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Register Warehouse
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
          <div className="">
            <div className="md:flex lg:flex md:justify-between lg:justify-between justify-center items-center">
              <form
                onSubmit={addWarehouse}
                className="px-6 grid gap-y-3 w-full"
              >
                <InputForm
                  label="Warehouse Name"
                  name="warehouse_name"
                  type="text"
                  placeholder="Enter warehouse name"
                  value={formik.values.warehouse_name}
                  onChange={formik.handleChange}
                  isError={formik.errors.warehouse_name}
                  errorMessage={formik.errors.warehouse_name}
                />
                <TextAreaForm
                  label="Address Warehouse"
                  name="address_warehouse"
                  placeholder="Enter address"
                  value={formik.values.address_warehouse}
                  onChange={formik.handleChange}
                  errorMessage={formik.errors.address_warehouse}
                  rows={3}
                />
                <InputForm
                  label="Contact Warehouse"
                  name="warehouse_contact"
                  type="text"
                  placeholder="Enter contact"
                  value={formik.values.warehouse_contact}
                  onChange={formik.handleChange}
                  isError={formik.errors.warehouse_contact}
                  errorMessage={formik.errors.warehouse_contact}
                />
                <AsyncSelect
                  classNamePrefix="react-select"
                  loadOptions={loadCities}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder="Select City"
                  defaultOptions
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 999,
                      position: "fixed",
                    }),
                  }}
                />
              </form>
              <div className="flex flex-col flex-wrap justify-center items-center mt-2 w-fit">
                <img
                  src={showImage ? showImage : emptyImage}
                  alt=""
                  className="w-52 md:w-full lg:w-full"
                />
                <input
                  type="file"
                  onChange={handleFile}
                  name="image"
                  accept="image/png, image/jpg, image/jpeg"
                  className="rounded-full m-4"
                />
              </div>
            </div>
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

export default RegisterWarehouseModal;
