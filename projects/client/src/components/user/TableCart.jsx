import React, { useState } from "react";
import toRupiah from "@develoka/angka-rupiah-js";

import { CiMenuKebab } from "react-icons/ci";

import { Badge } from "flowbite-react";
import SlideOverCart from "./slide/SlideOverCart";

import { useDispatch } from "react-redux";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import axios from "../../api/axios";
import { cartsUser } from "../../features/cartSlice";
import ModalConfirmationDelete from "./modal/ModalConfirmationDelete";
import { Link } from "react-router-dom";

const TableCart = ({
  img,
  name,
  price,
  weight,
  subtotalPrice,
  quantity,
  setTotal,
}) => {
  const dispatch = useDispatch();
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");

  const [openModal, setOpenModal] = useState();
  const [errMsg, setErrMsg] = useState("");

  const props = { openModal, setOpenModal };
  const [showMenu, setShowMenu] = useState(false);

  const deleteCart = () => {
    try {
      axios
        .delete(`/user/cart/${name}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          props.setOpenModal(undefined);
          axios
            .get("/user/cart", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => {
              dispatch(cartsUser(res.data?.result));
              setTotal(res.data?.total);
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

  return (
    <>
      <div className="col-span-2 md:col-span-3 lg:col-span-3 ">
        <Link
          to={`/product/${name}`}
          className="flex gap-2 h-full justify-center items-center md:justify-start lg:justify-start mt-2 md:mt-0 lg:mt-0"
        >
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${img}`}
            alt=""
            className="w-16 h-16 md:w-36 md:h-36 lg:w-40 lg:h-40"
          />
          <div className="flex flex-col md:gap-1 lg:gap-1">
            <h1 className="text-xs md:text-base font-semibold flex items-center ">
              {name}
              <span className="ml-1">
                <Badge color="purple">{quantity}pcs</Badge>
              </span>
            </h1>
            <h1 className="text-xs font-bold">{toRupiah(price)}</h1>
            <h1 className="text-xs text-gray-400">weight: {weight}</h1>
            <h1 className="text-xs text-gray-400">
              Total weight: {weight * quantity} gr
            </h1>
          </div>
        </Link>
      </div>
      <div className="flex justify-center items-center md:grid lg:grid md:col-span-1 lg:col-span-1 ">
        <div className="text-xs md:flex lg:flex md:text-xs lg:text-xs md:gap-2 lg:gap-2 md:h-full lg:h-full justify-center items-center">
          <h1>{toRupiah(subtotalPrice)}</h1>
        </div>
      </div>
      <div className="col-span-1 md:col-span-1 lg:col-span-1 grid justify-center">
        <div className="flex justify-evenly items-center  w-20 text-xs h-full rounded-full ">
          <div className="flex flex-col items-end">
            <button onClick={() => setShowMenu(!showMenu)}>
              <CiMenuKebab className="text-xl" />
            </button>
            {showMenu ? (
              <div className="absolute mt-5 bg-white rounded-lg shadow-card-1 border-gray-200 z-20">
                <ul className="list-none">
                  <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                    <SlideOverCart name={name} quantity={quantity} />
                  </li>

                  <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                    <ModalConfirmationDelete
                      handleDelete={deleteCart}
                      errMsg={errMsg}
                      topic="cart"
                    />
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default TableCart;
