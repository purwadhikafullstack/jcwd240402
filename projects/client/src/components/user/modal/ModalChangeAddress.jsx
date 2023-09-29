import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";

import AlertWithIcon from "../../AlertWithIcon";
import axios from "../../../api/axios";
import InputForm from "../../InputForm";
import { getCookie } from "../../../utils/tokenSetterGetter";
import Button from "../../Button";
import { addressUser } from "../../../features/userAddressSlice";

const ModalChangeAddress = ({ idAddress }) => {
  const dispatch = useDispatch();

  const access_token = getCookie("access_token");

  const [openModal, setOpenModal] = useState();
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(0);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(0);
  const [initialFormValues, setInitialFormValues] = useState({
    address_details: "",
    postal_code: "",
    address_title: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [dissabledButton, setDissabledButton] = useState(false);

  const props = { openModal, setOpenModal, email, setEmail };

  useEffect(() => {
    axios
      .get("/user/region-province")
      .then((res) => setProvinces(res.data?.result));
  }, []);

  useEffect(() => {
    if (idAddress) {
      axios
        .get(`/user/profile/address/${idAddress}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setSelectedCity(res.data?.result?.city_id);
          setSelectedProvince(res.data?.result?.city_id);

          const addressData = res.data?.result;

          const InitialFormValues = {
            address_details: addressData.address_details,
            postal_code: addressData.postal_code,
            address_title: addressData.address_title,
            city_id: addressData.city_id.toString(),
            province_id: addressData.province_id.toString(),
          };
          formik.setValues(InitialFormValues);
          setInitialFormValues(InitialFormValues);
        });
    }
  }, [access_token, idAddress]);

  useEffect(() => {
    axios
      .get(`/user/region-city?province_id=${selectedProvince}`)
      .then((res) => setCities(res.data?.result));
  }, [selectedProvince]);

  const addAddress = async (values, { setStatus, setValues }) => {
    const formData = new FormData();
    values.city_id = Number(selectedCity);
    values.province_id = Number(selectedProvince);
    formData.append("address_details", values.address_details);
    formData.append("postal_code", values.postal_code);
    formData.append("address_title", values.address_title);

    try {
      await axios
        .patch(`/user/profile/address/${idAddress}`, formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setStatus({
            success: true,
            message: "update address successful.",
          });

          setValues({
            address_details: "",
            postal_code: "",
            address_title: "",
            city_id: "",
            province_id: "",
          });
          axios
            .get("/user/profile/address", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => {
              dispatch(addressUser(res.data?.result));
            });
          setErrMsg("");
          setSuccessMsg(res.data.message);
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
    initialValues: initialFormValues,
    onSubmit: addAddress,
    validationSchema: yup.object().shape({
      address_details: yup.string().optional(),
      postal_code: yup.string().optional(),
      address_title: yup.string().optional(),
      city_id: yup.string().optional(),
      province_id: yup.string().optional(),
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
      <button onClick={() => props.setOpenModal("form-elements")}>
        <p className="">Change Address</p>
      </button>

      <Modal
        show={props.openModal === "form-elements"}
        size="md"
        popup
        onClose={() => {
          props.setOpenModal(undefined);
          setErrMsg(false);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold  text-blue3 lg:rounded-xl">
              Change Address
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

                    formik.setFieldValue(
                      "province_id",
                      e.target.value.toString()
                    );
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

                    formik.setFieldValue("city_id", e.target.value.toString());
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

export default ModalChangeAddress;
