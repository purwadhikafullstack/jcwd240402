"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "../../api/axios";
import { getCookie } from "../../utils/tokenSetterGetter";
import AlertWithIcon from "../AlertWithIcon";
import { useDispatch } from "react-redux";
import { profileUser } from "../../features/userDataSlice";

export default function ModalConfirmationPrimaryAddress({ id }) {
  const dispatch = useDispatch();
  const access_token = getCookie("access_token");

  const [openModal, setOpenModal] = useState(false); // Mengubah default value menjadi `false` untuk menghindari `undefined` pada render awal
  const [errMsg, setErrMsg] = useState("");

  const setPrimaryAddress = async () => {
    // Menggunakan async/await untuk pemanggilan API
    try {
      const response = await axios.patch(
        `/user/profile/address/primary/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const profileResponse = await axios.get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      dispatch(profileUser(profileResponse.data?.result));
      setOpenModal(false);
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg("Set primary address failed");
      }
    }
  };

  return (
    <>
      <button onClick={() => setOpenModal(true)}>
        <p className="text-xs">Set as Primary Address</p>
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
          {/* Menggunakan && untuk menggantikan ternary */}
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
