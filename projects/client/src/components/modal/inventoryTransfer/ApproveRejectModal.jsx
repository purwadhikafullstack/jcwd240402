import React, { useState,useEffect } from "react";
import { Modal } from "flowbite-react";
import axios from "../../../api/axios";
import Button from "../../Button";
import { getCookie } from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon";

const ApproveRejectModal = ({
  show,
  onClose,
  transfer,
  onSuccessfulAction,
}) => {
  const access_token = getCookie("access_token");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!show) {
      setErrorMessage(null);
    }
  }, [show]);

  const handleApprove = async () => {
    try {
      const response = await axios.patch(
        `/admin/stock-transfers/${transfer.id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.status === 200) {
        onSuccessfulAction();
        onClose();
      }
    } catch (error) {
        console.log("Caught Error", error); 
        if (error.response) {
          setErrorMessage(error.response.data.message || "An unknown error occurred.");
        } else if (error.message) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("Network Error.");
        }
      }
      
  };

  console.log(errorMessage);

  const handleReject = async () => {
    try {
      const response = await axios.patch(
        `/admin/stock-transfers/${transfer.id}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.status === 200) {
        onSuccessfulAction();
        onClose();
      } else {
        throw new Error("Rejection Failed");
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Transfer failed");
    }
  };

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Manage Stock Transfer
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <AlertWithIcon errMsg={errorMessage} color="failure" />
        )}
        {transfer && (
          <div className="mb-4">
            <p>
              <strong>From Warehouse:</strong>{" "}
              {transfer.FromWarehouse.fromWarehouseName}
            </p>
            <p>
              <strong>To Warehouse:</strong>{" "}
              {transfer.ToWarehouse.toWarehouseName}
            </p>
            <p>
              <strong>Product Name:</strong>{" "}
              {transfer.Warehouse_stock.Product.name}
            </p>
            <p>
              <strong>Quantity:</strong> {transfer.quantity}
            </p>
          </div>
        )}
        <div className="flex justify-center gap-4">
          <Button
            bgColor="bg-gray-300"
            colorText="text-gray-700"
            fontWeight="font-semibold"
            buttonText="Reject"
            onClick={handleReject}
          />
          <Button
            bgColor="bg-green-300"
            colorText="text-gray-700"
            fontWeight="font-semibold"
            buttonText="Approve"
            onClick={handleApprove}
          />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ApproveRejectModal;
