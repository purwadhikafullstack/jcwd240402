import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Modal } from "flowbite-react";
import InputForm from "../../InputForm";
import Button from "../../Button";
import AsyncSelect from "react-select/async";
import { loadCities } from "../../../utils/WarehouseListHelp";

const WarehouseProfileModal = ({
  show,
  onClose,
  onSubmit,
  label,
  name,
  placeholder,
  initialValue = null,
  validationSchema = null,
  refreshWarehouseList,
}) => {
  const [errMsg, setErrMsg] = React.useState("");
  const [selectedCity, setSelectedCity] = React.useState(initialValue);

  const getValidationSchema = (label) => {
    switch (label) {
      case "Warehouse Name":
        return yup.object().shape({
          [name]: yup
            .string()
            .required(`${label} is required`)
            .min(8, `${label} must be at least 8 characters`),
        });
      default:
        return yup.object().shape({
          [name]: yup.string().required(`${label} is required`),
        });
    } 
  };

  const formik = useFormik({
    initialValues: {
      [name]: selectedCity?.value || "",
    },
    onSubmit: async (values) => {
      try {
        await onSubmit(values[name]);
        setErrMsg("");
        formik.resetForm();
        refreshWarehouseList();
        onClose();
      } catch (error) {
        setErrMsg(error.message || "Edit failed");
      }
    },
    validationSchema: validationSchema || getValidationSchema(label),
  });

  return (
    <Modal show={show} size="md" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Edit {label}
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          {errMsg && (
            <div className="bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2">
              <p>{errMsg}</p>
            </div>
          )}
          <div className="mt-5 px-6 grid gap-y-3">
            {label === "City" ? (
              <>
                <label>{label}</label>
                <AsyncSelect
                  classNamePrefix="react-select"
                  loadOptions={loadCities}
                  value={selectedCity}
                  onChange={(selectedOption) => {
                    setSelectedCity(selectedOption);
                    formik.setFieldValue(name, selectedOption?.value || "");
                  }}
                  placeholder="Select City"
                />
              </>
            ) : (
              <InputForm
                label={label}
                name={name}
                type="text"
                placeholder={placeholder}
                onChange={formik.handleChange}
                value={formik.values[name]}
                isError={!!formik.errors[name]}
                errorMessage={formik.errors[name]}
              />
            )}
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

export default WarehouseProfileModal ;
