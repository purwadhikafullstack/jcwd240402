import React, { useState } from "react";
import { Modal } from "flowbite-react";
import Button from "../../Button";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon"

const ConfirmDeleteCategory = ({ show, onClose, handleSuccessfulEdit, categoryId,categoryName }) => {
  const access_token = getCookie("access_token");
  const [errMsg, setErrMsg] = useState("");
  
  const handleDelete = async () => {
    try {
      const response = await axios.patch(`/admin/category/${categoryId}`, {}, {
        headers: { Authorization: `Bearer ${access_token}` }
      });
      if (response.status === 200) {
        onClose();
        handleSuccessfulEdit();
      } 
    } catch (error) {
      if (error.response && error.response.data) {
        setErrMsg(error.response.data.message);
      } else {
        setErrMsg(error.message);
      }
      setTimeout(() => {
        setErrMsg('');
      }, 3000);
    }
  };

  return (
    <Modal show={show} size="sm" popup onClose={onClose}>
      <Modal.Header>
      {errMsg && <AlertWithIcon errMsg={errMsg} color="failure" />}
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Confirm Deletion
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
      <p>   Are you sure you want to delete the category{" "}
          <strong>{categoryName}</strong>?</p>
        <div className="flex justify-center mt-4 gap-4">
          <Button
            buttonSize="medium"
            buttonText="Cancel"
            bgColor="bg-gray-300"
            colorText="text-gray-700"
            fontWeight="font-semibold"
            onClick={onClose}
          />
          <Button
            buttonSize="medium"
            buttonText="Delete"
            bgColor="bg-red-500"
            colorText="text-white"
            fontWeight="font-semibold"
            onClick={handleDelete}
            className="ml-4"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmDeleteCategory;

