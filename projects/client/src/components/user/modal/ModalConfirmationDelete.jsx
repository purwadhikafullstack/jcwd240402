"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch } from "react-redux";

import axios from "../../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon";
import { addressUser } from "../../../features/userAddressSlice";

export default function ModalConfirmationDelete({
  handleDelete,
  errMsg,
  topic,
}) {
  const [openModal, setOpenModal] = useState();

  const props = { openModal, setOpenModal };

  return (
    <>
      <button onClick={() => props.setOpenModal("pop-up")}>
        <p className="text-xs">delete address</p>
      </button>
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
              remember, you can't undo delete. Are you sure you want to delete
              this {topic}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  handleDelete();
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
