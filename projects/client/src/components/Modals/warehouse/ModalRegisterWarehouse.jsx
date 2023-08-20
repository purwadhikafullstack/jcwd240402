import React, { useState } from "react";
import axios from "axios";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import Button from "../../Button";
import InputForm from "../../InputForm";
import { useFormik } from "formik";
import * as yup from "yup";

const RegisterWarehouseModal = ({ show, onClose }) => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const validationSchema = yup.object().shape({
    warehouse_name: yup
      .string()
      .required("Warehouse Name is required")
      .min(8, "Warehouse Name must be at least 8 characters"),
    address_warehouse: yup.string().required("Address is required"),
    warehouse_contact: yup.string().required("Contact is required"),
  });

  const formik = useFormik({
    initialValues: {
      warehouse_name: "",
      address_warehouse: "",
      warehouse_contact: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        if (!selectedCity) {
          throw new Error("Please select a city.");
        }
        const coordinates = await getCoordinates(values.address_warehouse);
        if (!coordinates) {
          throw new Error("Address not found");
        }
        const response = await axios.post(
          "http://localhost:8000/api/warehouse/register",
          {
            ...values,
            city_id: selectedCity.value,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }
        );

        if (response.status === 201) {
          formik.resetForm();
          setSelectedCity(null);
          onClose();
        } else {
          throw new Error("Warehouse Registration Failed");
        }
      } catch (error) {
        setErrMsg(error.message || "Registration failed");
      }
    },
    validationSchema,
  });

  const loadCities = async (inputValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/city/?page=1`
      );
      const results = response.data.cities.map((city) => ({
        value: city.id,
        label: city.name,
      }));
      return results.filter((city) =>
        city.label.toLowerCase().includes(inputValue.toLowerCase())
      );
    } catch (error) {
      console.error("Error loading cities:", error);
      return [];
    }
  };

  const getCoordinates = async (address) => {
    const apiKey = "f2f57cc907854a3cb36d25b445d148e6";
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      if (response.data.results && response.data.results.length > 0) {
        return {
          latitude: response.data.results[0].geometry.lat,
          longitude: response.data.results[0].geometry.lng,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
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
          <div className="px-6 grid gap-y-3">
            <InputForm
              label="Warehouse Name"
              name="warehouse_name"
              type="text"
              placeholder="Enter warehouse name"
              value={formik.values.warehouse_name}
              onChange={formik.handleChange}
              isError={!!formik.errors.warehouse_name}
              errorMessage={formik.errors.warehouse_name}
            />
            <InputForm
              label="Address Warehouse"
              name="address_warehouse"
              type="text"
              placeholder="Enter address"
              value={formik.values.address_warehouse}
              onChange={formik.handleChange}
              isError={!!formik.errors.address_warehouse}
              errorMessage={formik.errors.address_warehouse}
            />
            <InputForm
              label="Contact Warehouse"
              name="warehouse_contact"
              type="text"
              placeholder="Enter contact"
              value={formik.values.warehouse_contact}
              onChange={formik.handleChange}
              isError={!!formik.errors.warehouse_contact}
              errorMessage={formik.errors.warehouse_contact}
            />
            <div className="flex-1">
              <AsyncSelect
                classNamePrefix="react-select"
                loadOptions={loadCities}
                value={selectedCity}
                onChange={setSelectedCity}
                placeholder="Select City"
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

export default RegisterWarehouseModal;
