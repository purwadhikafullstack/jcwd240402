import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CiMenuKebab } from "react-icons/ci";

import ModalChangeAddress from "../modal/ModalChangeAddress";
import ModalConfirmationDelete from "../modal/ModalConfirmationDelete";
import ModalConfirmationPrimaryAddress from "../modal/ModalConfirmationPrimaryAddress";
import { useLocation } from "react-router-dom";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../../utils/tokenSetterGetter";
import axios from "../../../api/axios";
import { addressUser } from "../../../features/userAddressSlice";
import useClickOutside from "../../../utils/useClickOutSide";

const CardAddress = ({ address_title, address_details, city, idAddress }) => {
  const dispatch = useDispatch();
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");

  const [openModal, setOpenModal] = useState();
  const [errMsg, setErrMsg] = useState("");

  const props = { openModal, setOpenModal };

  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const userData = useSelector((state) => state.profiler.value);

  const primaryAddress = userData.User_detail?.address_user_id;

  const deleteAddress = () => {
    try {
      axios
        .delete(`/user/profile/address/${idAddress}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          props.setOpenModal(undefined);
          axios
            .get("/user/profile/address", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => {
              dispatch(addressUser(res.data?.result));
            });
        })
        .catch((error) => {
          if (
            error.response?.data?.message === "Invalid token" &&
            error.response?.data?.error?.name === "TokenExpiredError"
          ) {
            axios
              .get("/user/auth/keep-login", {
                headers: { Authorization: `Bearer ${refresh_token}` },
              })
              .then((res) => {
                setNewAccessToken(res.data?.accessToken);
                setCookie("access_token", newAccessToken, 1);
              });
          }
        });
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error);
      }
    }
  };

  const clickClose = () => {
    setShowMenu(false);
  };

  return (
    <div className="w-full pb-4">
      <div
        className={`text-xs ${
          primaryAddress === idAddress ? "bg-blue5" : "border-2"
        } rounded-lg p-4 flex justify-between`}
      >
        <div>
          <h4 className="font-bold text-sm md:text-xl lg:text-base">
            {address_title}
          </h4>
          <h4>{city}</h4>
          <h4>{userData.username}</h4>
          <h4>{userData.User_detail?.phone}</h4>
          <h4>{address_details}</h4>
        </div>
        <div className="flex flex-col items-end w-52">
          <button onClick={() => setShowMenu(!showMenu)}>
            <CiMenuKebab className="text-xl" />
          </button>
          {showMenu ? (
            <div
              className={`${
                location.pathname === "/user/setting/address"
                  ? "absolute mt-5 z-10"
                  : "relative"
              } bg-white rounded-lg shadow-card-1  border-gray-200 z-20`}
            >
              <ul className="list-none">
                {location.pathname === "/user/setting/address" ? (
                  <li className="py-2 px-4 cursor-pointer hover:bg-gray-100 hover:rounded-lg">
                    <ModalChangeAddress idAddress={idAddress} />
                  </li>
                ) : null}
                <li className="py-2 px-4 cursor-pointer hover:bg-gray-100 hover:rounded-lg">
                  <ModalConfirmationPrimaryAddress idAddress={idAddress} />
                </li>
                {location.pathname === "/user/setting/address" ? (
                  <li className="py-2 px-4 cursor-pointer hover:bg-gray-100 hover:rounded-lg">
                    <ModalConfirmationDelete
                      handleDelete={deleteAddress}
                      errMsg={errMsg}
                      topic="address"
                      deleteFor="Delete Address"
                      styleConfirmButton="bg-red-500 px-3 py-1 rounded-md text-white font-semibold hover:bg-red-400"
                    />
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CardAddress;
