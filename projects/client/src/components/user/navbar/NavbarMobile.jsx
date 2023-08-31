import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";

import SearchBar from "../../SearchBar";
import {
  getCookie,
  getLocalStorage,
  logout,
  setCookie,
} from "../../../utils/tokenSetterGetter";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../api/axios";
import { cartsUser } from "../../../features/cartSlice";

const NavbarMobile = () => {
  const cartsData = useSelector((state) => state.carter.value);
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const userData = useSelector((state) => state.profiler.value);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("/user/cart", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(cartsUser(res.data?.result));
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
  }, [access_token, dispatch, newAccessToken, refresh_token]);

  let Links = [
    { name: "HOME", to: "/" },
    { name: "PROFILE", to: "/user/setting" },
    { name: "CART", to: "/cart" },
    { name: "ORDER", to: "/checkout" },
  ];
  let [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 w-full z-20">
      <div className="lg:hidden  left-9 h-14 bg-white flex justify-between items-center ">
        <div className="w-full">
          <SearchBar
            width="w-52 md:w-[700px]"
            position="left-44 md:left-[670px]"
            rounded="rounded-md"
            height="h-7"
            margin="ml-2"
          />
        </div>
        <div className="flex w-24 justify-evenly gap-2 items-center">
          {cartsData ? (
            <Link to="/cart" className="relative">
              <BsFillCartFill className="w-6 h-6 hover:text-blue3 text-base_grey transition-all" />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full px-1 text-white text-xs">
                {cartsData.length === 0 ? null : cartsData.length}
              </span>
            </Link>
          ) : (
            <Link to="/cart">
              <BsFillCartFill className="hover:text-blue3 text-base_grey transition-all" />
            </Link>
          )}
          <button>
            <BiSolidPurchaseTag className="w-6 h-6 hover:text-blue3 text-base_grey transition-all" />
          </button>
        </div>
        <div className="mr-2 mt-1">
          <button onClick={() => setOpen(!open)} className="cursor-pointer ">
            {open ? <CgClose /> : <GiHamburgerMenu />}
          </button>
          <ul
            className={`pl-8 pb-7 absolute bg-white z-[-1] left-0 w-full transition-all duration-500 ease-in shadow-lg rounded-xl ${
              open ? "top-10" : "top-[-490px]"
            }`}
          >
            {Links.map((link, idx) => (
              <li className="my-4 font-semibold text-sm" key={idx}>
                <Link
                  to={link.to}
                  className="text-gray-800 hover:text-blue-400 duration-500 "
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {access_token && userData.role_id === 3 ? (
              <button className="bg-blue-600 text-white text-sm font-semibold px-2 py-1 rounded duration-500">
                <Link
                  to="/"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                >
                  log out
                </Link>
              </button>
            ) : (
              <div className="flex gap-x-4">
                <button className="bg-blue-600 text-white text-sm font-semibold px-2 py-1 rounded duration-500">
                  <Link to="/sign-up">sign up</Link>
                </button>
                <button className="bg-blue-600 text-white text-sm font-semibold px-2 py-1 rounded duration-500">
                  <Link to="/log-in">log in</Link>
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobile;
