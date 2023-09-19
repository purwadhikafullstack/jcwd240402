"use client";

import { Button, Modal } from "flowbite-react";
import ButtonLocal from "../../Button";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import AlertWithIcon from "../../AlertWithIcon";

export default function ConfirmationPaymentModal({
  errMsg,
  buttonText,
  message,
  bgColor,
  onActionConfirmation,
  row,
}) {
  const [openModal, setOpenModal] = useState();

  const props = { openModal, setOpenModal };

  const handleAction = async (id) => {
    await Promise.all([
      onActionConfirmation(id),
      props.setOpenModal(undefined),
    ]);
  };

  return (
    <>
      <ButtonLocal
        buttonSize="small"
        buttonText={buttonText}
        onClick={() => props.setOpenModal("pop-up")}
        type="button"
        bgColor={bgColor}
        colorText="text-white"
      />

      <Modal
        show={props.openModal === "pop-up"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
              {message}
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  handleAction(row.id);
                }}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => props.setOpenModal(undefined)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
