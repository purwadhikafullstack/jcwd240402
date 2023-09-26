import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";

import axios from "../../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../../utils/tokenSetterGetter";
import { profileUser } from "../../../features/userDataSlice";
import { addressUser } from "../../../features/userAddressSlice";
import addressEmpty from "../../../assets/images/addressEmpty.png";
import CardAddress from "../card/CardAddress";
import ModalAddAddress from "./ModalAddAddress";

const ModalSetPrimaryAddress = () => {
  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");

  const [newAccessToken, setNewAccessToken] = useState("");
  const [openModal, setOpenModal] = useState();

  const dispatch = useDispatch();

  const props = { openModal, setOpenModal };
  const addressData = useSelector((state) => state.addresser.value);

  useEffect(() => {
    if (!access_token && refresh_token) {
      axios
        .get("/user/auth/keep-login", {
          headers: { Authorization: `Bearer ${refresh_token}` },
        })
        .then((res) => {
          setNewAccessToken(res.data?.accessToken);
          setCookie("access_token", newAccessToken, 1);
        });
    }
  }, [access_token, newAccessToken, refresh_token]);

  useEffect(() => {
    axios
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => dispatch(profileUser(res.data?.result)));
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/profile/address", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(addressUser(res.data?.result));
      });
  }, [access_token, dispatch]);

  return (
    <>
      <button
        onClick={() => props.setOpenModal("form-elements")}
        className=" rounded-md w-full md:w-36  p-2 bg-blue3 text-white mt-2 font-semibold"
      >
        <span className="flex justify-center items-center gap-4">
          <p className="text-xs">Change Address</p>
        </span>
      </button>

      <Modal
        show={props.openModal === "form-elements"}
        size="3xl"
        popup
        onClose={() => {
          props.setOpenModal(undefined);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold  text-blue3 lg:rounded-xl">
              Set Primary Address
            </h1>
            <>
              {addressData.length === 0 ? (
                <div className="p-4 w-full flex flex-col justify-center items-center">
                  <div>
                    <img src={addressEmpty} alt="address empty" />
                  </div>
                  <div className="text-center text-xs ">
                    <h4>
                      Your address has not been registered yet. Please kindly
                      add your address by clicking the 'Add Address' button
                    </h4>
                  </div>
                </div>
              ) : (
                addressData.map((address) => (
                  <CardAddress
                    key={address.id}
                    address_title={address.address_title}
                    address_details={address.address_details}
                    city={address.City?.name}
                    idAddress={address.id}
                  />
                ))
              )}
            </>
            <ModalAddAddress />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalSetPrimaryAddress;
