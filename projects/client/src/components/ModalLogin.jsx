import { Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useState } from "react";
import Button from "./Button";
import PasswordInput from "./PasswordInput";
import InputForm from "./InputForm";
import { Link } from "react-router-dom";

export default function ModalLogin() {
  const [openModal, setOpenModal] = useState();
  const [email, setEmail] = useState("");
  const props = { openModal, setOpenModal, email, setEmail };

  return (
    <>
      <Button
        onClick={() => props.setOpenModal("form-elements")}
        buttonSize="small"
        buttonText="Log in"
        bgColor="bg-blue3"
        colorText="text-white"
        fontWeight="font-semibold"
      >
        Login
      </Button>
      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Sign in to our platform
            </h3>
            <div>
              <InputForm
                placeholder="username/email"
                type="text"
                label="username/email"
                width="w-full"
              />
            </div>
            <div>
              <PasswordInput width="w-full" />
            </div>
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="w-full">
              <Button
                buttonSize="small"
                buttonText="Log in"
                bgColor="bg-blue3"
                colorText="text-white"
                fontWeight="font-semibold"
              />
            </div>
            <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
              Not registered?&nbsp;
              <Link
                href="/register"
                className="text-cyan-700 hover:underline dark:text-cyan-500"
              >
                Create account
              </Link>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
