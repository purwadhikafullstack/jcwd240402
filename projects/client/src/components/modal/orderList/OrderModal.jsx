import { Modal } from "flowbite-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { saveAs } from "file-saver";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaDownload } from "react-icons/fa";

import { getCookie } from "../../../utils/tokenSetterGetter";
import Button from "../../Button";
import ConfirmationPaymentModal from "./ConfirmationPaymentModal";
import waitingpayment from "../../../assets/images/waitingpayment.png";

const OrderModal = ({ row, onApprove, onReject, onSend, onCancel }) => {
  console.log(row.id);
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const [errMsg, setErrMsg] = useState("");
  const imgPayment = `${process.env.REACT_APP_API_BASE_URL}${row.Image}`;

  console.log(row);

  const product = row.Order_details.map((item) => {
    return;
  });

  const downloadImage = () => {
    saveAs(imgPayment, `payment-proof/${row.invoiceId}-${row.Username}`);
  };
  console.log(row);
  return (
    <>
      <Button
        buttonSize="small"
        buttonText="confirm"
        onClick={() => {
          props.setOpenModal("form-elements");
        }}
        type="button"
        bgColor="bg-blue3"
        colorText="text-white"
        fontWeight="font-semibold"
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
                <div className="w-72 h-72 md:w-96 md:h-96 lg:w-96 lg:h-96 mx-6 shadow-card-1 rounded-lg relative">
                  <img
                    className="h-full w-full object-cover"
                    src={`${process.env.REACT_APP_API_BASE_URL}${row.Image}`}
                    alt="Product"
                  />
                  {/* <h1 className="font-inherit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-white ">
                    Waiting Payment
                  </h1> */}
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
              {/* 
1 = payment pending
2 = awaiting payment confirmation
3 = completed   
4 = In Process
5 = cancelled
6 = shipped
7 = order confirmed
*/}

              <div className="w-full flex flex-col justify-between items-end ">
                <div className=" w-full h-full flex flex-col justify-between mb-4">
                  <div>
                    <h1 className="font-semibold text-xl">Order Data</h1>
                    <h1 className="text-sm">Products :</h1>
                    <div className="grid grid-cols-2">
                      {row.Order_details.map((item) => (
                        <div className="col-span-1 shadow-card-1 mt-2 rounded-md p-2 text-xs">
                          <h1>{item.Warehouse_stock?.Product?.name}</h1>
                          <h1>
                            {item.Warehouse_stock?.Product?.price} x{" "}
                            {item?.quantity} unit
                          </h1>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-y-2 p-2 text-xs">
                    <h1>
                      <span className="font-semibold">username :</span>{" "}
                      {row.Username}
                    </h1>
                    <h1>
                      <span className="font-semibold">address :</span>{" "}
                      {row["Delivering to"]}
                    </h1>
                    <h1>
                      <span className="font-semibold">status :</span>{" "}
                      {row.Status}
                    </h1>
                    <h1>
                      <span className="font-semibold">total transaction :</span>{" "}
                      {row["Delivery Cost"]}
                    </h1>
                    <h1>
                      <span className="font-semibold">total transaction :</span>{" "}
                      {row["Total Transaction"]}
                    </h1>
                  </div>
                </div>
                <div className="w-full flex  justify-evenly items-end ">
                  {row.order_status_id === 1 ? (
                    <>
                      <p>still waiting payment</p>
                      <ConfirmationPaymentModal
                        buttonText="Cancel"
                        bgColor="bg-orange-500"
                        message="are you sure wanna cancel this payment?"
                        onActionConfirmation={onCancel}
                        row={row}
                        bgConfirmColor="bg-orange-500 hover"
                      />
                    </>
                  ) : row.order_status_id === 2 ? (
                    <>
                      <ConfirmationPaymentModal
                        buttonText="Approve"
                        bgColor="bg-green-500"
                        message="are you sure wanna approve this payment?"
                        onActionConfirmation={onApprove}
                        row={row}
                        bgConfirmColor="bg-green-500"
                      />
                      <ConfirmationPaymentModal
                        buttonText="Reject"
                        bgColor="bg-red-500"
                        message="are you sure wanna reject this payment?"
                        onActionConfirmation={onReject}
                        row={row}
                        bgConfirmColor="bg-red-500"
                      />
                      <ConfirmationPaymentModal
                        buttonText="Cancel"
                        bgColor="bg-orange-500"
                        message="are you sure wanna cancel this payment?"
                        onActionConfirmation={onCancel}
                        row={row}
                        bgConfirmColor="bg-orange-500"
                      />
                    </>
                  ) : row.order_status_id === 4 ? (
                    <>
                      <ConfirmationPaymentModal
                        buttonText="Send"
                        bgColor="bg-blue-500"
                        message="are you sure wanna send this payment?"
                        onActionConfirmation={onSend}
                        row={row}
                        bgConfirmColor="bg-blue-500"
                      />
                    </>
                  ) : row.order_status_id === 6 ? (
                    <h1 className="text-center font-semibold text-xs">
                      order has been shipped, waiting confirmation order from
                      user
                    </h1>
                  ) : row.order_status_id === 5 ? (
                    <h1 className="text-center font-semibold text-xs">
                      order cancelled
                    </h1>
                  ) : row.order_status_id === 3 ? (
                    <h1 className="text-center font-semibold text-xs">
                      order completed
                    </h1>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderModal;