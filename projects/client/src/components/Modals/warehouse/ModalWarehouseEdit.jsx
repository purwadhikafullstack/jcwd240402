import React, { useState } from "react";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import Button from "../../Button";
import InputForm from "../../InputForm";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../../../api/axios";
import { loadCities } from "../../../utils/WarehouseListHelp";
import { useSelector, useDispatch } from "react-redux";
import {
  closeWarehouseEditModal,
  selectWarehouseEditModalVisible,
} from "../../../features/warehouseListSlice";

const WarehouseEdit = ({
  onClose,
  onSubmit,
  label,
  name,
  placeholder,
  initialValue = null,
  validationSchema = null,
  refreshWarehouseList,
  warehouseId,
}) => {
  const [errMsg, setErrMsg] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialValue);
  const dispatch = useDispatch();
  const show = useSelector(selectWarehouseEditModalVisible);
  
  const handleClose = () => {
    dispatch(closeWarehouseEditModal());
  }

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

  const getValidationSchema = (label) => {
    switch (label) {
      case "Warehouse Name":
        return yup.object().shape({
          [name]: yup
            .string()
            .required(`${label} is required`)
            .min(8, `${label} must be at least 8 characters`),
        });
      default:
        return yup.object().shape({
          [name]: yup.string().required(`${label} is required`),
        });
    }
  };

  const formik = useFormik({
    initialValues: {
      [name]: selectedCity?.value || "",
    },
    onSubmit: async (values) => {
      try {
        if (
          label === "Warehouse Address" &&
          values[name] !== initialValue?.value
        ) {
          const coordinates = await getCoordinates(values[name]);
          if (coordinates) {
            const updatedValues = {
              ...values,
              longitude: coordinates.longitude,
              latitude: coordinates.latitude,
            };
            const response = await axios.patch(
              `/api/warehouse/${warehouseId}`,
              updatedValues
            );
            if (response.status === 200) {
              setErrMsg("");
              formik.resetForm();
              refreshWarehouseList();
              onClose();
            } else {
              throw new Error("Warehouse update failed");
            }
          } else {
            throw new Error("Address not found");
          }
        } else {
          const response = await axios.patch(
            `/api/warehouse/${warehouseId}`,
            values
          );
          if (response.status === 200) {
            setErrMsg("");
            formik.resetForm();
            refreshWarehouseList();
            onClose();
          } else {
            throw new Error("Warehouse update failed");
          }
        }
      } catch (error) {
        setErrMsg(error.message || "Edit failed");
      }
    },
    validationSchema: validationSchema || getValidationSchema(label),
  });

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit {label}
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
          <div className="mt-5 px-6 grid gap-y-3">
            {label === "City" ? (
              <>
                <label>{label}</label>
                <AsyncSelect
                  classNamePrefix="react-select"
                  loadOptions={loadCities}
                  value={selectedCity}
                  onChange={(selectedOption) => {
                    setSelectedCity(selectedOption);
                    formik.setFieldValue(name, selectedOption?.value || "");
                  }}
                  placeholder="Select City"
                />
              </>
            ) : (
              <InputForm
                label={label}
                name={name}
                type="text"
                placeholder={placeholder}
                onChange={formik.handleChange}
                value={formik.values[name]}
                isError={!!formik.errors[name]}
                errorMessage={formik.errors[name]}
              />
            )}
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

export default WarehouseEdit;
