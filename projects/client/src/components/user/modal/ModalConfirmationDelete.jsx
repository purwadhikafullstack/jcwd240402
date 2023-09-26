"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import AlertWithIcon from "../../AlertWithIcon";

export default function ModalConfirmationDelete({
  handleDelete,
  errMsg,
  topic,
  deleteFor,
  purpose = "delete",
  styling,
  setErrMsg,
  setSuccessMsg,
  successMsg,
  styleConfirmButton = " px-3 py-1 rounded-md text-white font-semibold hover:bg-blue-400",
}) {
  const [openModal, setOpenModal] = useState();
  const [dissabledButton, setDissabledButton] = useState(false);

  const props = { openModal, setOpenModal };

  const handleDissabled = () => {
    setDissabledButton(true);
    setTimeout(() => {
      setDissabledButton(false);
    }, 6000);
  };

  return (
    <>
      <button onClick={() => props.setOpenModal("pop-up")} className={styling}>
        <p className="text-xs">{deleteFor}</p>
      </button>
      <Modal
        show={props.openModal === "pop-up"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          {errMsg ? (
            <AlertWithIcon errMsg={errMsg} />
          ) : successMsg ? (
            <AlertWithIcon errMsg={successMsg} color="success" />
          ) : null}
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
              remember, you can't undo {purpose}. Are you sure you want to{" "}
              {purpose} this {topic}?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                className={`${styleConfirmButton} ${
                  dissabledButton ? "bg-gray-500 hover:bg-gray-500" : "bg-blue3"
                }`}
                onClick={() => {
                  handleDelete();
                  handleDissabled();
                }}
                disabled={dissabledButton}
              >
                Yes, I'm sure
              </button>
              <Button
                color="gray"
                onClick={() => {
                  props.setOpenModal(undefined);
                  setErrMsg("");
                  setSuccessMsg("");
                }}
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
