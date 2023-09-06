import React, { useState, useEffect } from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import InputForm from "../../InputForm";
import TextAreaForm from "../../TextAreaForm";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import Sidebar from "../../SidebarAdminDesktop";
import withAuthAdmin from "../withAuthAdmin";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../Button";

const WarehouseInputsEdit = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [initialWarehouseData, setInitialWarehouseData] = useState(null);
  const { warehouseName } = useParams();
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    warehouse_name: Yup.string().required('Required'),
    address_warehouse: Yup.string().required('Required'),
    warehouse_contact: Yup.string().required('Required'),
    city_id: Yup.number().required('Required')
  });

  const formik = useFormik({
    initialValues: {
      id: '',
      warehouse_name: '',
      address_warehouse: '',
      warehouse_contact: '',
      city_id: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      const changes = {};

      if (initialWarehouseData) {
        Object.keys(values).forEach(key => {
          if (key !== 'id' && values[key] !== initialWarehouseData[key]) {
            changes[key] = values[key];
          }
        });
      }

      if (Object.keys(changes).length === 0) {
        alert("No changes detected");
        return;
      }

      try {
        const response = await axios.patch(`/warehouse/${values.id}`, changes);
        if (response.status === 200) {
          setSuccessMsg('Updated successfully!');
          formik.setErrors({});
          if (changes.warehouse_name && changes.warehouse_name !== formik.initialValues.warehouse_name) {
            setTimeout(() => {
              navigate('/warehouse');
            }, 5000);
          }
        } else {
          throw new Error('Warehouse update failed');
        }
      } catch (error) {
        if (error.response && error.response.data.errors) {
          const errorMessages = error.response.data.errors.reduce((acc, curr) => {
            acc[curr.path] = curr.msg;
            return acc;
          }, {});
          formik.setErrors(errorMessages);
        } else {
          alert(error.message || 'Edit failed');
        }
      }
    }
  });

  useEffect(() => {
    const fetchWarehouseData = async () => {
      try {
        const response = await axios.get(`/warehouse/${warehouseName}`);
        if (response.data && response.data.warehouse) {
          const { warehouse } = response.data;
          const initialData = {
            id: warehouse.id,
            warehouse_name: warehouse.warehouse_name,
            address_warehouse: warehouse.address_warehouse,
            warehouse_contact: warehouse.warehouse_contact,
            city_id: warehouse.city_id
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
    navigate('/warehouse');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 px-6">
        <h2 className="text-xl font-semibold mb-5">Edit Warehouse</h2>
        {successMsg && (
          <div className="bg-green-200 text-green-700 h-10 flex justify-center items-center mt-2">
            <p>{successMsg}</p>
          </div>
        )}
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
          <label className="block font-poppins mb-1 text-gray-700">City</label>
          <AsyncSelect
            cacheOptions
            value={selectedCity}
            onChange={(selectedOption) => {
              setSelectedCity(selectedOption);
              formik.setFieldValue('city_id', selectedOption.value);
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
    </div>
  );
};

export default withAuthAdmin(WarehouseInputsEdit);
