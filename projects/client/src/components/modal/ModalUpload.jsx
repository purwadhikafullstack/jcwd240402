"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";

export default function ModalUpload() {
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };

  return (
    <>
      <Button
        onClick={() => props.setOpenModal("pop-up")}
        className="bg-blue3 mx-2"
      >
        Upload image
      </Button>
      <Modal
        show={props.openModal === "pop-up"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <input type="file" name="" id="" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to upload this image?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="success"
                onClick={() => props.setOpenModal(undefined)}
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
