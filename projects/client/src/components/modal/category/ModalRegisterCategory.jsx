import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import axios from "../../../api/axios";
import Button from "../../Button";
import InputForm from "../../InputForm";
import { getCookie } from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon"

const RegisterCategoryModal = ({ show, onClose, onSuccessfulRegister }) => {
  const access_token = getCookie("access_token");
  const [categoryImg, setCategoryImg] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleModalClose = () => {
    formik.resetForm();
    setCategoryImg(null);
    setErrMsg("");
    onClose();
  };

  const validationSchema = yup.object().shape({
    name: yup.string()
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      try {
        let formData = new FormData();
        formData.append("name", values.name);
        if (categoryImg) {
          formData.append("category_img", categoryImg);
        }
        const response = await axios.post("/admin/category", formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if (response.status === 201) {
          formik.resetForm();
          setCategoryImg(null);
          onClose();
          onSuccessfulRegister();
        } else {
          throw new Error("Category Registration Failed");
        }
      } catch (error) {
        if (error.response?.data?.error) {
          setErrMsg(error.response.data.error);
        } else if (error.response?.data?.message) {
          setErrMsg(error.response.data.errors[0].msg);
        }
      }
    },
    validationSchema,
  });

  return (
    <Modal show={show} size="md" popup onClose={handleModalClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Register Category
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
      {errMsg && <AlertWithIcon errMsg={errMsg} />}
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div className="px-6 grid gap-y-3">
            <InputForm
              label="Category Name"
              name="name"
              type="text"
              placeholder="Enter category name"
              value={formik.values.name}
              onChange={formik.handleChange}
              isError={!!formik.errors.name}
              errorMessage={formik.errors.name}
            />
            <div className="relative">
              <input
                name="category_img"
                type="file"
                onChange={(event) => {
                  setCategoryImg(event.target.files[0]);
                  setSelectedFileName(
                    event.target.files[0]?.name || "Choose a file"
                  );
                }}
                className="form-input"
              />
            </div>
            <div className="flex flex-col justify-center items-center mt-3">
              <Button
                type="submit"
                buttonSize="medium"
                buttonText="Register"
                bgColor="bg-blue3"
                colorText="text-white"
                fontWeight="font-semibold"
              />
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterCategoryModal;
