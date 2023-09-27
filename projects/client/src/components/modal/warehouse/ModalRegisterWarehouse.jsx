import React, { useState, useEffect } from "react";
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
import AlertWithIcon from "../../AlertWithIcon";

const RegisterWarehouseModal = ({ show, onClose }) => {
  const access_token = getCookie("access_token");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    setSelectedCity(null);
  }, [selectedProvince]);

  const handleModalClose = () => {
    formik.resetForm();
    setErrMsg("");
    setSelectedCity(null)
    setSelectedProvince(null)
    onClose();
  };

  const setSelectedProvinceAndForm = (selected) => {
    setSelectedProvince(selected);
    formik.setFieldValue("province_id", selected?.value || "");
  };

  const setSelectedCityAndForm = (selected) => {
    setSelectedCity(selected);
    formik.setFieldValue("city_id", selected?.value || "");
  };

  const handleErrors = (error) => {
    const serverErrors = error.response?.data?.errors;
    if (serverErrors) {
      serverErrors.forEach((err) => formik.setFieldError(err.path, err.msg));
    } else if (error.response.data.error) {
      setErrMsg(error.response.data.error);
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
      formData.append("province_id", selectedProvince.value);
      formData.append("file", image);

      const response = await axios.post("/warehouse/register", formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      if (response.status === 201) {
        formik.resetForm();
        setSelectedCity(null);
        setSelectedProvince(null);
        onClose();
        setShowImage(false);
        setImage(null);
      } else {
        throw new Error("Warehouse Registration Failed");
      }
    } catch (error) {
      setErrMsg(error.response.data.error);
      handleErrors(error);
    }
  };

  const formik = useFormik({
    initialValues: {
      warehouse_name: "",
      address_warehouse: "",
      warehouse_contact: "",
      province_id: "",
      city_id: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: addWarehouse,
    validationSchema: yup.object().shape({
      warehouse_name: yup.string().required("Warehouse Name is required"),
      address_warehouse: yup.string().required("Address is required"),
      warehouse_contact: yup.string().required("Contact is required"),
      province_id: yup.string().required("Province is required"),
      city_id: yup.string().required("City is required"),
    }),
  });

  const loadCities = async (inputValue = "") => {
    try {
      if (!selectedProvince) return [];
      const response = await axios.get(
        `/admin/city/?searchName=${inputValue}&page=1&provinceId=${selectedProvince.value}`
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

  const loadProvinces = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/province/?searchName=${inputValue}&page=1`
      );
      return response.data.provinces.map((province) => ({
        value: province.id,
        label: province.name,
      }));
    } catch (error) {
      console.error("Error loading provinces:", error);
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
        {errMsg && <AlertWithIcon errMsg={errMsg} />}
        <form onSubmit={formik.handleSubmit}>
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
                  cacheOptions
                  classNamePrefix="react-select"
                  loadOptions={loadProvinces}
                  value={selectedProvince}
                  onChange={setSelectedProvinceAndForm}
                  placeholder="Select Province"
                  defaultOptions
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 999,
                    }),
                  }}
                  className="relative z-50"
                />
                {formik.errors.province_id && (
                  <div className="text-red-500">
                    {formik.errors.province_id}
                  </div>
                )}
                <AsyncSelect
                  isDisabled={!selectedProvince}
                  classNamePrefix="react-select"
                  loadOptions={(inputValue) =>
                    selectedProvince ? loadCities(inputValue) : loadCities("")
                  }
                  value={selectedCity}
                  onChange={setSelectedCityAndForm}
                  placeholder="Select City"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 999,
                    }),
                  }}
                  defaultOptions
                  components={{
                    NoOptionsMessage: () => (
                      <div style={{ padding: "8px" }}>
                        Start typing to search for cities.
                      </div>
                    ),
                  }}
                  className="relative z-50"
                />
                {formik.errors.city_id && (
                  <div className="text-red-500">{formik.errors.city_id}</div>
                )}
              </form>
              <div className="flex flex-col flex-wrap justify-center items-center mt-2 w-fit">
                <img
                  src={showImage ? showImage : emptyImage}
                  alt="warehouse"
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
