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

const WarehouseInputsEdit = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialWarehouseData, setInitialWarehouseData] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const { warehouseName } = useParams();
  const access_token = getCookie("access_token");
  const navigate = useNavigate();

  const handleUpdateImage = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrMsg("you have to upload an image to submit");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    console.log("test");
    try {
      await axios
        .patch(`/warehouse/image/${warehouseName}`, formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          console.log(res);
          setSuccessMsg("image update successful");
          setTimeout(() => {
            setSuccessMsg("");
          }, 3000);
        })
        .catch((err) => {
          setErrMsg(err.response?.data?.error);
        });
    } catch (error) {
      console.log(error);
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.error);
      }
    }
  };

  const validationSchema = Yup.object().shape({
    warehouse_name: Yup.string().required("Required"),
    address_warehouse: Yup.string().required("Required"),
    warehouse_contact: Yup.string().required("Required"),
    city_id: Yup.number().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      id: "",
      warehouse_name: "",
      address_warehouse: "",
      warehouse_contact: "",
      city_id: "",
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
          formik.setErrors({});
          if (
            changes.warehouse_name &&
            changes.warehouse_name !== formik.initialValues.warehouse_name
          ) {
            setTimeout(() => {
              navigate("/warehouse");
            }, 5000);
          }
        } else {
          throw new Error("Warehouse update failed");
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const errorMessages = error.response.data.errors.reduce(
            (acc, curr) => {
              acc[curr.path] = curr.msg;
              return acc;
            },
            {}
          );
          formik.setErrors(errorMessages);
        } else {
          alert(error.message || "Edit failed");
        }
      }
    },
  });

  useEffect(() => {
    const fetchWarehouseData = async () => {
      try {
        const response = await axios.get(`/warehouse/${warehouseName}`);
        if (response.data && response.data.warehouse) {
          setCurrentImage(response.data?.warehouse?.warehouse_img);
          const { warehouse } = response.data;
          const initialData = {
            id: warehouse.id,
            warehouse_name: warehouse.warehouse_name,
            address_warehouse: warehouse.address_warehouse,
            warehouse_contact: warehouse.warehouse_contact,
            city_id: warehouse.city_id,
          };
          formik.setValues(initialData);
          setInitialWarehouseData(initialData);
          setSelectedCity({
            value: warehouse.city_id,
            label: warehouse.City.name,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching warehouse data", error);
        setLoading(false);
      }
    };

    fetchWarehouseData();
  }, [warehouseName]);

  const handleCancel = () => {
    navigate("/admin/warehouses");
  };

  console.log(errMsg);

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

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 px-6">
          <h2 className="text-xl font-semibold mb-5">Edit Warehouse</h2>
          {successMsg ? (
            <div className="bg-green-200 text-green-700 h-10 flex justify-center items-center mt-2">
              <p>{successMsg}</p>
            </div>
          ) : errMsg ? (
            <div className="bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2">
              <p>{errMsg}</p>
            </div>
          ) : null}
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
                  City
                </label>
                <AsyncSelect
                  cacheOptions
                  value={selectedCity}
                  defaultOptions
                  loadOptions={loadCities}
                  onChange={(selectedOption) => {
                    setSelectedCity(selectedOption);
                    formik.setFieldValue("city_id", selectedOption.value);
                  }}
                  placeholder="Select a city"
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
                  />
                </div>
              </form>
            </div>
            <div className="md:col-span-1 lg:col-span-1 h-96 flex flex-col justify-center items-center mt-10">
              <img
                src={
                  showImage
                    ? showImage
                    : `${process.env.REACT_APP_API_BASE_URL}${currentImage}`
                }
                alt=""
                className="w-1/2"
              />
              <div className="flex flex-col items-center">
                <input
                  type="file"
                  onChange={handleFile}
                  name="image"
                  accept="image/png, image/jpg, image/jpeg"
                  className="rounded-full m-4 border-2"
                />
                <Button
                  type="submit"
                  buttonText="change image"
                  bgColor="bg-blue3"
                  colorText="text-white"
                  fontWeight="font-bold"
                  buttonSize="medium"
                  onClick={handleUpdateImage}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdmin(WarehouseInputsEdit);
