import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import axios from "axios";
import InputForm from "../../InputForm"; 
import Button from "../../Button"; 

const EditCategoryImageModal = ({ show, onClose, categoryId, handleSuccessfulEdit }) => {
  const hasResetForm = useRef(false);
  const [errMsg, setErrMsg] = useState("");

  const editCategoryImage = async (values) => {
    try {
      const formData = new FormData();
      formData.append("category_img", values.categoryImage);

      const response = await axios.patch(
        `http://localhost:8000/api/admin/category/img/${categoryId}`,
        formData
      );
      console.log("Response from server:", response);
      if (response.status === 200) {
        onClose();
        formik.resetForm();
        handleSuccessfulEdit();
      } else {
        throw new Error("Edit Category Image Failed");
      }
    } catch (err) {
      console.log("Error in request:", err);
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      categoryImage: null,
    },
    onSubmit: editCategoryImage,
    validationSchema: yup.object().shape({
      categoryImage: yup.mixed().required("Category Image is required"),
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
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit Category Image
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
              label="Category Image"
              name="categoryImage"
              type="file"
              onChange={(event) => formik.setFieldValue("categoryImage", event.target.files[0])}
              errorMessage={formik.errors.categoryImage}
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

export default EditCategoryImageModal;
