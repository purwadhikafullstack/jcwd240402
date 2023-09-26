import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiBookmark3Fill, RiBookmark3Line } from "react-icons/ri";

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
import logo from "../../../assets/images/furnifor.png";
import { UserAuth } from "../../../context/AuthContext";
import { wishlistUser } from "../../../features/wishlistDataSlice";

const NavbarMobile = () => {
  const location = useLocation();
  const cartsData = useSelector((state) => state.carter.value);
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  let [open, setOpen] = useState(false);
  const userData = useSelector((state) => state.profiler.value);
  const [errMsg, setErrMsg] = useState("");

  const wishlistData = useSelector((state) => state.wishlister.value);

  const dispatch = useDispatch();
  const { logOutAuth } = UserAuth();
  useEffect(() => {
    if (access_token && refresh_token && userData.role_id === 3) {
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
    }
  }, [access_token, dispatch, newAccessToken, refresh_token, userData.role_id]);

  useEffect(() => {
    if (access_token && refresh_token && userData.role_id) {
      axios
        .get("/user/wishlist", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          dispatch(wishlistUser(res.data?.result));
        })
        .catch((error) => {
          setErrMsg(error.response?.data?.message);
        });
    }
  }, [access_token, dispatch, refresh_token, userData.role_id]);

  let Links = [
    { name: "HOME", to: "/" },
    { name: "CATEGORIES", to: "/product-category" },
    { name: "PRODUCTS", to: "/all-products" },
  ];

  const handleLogOut = () => {
    logOutAuth();
    logout();
  };
  return (
    <div className="sticky top-0 w-full z-40">
      <div className="lg:hidden  left-9 h-14 bg-white flex justify-between items-center ">
        <Link to="/" className="ml-4 w-12">
          <img src={logo} alt="logo" className="w-full " />
        </Link>
        <div className="w-full">
          <SearchBar
            width="w-52 md:w-[600px]"
            position="left-44 md:left-[670px]"
            rounded="rounded-md"
            height="h-7"
            margin="ml-2"
          />
        </div>
        <div className="flex w-24 justify-evenly gap-2 items-center">
          {cartsData && access_token && refresh_token ? (
            <Link to="/cart" className="relative">
              <BsFillCartFill
                className={`w-6 h-6 hover:text-blue3 text-base_grey transition-all ${
                  location.pathname === "/cart"
                    ? "text-blue-500 font-semibold"
                    : "text-gray-500"
                }`}
              />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full px-1 text-white text-xs">
                {cartsData.length === 0 ? null : cartsData.length}
              </span>
            </Link>
          ) : (
            <Link to="/cart">
              <BsFillCartFill className="w-6 h-6 hover:text-blue3 text-base_grey transition-all" />
            </Link>
          )}

          {wishlistData && access_token && refresh_token ? (
            <Link to="/all-wishlist" className="relative">
              <RiBookmark3Fill
                className={`w-6 h-6 hover:text-blue3 text-base_grey transition-all ${
                  location.pathname === "/all-wishlist"
                    ? "text-blue-500 font-semibold"
                    : "text-gray-500"
                }`}
              />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full px-1 text-white text-xs">
                {wishlistData.length === 0 ? null : wishlistData.length}
              </span>
            </Link>
          ) : (
            <Link to="/all-wishlist">
              <RiBookmark3Fill className="w-6 h-6 hover:text-blue3 text-base_grey transition-all" />
            </Link>
          )}
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
                  className={`text-gray-800 hover:text-blue-400 duration-500 ${
                    location.pathname === link.to
                      ? "text-blue-500 font-semibold"
                      : "text-gray-500"
                  }`}
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
                    handleLogOut();
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
