import React, { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import axios from "../../../api/axios";
import Button from "../../Button";
import { getCookie } from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon";

const UpdateStock = ({
  show,
  onClose,
  warehouseId,
  productId,
  handleSuccessfulEdit,
  productName,
}) => {
  const access_token = getCookie("access_token");
  const hasResetForm = useRef(false);
  const [errMsg, setErrMsg] = useState("");

  const updateStock = async (values) => {
    try {
      const response = await axios.patch(
        `/warehouse-stock/${warehouseId}/${productId}`,
        {
          productStock: values.productStock,
          operation: values.operation,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (response.status === 200) {
        onClose();
        formik.resetForm();
        setErrMsg("");
        handleSuccessfulEdit();
      } else {
        throw new Error("Update Stock Failed");
      }
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      productStock: "",
      operation: "increase",
    },
    onSubmit: updateStock,
    validationSchema: yup.object().shape({
      productStock: yup
        .number()
        .min(1, "Product stock must be at least 1")
        .required("Product stock is required"),
      operation: yup
        .string()
        .oneOf(["increase", "decrease"], "Invalid operation")
        .required("Operation is required"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  useEffect(() => {
    if (!show && !hasResetForm.current) {
      formik.resetForm();
      setErrMsg("");
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
            Update Stock {productName}
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          {errMsg && <AlertWithIcon errMsg={errMsg} color="failure" />}
          <div className="mt-5 px-6 grid gap-y-3">
            <input
              label="Product Stock"
              name="productStock"
              type="number"
              placeholder="Enter Stock Quantity"
              onChange={formik.handleChange}
              value={formik.values.productStock}
              errorMessage={formik.errors.productStock}
              min="1"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Operation
              </label>
              <select
                name="operation"
                onChange={formik.handleChange}
                value={formik.values.operation}
                className="mt-1 p-2 w-full border rounded"
              >
                <option value="increase">Increase</option>
                <option value="decrease">Decrease</option>
              </select>
              {formik.errors.operation && (
                <p className="text-red-500">{formik.errors.operation}</p>
              )}
            </div>
            <div className="flex flex-col justify-center items-center mt-3">
              <Button
                type="submit"
                buttonSize="medium"
                buttonText="Update"
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

export default UpdateStock;
