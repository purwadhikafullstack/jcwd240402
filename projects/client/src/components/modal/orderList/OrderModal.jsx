import { Modal } from "flowbite-react";
import React, { useState } from "react";
import { saveAs } from "file-saver";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { FaDownload } from "react-icons/fa";
import { HiMiniClipboardDocumentCheck } from "react-icons/hi2";
import ConfirmationPaymentModal from "./ConfirmationPaymentModal";
import waitingpayment from "../../../assets/images/waitingpayment.png";
import DismissableAlert from "../../DismissableAlert";
import { rupiahFormat } from "../../../utils/formatter";

const OrderModal = ({
  row,
  onApprove,
  onReject,
  onSend,
  onCancel,
  successMsg,
  openAlert,
  setOpenAlert,
  color,
  errMsg,
}) => {
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };
  const imgPayment = `${process.env.REACT_APP_API_BASE_URL}${row.Image}`;

  const downloadImage = () => {
    saveAs(imgPayment, `payment-proof/${row.invoiceId}-${row.Username}`);
  };

  return (
    <>
      <button
        onClick={() => {
          props.setOpenModal("form-elements");
        }}
      >
        <HiMiniClipboardDocumentCheck className="text-2xl hover:text-blue3 transition-all duration-300" />
      </button>
      <Modal
        show={props.openModal === "form-elements"}
        size="4xl"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-base font-bold  text-blue3 lg:rounded-xl">
              Confirm Payment : {row.invoiceId}
            </h1>
            <div className="flex flex-wrap md:flex-nowrap lg:flex-nowrap justify-around">
              <div className="w-full  flex flex-col justify-center items-center">
                <div className="w-72 h-72 md:w-96 md:h-96 lg:w-96 lg:h-96 mx-6 shadow-card-1 rounded-lg relative">
                  <img
                    className="h-full w-full object-cover"
                    src={
                      row.Image
                        ? `${process.env.REACT_APP_API_BASE_URL}${row.Image}`
                        : waitingpayment
                    }
                    alt="Payment Proof"
                  />
                </div>

                {row.Image ? (
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
                      <FaDownload /> Download
                    </button>{" "}
                  </div>
                ) : null}
              </div>
              <div className="w-full flex flex-col justify-between items-end ">
                <div className=" w-full h-full flex flex-col justify-between mb-4">
                  {successMsg ? (
                    <div className="mx-4 md:mx-0 lg:mx-0 absolute left-0 right-0 flex justify-center items-start z-10">
                      <DismissableAlert
                        successMsg={successMsg}
                        openAlert={openAlert}
                        setOpenAlert={setOpenAlert}
                      />
                    </div>
                  ) : errMsg ? (
                    <div className="mx-4 md:mx-0 lg:mx-0  absolute left-0 right-0 flex justify-center items-start z-10">
                      <DismissableAlert
                        successMsg={errMsg}
                        openAlert={openAlert}
                        setOpenAlert={setOpenAlert}
                        color="failure"
                      />
                    </div>
                  ) : null}
                  <div>
                    <h1 className="font-semibold text-xl">Order Data</h1>
                    <h1 className="text-sm">Products :</h1>
                    <div className="grid grid-cols-2">
                      {row.Order_details.map((item) => (
                        <div className="col-span-1 shadow-card-1 mx-2 mt-2 rounded-md p-2 text-xs">
                          <h1>{item.Warehouse_stock?.Product?.name}</h1>
                          <h1>
                            {rupiahFormat(item.Warehouse_stock?.Product?.price)}{" "}
                            x {item?.quantity} unit
                          </h1>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-y-2 p-2 text-xs">
                    <h1>
                      <span className="font-semibold">Username :</span>{" "}
                      {row.Username}
                    </h1>
                    <h1>
                      <span className="font-semibold">Address :</span>{" "}
                      {row["Delivering to"]}
                    </h1>
                    <h1>
                      <span className="font-semibold">Status :</span>{" "}
                      {row.Status}
                    </h1>
                    <h1>
                      <span className="font-semibold">Delivery Cost :</span>{" "}
                      {row["Delivery Cost"]}
                    </h1>
                    <h1>
                      <span className="font-semibold">Total Transaction :</span>{" "}
                      {row["Total Transaction"]}
                    </h1>
                  </div>
                </div>
                <div className="w-full flex  justify-evenly items-end ">
                  {row.order_status_id === 1 ? (
                    <div className="flex w-full items-center justify-around">
                      <p className="text-center italic font-semibold text-xs">
                        Still Waiting Payment
                      </p>
                      <ConfirmationPaymentModal
                        buttonText="Cancel"
                        bgColor="bg-orange-500"
                        message="are you sure wanna cancel this payment?"
                        onActionConfirmation={onCancel}
                        row={row}
                        bgConfirmColor="bg-orange-500 hover"
                      />
                    </div>
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
                    <p className="text-center font-semibold text-xs italic">
                      order has been shipped, waiting confirmation order from
                      user
                    </p>
                  ) : row.order_status_id === 5 ? (
                    <p className="text-center font-semibold text-xs italic">
                      order cancelled
                    </p>
                  ) : row.order_status_id === 3 ? (
                    <p className="text-center font-semibold text-xs italic">
                      order completed
                    </p>
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
