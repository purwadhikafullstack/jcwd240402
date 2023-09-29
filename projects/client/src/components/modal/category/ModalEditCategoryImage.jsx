import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import Button from "../../Button";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon"

const EditCategoryImageModal = ({
  show,
  onClose,
  categoryId,
  handleSuccessfulEdit,
  categoryName,
}) => {
  const hasResetForm = useRef(false);
  const access_token = getCookie("access_token");
  const [selectedFileName, setSelectedFileName] = useState("Choose a file...");
  const [errMsg, setErrMsg] = useState("");

  const handleModalClose = () => {
    formik.resetForm();
    setSelectedFileName("Choose a file...");
    setErrMsg("");
    onClose();
  };
  const editCategoryImage = async (values) => {
    try {
      const formData = new FormData();
      formData.append("category_img", values.categoryImage);

      const response = await axios.patch(
        `/admin/category/img/${categoryId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.status === 200) {
        formik.resetForm();
        onClose();
        handleSuccessfulEdit();
      } else {
        throw new Error("Edit Category Image Failed");
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setErrMsg(err.response.data.error);
      } else if (err.response?.data?.message) {
        setErrMsg(err.response.data.errors[0].msg);
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
    <Modal show={show} size="md" popup onClose={handleModalClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit Category Image {categoryName}
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
      {errMsg && <AlertWithIcon errMsg={errMsg}/>}
        <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
          <div className="px-6 grid gap-y-3 pt-2">
            <div className="relative">
              <input
                id="categoryImageInput"
                name="categoryImage"
                type="file"
                onChange={(event) => {
                  formik.setFieldValue(
                    "categoryImage",
                    event.currentTarget.files[0]
                  );
                  setSelectedFileName(
                    event.currentTarget.files[0]?.name || "Choose a file"
                  );
                }}
                className="form-input"
              />
            </div>
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
