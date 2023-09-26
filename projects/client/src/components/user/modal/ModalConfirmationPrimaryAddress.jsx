"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch } from "react-redux";

import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon";
import { profileUser } from "../../../features/userDataSlice";

export default function ModalConfirmationPrimaryAddress({ idAddress }) {
  const dispatch = useDispatch();
  const access_token = getCookie("access_token");

  const [openModal, setOpenModal] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const setPrimaryAddress = async () => {
    try {
      await axios.patch(
        `/user/profile/address/primary/${idAddress}`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      await axios
        .get("/user/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          dispatch(profileUser(res.data?.result));
        });

      setOpenModal(false);
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.message);
      }
    }
  };

  return (
    <>
      <button onClick={() => setOpenModal(true)}>
        <p className="text-xs  rounded-lg">Set as Primary Address</p>
      </button>
      <Modal
        show={openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          {errMsg && <AlertWithIcon errMsg={errMsg} />}{" "}
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-sm font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to set this address as the primary address?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                className="bg-blue3"
                onClick={() => {
                  setPrimaryAddress();
                }}
              >
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
