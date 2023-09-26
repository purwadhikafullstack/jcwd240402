import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import axios from "../../../api/axios";
import InputForm from "../../InputForm";
import Button from "../../Button";
import { getCookie } from "../../../utils/tokenSetterGetter";

const EditCategoryNameModal = ({ show, onClose, categoryId, handleSuccessfulEdit,categoryName }) => {
  const access_token = getCookie("access_token");
  const hasResetForm = useRef(false);
  const [errMsg, setErrMsg] = useState("");

  const handleModalClose = () => {
    formik.resetForm();
    setErrMsg("");
    onClose();
  };

  const editCategoryName = async (values) => {
    try {
      const response = await axios.patch(
        `/admin/category/name/${categoryId}`,
        { name: values.categoryName }, {
          headers: { Authorization: `Bearer ${access_token}` }
        }
      );
  
      if (response.status === 200) {
        formik.resetForm();
        onClose();
        handleSuccessfulEdit();
      } else {
        throw new Error("Edit Category Name Failed");
      }
    } catch (err) {
      let displayedError = false;
  
      if (err.response?.data?.errors) {
        err.response.data.errors.forEach(error => {
          if (error.path === "name") {
            formik.setFieldError("categoryName", error.msg);
            displayedError = true;
          }
        });
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      categoryName: "",
    },
    onSubmit: editCategoryName,
    validationSchema: yup.object().shape({
      categoryName: yup.string()
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    if (!show && !hasResetForm.current) {
      formik.resetForm();
      hasResetForm.current = true;
    } else if (show) {
      hasResetForm.current = false;
    }
  }, [show, formik]);

  return (
    <Modal show={show} size="md" popup onClose={handleModalClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit Category Name{" "}
          <strong>{categoryName}</strong>
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          {errMsg && (
            <div className="bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2">
              <p className="bg-inherit">{errMsg}</p>
            </div>
          )}
          <div className="mt-5 px-6 grid gap-y-3">
            <InputForm
              label="Category Name"
              name="categoryName"
              placeholder = "Enter category name"
              onChange={formik.handleChange}
              value={formik.values.categoryName}
              errorMessage={formik.errors.categoryName}
            />
            <div className="flex flex-col justify-center items-center mt-3">
              <Button
                type="submit"
                buttonSize="medium"
                buttonText="Save"
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

export default EditCategoryNameModal;
