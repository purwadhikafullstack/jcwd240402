import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { BsFillPlusSquareFill } from "react-icons/bs";

import AlertWithIcon from "../../AlertWithIcon";
import axios from "../../../api/axios";
import InputForm from "../../InputForm";
import { getCookie } from "../../../utils/tokenSetterGetter";
import { useDispatch } from "react-redux";
import Button from "../../Button";
import { addressUser } from "../../../features/userAddressSlice";

const ModalAddAddress = () => {
  const access_token = getCookie("access_token");

  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState();
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(0);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [dissabledButton, setDissabledButton] = useState(false);

  const props = { openModal, setOpenModal, email, setEmail };

  useEffect(() => {
    axios
      .get("/user/region-province")
      .then((res) => setProvinces(res.data?.result));
  }, []);

  useEffect(() => {
    axios
      .get(`/user/region-city?province_id=${selectedProvince}`)
      .then((res) => setCities(res.data?.result));
  }, [selectedProvince]);

  const addAddress = async (values, { setStatus, setValues }) => {
    values.city_id = Number(selectedCity);
    values.province_id = Number(selectedProvince);

    try {
      await axios
        .post("/user/profile/address", values, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          axios
            .get("/user/profile/address", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => {
              dispatch(addressUser(res.data?.result));
            });
          setStatus({
            success: true,
            message: "register address successful.",
          });

          setValues({
            address_details: "",
            postal_code: "",
            address_title: "",
            city_id: "",
            province_id: "",
          });
          setSuccessMsg(res.data.message);
          setErrMsg("");
          formik.resetForm();
          setSelectedCity(0);
          setSelectedProvince(0);
          setTimeout(() => {
            props.setOpenModal(undefined);
            setSuccessMsg("");
            setDissabledButton(false);
          }, 3000);
        })
        .catch((error) => {
          setDissabledButton(false);
          setSuccessMsg("");
          setErrMsg(error.response?.data?.message);
        });
    } catch (err) {
      setDissabledButton(false);
      setSuccessMsg("");
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.message);
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      address_details: "",
      postal_code: "",
      address_title: "",
    },
    onSubmit: addAddress,
    validationSchema: yup.object().shape({
      address_details: yup
        .string()
        .required("address detail is a required field"),
      postal_code: yup.string().required("postal code is a required field"),
      address_title: yup
        .string()
        .required("address detail is a required field"),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };

  const handleDissabled = () => {
    setDissabledButton(true);
    setTimeout(() => {
      setDissabledButton(false);
    }, 6000);
  };
  return (
    <>
      <button
        onClick={() => {
          props.setOpenModal("form-elements");
          formik.resetForm();
        }}
        className="h-10 rounded-lg w-fit px-3 bg-blue3 text-white font-semibold"
      >
        <span className="flex justify-center items-center gap-4">
          <BsFillPlusSquareFill />
          <p className="text-xs">Add Address</p>
        </span>
      </button>

      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => {
          props.setOpenModal(undefined);
          setErrMsg("");
          setSuccessMsg("");
          formik.resetForm();
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold  text-blue3 lg:rounded-xl">
              Register Address
            </h1>
            <form onSubmit={formik.handleSubmit} className="lg:rounded-xl">
              {errMsg ? (
                <AlertWithIcon errMsg={errMsg} />
              ) : successMsg ? (
                <AlertWithIcon errMsg={successMsg} color="success" />
              ) : null}

              {/* drop down province */}
              <div className="flex flex-col gap-y-2 mb-3">
                <label htmlFor="">province</label>
                <select
                  id="provinces"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-strong focus:focus:border-green-strong block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-strong dark:focus:focus:border-green-strong"
                  value={selectedProvince}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                  }}
                >
                  <option value={0}>select a province</option>
                  {provinces.map((province) => (
                    <option
                      key={province.id}
                      defaultValue="Choose a province"
                      value={province.id}
                    >
                      {province.name}
                    </option>
                  ))}
                </select>

                {/* drop down city */}
                <label htmlFor="">city</label>
                <select
                  id="cities"
                  className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-strong focus:focus:border-green-strong block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-strong dark:focus:focus:border-green-strong"
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                  }}
                >
                  <option value={0}>select a city</option>
                  {cities.map((city) => (
                    <option
                      key={city.id}
                      defaultValue="Choose a city"
                      value={city.id}
                    >
                      {city.name}
                    </option>
                  ))}
                </select>

                {/* form input */}
                <InputForm
                  width="w-full"
                  label="address details"
                  onChange={handleForm}
                  placeholder="address details"
                  name="address_details"
                  type="text"
                  value={formik.values.address_details}
                  isError={!!formik.errors.address_details}
                  errorMessage={formik.errors.address_details}
                />
                <div className="flex gap-4">
                  <InputForm
                    width="w-full"
                    label="postal code"
                    onChange={handleForm}
                    placeholder="postal code"
                    name="postal_code"
                    type="text"
                    value={formik.values.postal_code}
                    isError={!!formik.errors.postal_code}
                    errorMessage={formik.errors.postal_code}
                  />
                  <InputForm
                    width="w-full"
                    label="address title"
                    onChange={handleForm}
                    placeholder="address title"
                    name="address_title"
                    type="text"
                    value={formik.values.address_title}
                    isError={!!formik.errors.address_title}
                    errorMessage={formik.errors.address_title}
                  />
                </div>
              </div>

              <div className="w-full">
                <Button
                  onClick={() => {
                    formik.handleSubmit();
                    handleDissabled();
                  }}
                  buttonSize="small"
                  buttonText="submit"
                  type="submit"
                  bgColor={`${
                    dissabledButton
                      ? "bg-gray-500 hover:bg-gray-500"
                      : "bg-blue3"
                  }`}
                  colorText="text-white"
                  fontWeight="font-semibold"
                  disabled={dissabledButton}
                />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalAddAddress;
