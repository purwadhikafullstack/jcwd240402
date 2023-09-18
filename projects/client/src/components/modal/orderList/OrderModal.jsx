import { Modal } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveAs } from "file-saver";

import { getCookie } from "../../../utils/tokenSetterGetter";
import Button from "../../Button";
import ConfirmationPaymentModal from "./ConfirmationPaymentModal";
import { FaDownload } from "react-icons/fa";

const OrderModal = ({ row }) => {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const [errMsg, setErrMsg] = useState("");
  const imgPayment = `${process.env.REACT_APP_API_BASE_URL}${row.Image}`;

  console.log(row);

  const downloadImage = () => {
    saveAs(imgPayment, `payment-proof/${row.invoiceId}-${row.Username}`);
  };

  return (
    <>
      <Button
        buttonSize="small"
        buttonText="Edit Button"
        onClick={() => {
          props.setOpenModal("form-elements");
        }}
        type="button"
        bgColor="bg-blue3"
        colorText="text-white"
      />
      <Modal
        show={props.openModal === "form-elements"}
        size="4xl"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-xl font-bold  text-blue3 lg:rounded-xl">
              confirm payment : {row.invoiceId}
            </h1>
            <div className="flex flex-wrap md:flex-nowrap lg:flex-nowrap justify-around">
              <div className="w-full  flex flex-col justify-center items-center">
                <div className="w-72 h-72 md:w-96 md:h-96 lg:w-96 lg:h-96 mx-6 shadow-card-1 rounded-lg">
                  <img
                    className="h-full w-full object-cover"
                    src={`${process.env.REACT_APP_API_BASE_URL}${row.Image}`}
                    alt="Product"
                  />
                </div>
                <div className="flex justify-around w-full items-center text-sm font-semibold mt-4 text-white">
                  <a
                    href={`${process.env.REACT_APP_API_BASE_URL}${row.Image}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-teal-400  px-4 py-1 rounded-lg"
                  >
                    See Detail Image
                  </a>
                  <button
                    onClick={downloadImage}
                    className="bg-green-700 flex gap-4 justify-center items-center px-4 py-1 rounded-lg"
                  >
                    <FaDownload /> download
                  </button>{" "}
                </div>
              </div>
              <div className="w-full flex flex-col justify-evenly items-center">
                <ConfirmationPaymentModal
                  buttonText="Approve"
                  bgColor="bg-green-500"
                  message="are you sure wanna approve this payment?"
                />
                <ConfirmationPaymentModal
                  buttonText="Reject"
                  bgColor="bg-red-500"
                  message="are you sure wanna reject this payment?"
                />
                <ConfirmationPaymentModal
                  buttonText="Cancel"
                  bgColor="bg-orange-500"
                  message="are you sure wanna cancel this payment?"
                />
                <ConfirmationPaymentModal
                  buttonText="Send"
                  bgColor="bg-blue-500"
                  message="are you sure wanna send this payment?"
                />
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderModal;
