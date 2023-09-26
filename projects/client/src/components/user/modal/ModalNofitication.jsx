"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function ModalNotification({ is_verify, address_user }) {
  const [openModal, setOpenModal] = useState("pop-up");

  const props = { openModal, setOpenModal };

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

            <div className="flex justify-center gap-4 mt-4">
              <Link
                to={
                  !is_verify
                    ? "/user/setting"
                    : !address_user
                    ? "/user/setting/address"
                    : "/user/setting"
                }
                className="bg-blue3 flex justify-center items-center px-4 rounded-lg text-white font-semibold text-sm"
              >
                {!is_verify
                  ? "Setting Profile"
                  : !address_user
                  ? "Setting Address"
                  : "Completing My Profile"}
              </Link>

              <Button
                color="gray"
                onClick={() => {
                  props.setOpenModal(undefined);
                }}
              >
                I'll do it later
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
