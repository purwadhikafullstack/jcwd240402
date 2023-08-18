"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "../../api/axios";
import { getCookie } from "../../utils/tokenSetterGetter";
import AlertWithIcon from "../AlertWithIcon";
import { useDispatch } from "react-redux";
import { addressUser } from "../../features/userAddressSlice";

export default function ModalConfirmationDelete({ id }) {
  const dispatch = useDispatch();
  const access_token = getCookie("access_token");

  const [openModal, setOpenModal] = useState();
  const [errMsg, setErrMsg] = useState("");

  const props = { openModal, setOpenModal };

  const deleteAddress = () => {
    try {
      axios
        .delete(`/user/profile/address/${id}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          props.setOpenModal(undefined);
          axios
            .get("/user/profile/address", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => {
              dispatch(addressUser(res.data?.result));
            });
        })
        .catch((error) => setErrMsg(error));
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error);
      }
    }
  };

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
              remember, you can't delete your primary address. Are you sure you
              want to delete this address?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  deleteAddress();
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
