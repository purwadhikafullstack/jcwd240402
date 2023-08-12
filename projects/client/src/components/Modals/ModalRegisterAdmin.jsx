import React, { useState } from "react";
import { Modal } from "flowbite-react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import Button from "../Button";
import InputForm from "../InputForm";

const RegisterAdminModal = ({ show, onClose }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

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

  const handleRegister = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/register",
        {
          ...values,
          warehouse_id: selectedWarehouse?.value,
        }
      );

      if (response.status === 201) {
        onClose();
        // Reset form or perform any necessary actions
      } else {
        throw new Error("Admin Registration Failed");
      }
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
    }
  };

  const handleSubmit = (values) => {
    handleRegister(values);
  };

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
        <form onSubmit={handleSubmit}>
          <div className="px-6 grid gap-y-3">
            <InputForm
              label="Username"
              name="username"
              type="text"
              placeholder="Enter username"
            />
            <InputForm
              label="First Name"
              name="first_name"
              type="text"
              placeholder="Enter first name"
            />
            <InputForm
              label="Last Name"
              name="last_name"
              type="text"
              placeholder="Enter last name"
            />
            <InputForm
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
            />
            <div className="flex-1">
              <AsyncSelect
                classNamePrefix="react-select"
                loadOptions={loadWarehouses}
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                placeholder="Select Warehouse"
              />
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

export default RegisterAdminModal;
