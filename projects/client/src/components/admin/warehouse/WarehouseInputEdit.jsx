import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import InputForm from "../../InputForm";
import TextAreaForm from "../../TextAreaForm";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import Sidebar from "../../SidebarAdminDesktop";
import withAuthAdmin from "../withAuthAdmin";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../Button";
import AlertWithIcon from "../../AlertWithIcon";
import { getCookie } from "../../../utils/tokenSetterGetter";
import SidebarAdminMobile from "../../SidebarAdminMobile";
import ImageUpload from "./WarehouseImageUpdate";
import {
  fetchWarehouseData,
  loadCities,
  loadProvinces,
} from "../../../utils/warehouseUtils";
import Loading from "../../Loading";

const WarehouseInputsEdit = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [provinceChanged, setProvinceChanged] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialWarehouseData, setInitialWarehouseData] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const { warehouseName } = useParams();
  const access_token = getCookie("access_token");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWarehouseData(
      warehouseName,
      formik.setValues,
      setCurrentImage,
      setInitialWarehouseData,
      setSelectedCity,
      setSelectedProvince,
      setProvinceChanged,
      setLoading
    );
  }, [warehouseName]);

  const validationSchema = Yup.object().shape({
    warehouse_name: Yup.string().required("Required"),
    address_warehouse: Yup.string().required("Required"),
    warehouse_contact: Yup.string().required("Required"),
    city_id: Yup.number().required("Required"),
    province_id: Yup.number(),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      warehouse_name: "",
      address_warehouse: "",
      warehouse_contact: "",
      city_id: "",
      province_id: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const changes = {};
      if (initialWarehouseData) {
        Object.keys(values).forEach((key) => {
          if (key !== "id" && values[key] !== initialWarehouseData[key]) {
            changes[key] = values[key];
          }
        });
      }
      if (Object.keys(changes).length === 0) {
        alert("No changes detected");
        return;
      }
      try {
        const response = await axios.patch(`/warehouse/${values.id}`, changes, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (response.status === 200) {
          setSuccessMsg("Updated successfully!");
          setIsSubmitted(true);
          setErrMsg("");
          formik.setErrors({});
          setTimeout(() => {
            navigate("/admin/warehouses");
          }, 5000);
        } else {
          throw new Error("Warehouse update failed");
        }
      } catch (error) {
        if (error.response?.data?.error) {
          setErrMsg(error.response.data.error);
          setTimeout(() => {
            setErrMsg("");
          }, 3000);
        }
        if (error.response && error.response.data.errors) {
          const errorMessages = error.response.data.errors.reduce(
            (acc, curr) => {
              acc[curr.path] = curr.msg;
              return acc;
            },
            {}
          );
          const ErrorMessage = errorMessages["province_id"];
          if (ErrorMessage) {
            setErrMsg(ErrorMessage);
          }
          formik.setErrors(errorMessages);
        }
      }
    },
  });

  const handleCancel = () => {
    navigate("/admin/warehouses");
  };
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 px-6">
          <h2 className="text-xl font-semibold mb-5">Edit Warehouse</h2>
          {errMsg && <AlertWithIcon errMsg={errMsg} />}
          {successMsg && (
            <div className="bg-green-200 text-green-700 h-10 flex justify-center items-center mt-2">
              <p>{successMsg}</p>
            </div>
          )}
          <div className="md:grid lg:grid md:grid-cols-2 lg:grid-cols-2 w-full">
            <div className="md:col-span-1 lg:col-span-1">
              <form onSubmit={formik.handleSubmit}>
                <InputForm
                  label="Warehouse Name"
                  name="warehouse_name"
                  value={formik.values.warehouse_name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={formik.errors.warehouse_name}
                  width="w-full"
                />
                <TextAreaForm
                  label="Address"
                  name="address_warehouse"
                  value={formik.values.address_warehouse}
                  rows={3}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={formik.errors.address_warehouse}
                  width="w-full"
                />
                <InputForm
                  label="Contact Number"
                  name="warehouse_contact"
                  value={formik.values.warehouse_contact}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  errorMessage={formik.errors.warehouse_contact}
                  width="w-full"
                />
                <label className="block font-poppins mb-1 text-gray-700">
                  Province
                </label>
                <AsyncSelect
                  cacheOptions
                  value={selectedProvince}
                  defaultOptions
                  loadOptions={loadProvinces}
                  onChange={(selectedOption) => {
                    setSelectedProvince(selectedOption);
                    formik.setFieldValue(
                      "province_id",
                      selectedOption ? selectedOption.value : ""
                    );
                    loadCities("", selectedOption ? selectedOption.value : "");
                    setSelectedCity(null);
                  }}
                  placeholder="Select a province"
                  className="relative"
                />
                <label className="block font-poppins mb-1 text-gray-700">
                  City
                </label>
                <AsyncSelect
                  cacheOptions
                  value={selectedCity}
                  defaultOptions={cities}
                  loadOptions={(inputValue) =>
                    loadCities(inputValue, selectedProvince.value)
                  }
                  isDisabled={!provinceChanged}
                  onChange={(selectedOption) => {
                    setSelectedCity(selectedOption);
                    formik.setFieldValue(
                      "city_id",
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                  placeholder="Select a city"
                  components={{
                    NoOptionsMessage: () => (
                      <div style={{ padding: "8px" }}>
                        Start typing to search for cities.
                      </div>
                    ),
                  }}
                  className="relative"
                />
                <div className="flex mt-4 justify-center gap-2">
                  <Button
                    type="button"
                    buttonText="Cancel"
                    bgColor="bg-gray-300"
                    colorText="text-black"
                    fontWeight="font-bold"
                    buttonSize="medium"
                    onClick={handleCancel}
                  />
                  <Button
                    type="submit"
                    buttonText="Save"
                    bgColor="bg-blue3"
                    colorText="text-white"
                    fontWeight="font-bold"
                    buttonSize="medium"
                    disabled={isSubmitted}
                  />
                </div>
              </form>
            </div>
            <ImageUpload
              currentImage={currentImage}
              showImage={showImage}
              setShowImage={setShowImage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdmin(WarehouseInputsEdit);
