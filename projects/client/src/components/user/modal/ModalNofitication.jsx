"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function ModalNotification({ is_verify, address_user }) {
  const [openModal, setOpenModal] = useState("pop-up");

  const props = { openModal, setOpenModal };

  console.log(is_verify);
  console.log(address_user);

  return (
    <>
      <Modal
        show={props.openModal === "pop-up"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />

            {!is_verify ? (
              <p>
                Your account{" "}
                <span className="font-bold">hasn't been verified yet</span>,
                Please verify it first{" "}
              </p>
            ) : !address_user ? (
              <p>
                <span className="font-bold">
                  You don't have a main address yet
                </span>
                , Please register your address and set your main address
              </p>
            ) : !is_verify && !address_user ? (
              <p>
                Your account hasn't been verified and you don't have a main
                address yet. Make settings in your profile and complete your
                profile
              </p>
            ) : null}

            <div className="flex justify-center gap-4">
              <Button>Yes, I'm sure</Button>
              <Button
                color="gray"
                onClick={() => {
                  props.setOpenModal(undefined);
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
