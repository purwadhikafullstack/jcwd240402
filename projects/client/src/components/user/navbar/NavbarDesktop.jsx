import React, { useEffect, useState } from "react";
import { BsFillCartFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { RiBookmark3Fill } from "react-icons/ri";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "../../SearchBar";
import ModalLogin from "../modal/ModalLogin";
import ButtonLink from "../../ButtonLink";
import logo from "../../../assets/images/furniforNav.png";
import {
  getCookie,
  getLocalStorage,
  logout,
  setCookie,
} from "../../../utils/tokenSetterGetter";
import axios from "../../../api/axios";
import { cartsUser } from "../../../features/cartSlice";
import { UserAuth } from "../../../context/AuthContext";
import { wishlistUser } from "../../../features/wishlistDataSlice";
import emptyImage from "../../../assets/images/emptyImage.jpg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavbarDesktop = () => {
  const { logOutAuth } = UserAuth();

  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");

  const cartsData = useSelector((state) => state.carter.value);
  const userData = useSelector((state) => state.profiler.value);

  const [newAccessToken, setNewAccessToken] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();

  const wishlistData = useSelector((state) => state.wishlister.value);

  useEffect(() => {
    if (!access_token || refresh_token || userData.role_id !== 3) {
      return;
    }
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
  }, [access_token, dispatch, newAccessToken, refresh_token, userData.role_id]);

  useEffect(() => {
    if (!access_token || refresh_token || userData.role_id !== 3) {
      return;
    }
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
  }, [access_token, dispatch, refresh_token, userData.role_id]);

  const userNavigation = [
    { name: "Profile", to: "/user/setting", onClick: {} },
    { name: "Cart", to: "/cart", onClick: {} },
    { name: "Order", to: "/user/setting/order", onClick: {} },
    {
      name: "Sign out",
      to: "/log-in",
      onClick: () => {
        logOutAuth();
        logout();
      },
    },
  ];

  return (
    <div
      className={`hidden w-full lg:grid bg-white justify-center sticky z-40 top-0 ${
        location.pathname === "/register" ||
        location.pathname === "/log-in" ||
        location.pathname === "/sign-up" ||
        location.pathname === "/verify-page"
          ? "lg:hidden"
          : "lg:grid"
      }`}
    >
      <div className="flex w-[1200px] justify-evenly items-center h-16">
        <Link to="/" className="">
          <img src={logo} alt="logo" className=" h-10" />
        </Link>
        <div className="flex w-60 justify-around">
          <Link
            to="/product-category"
            className={`${
              location.pathname === "/product-category"
                ? "text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Categories
          </Link>
          <Link
            to="/all-products"
            className={`${
              location.pathname === "/all-products"
                ? "text-blue-500 font-semibold"
                : "text-gray-500"
            }`}
          >
            Products
          </Link>
        </div>
        <div className="w-96">
          <SearchBar
            width="w-full"
            rounded="rounded-xl"
            position="right-2"
            bgColor="bg-blue3"
            height="h-8"
          />
        </div>
        <div className="flex justify-between w-20 items-center cursor-pointer">
          {cartsData &&
          access_token &&
          refresh_token &&
          userData.role_id === 3 ? (
            <Link to="/cart" className="relative">
              <BsFillCartFill
                className={`w-7 h-7 text-base_grey hover:text-blue3 transition-all ${
                  location.pathname === "/cart"
                    ? "text-blue-500 font-semibold"
                    : "text-base_grey"
                }`}
              />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full px-1 text-white text-xs">
                {cartsData.length === 0 ? null : cartsData.length}
              </span>
            </Link>
          ) : (
            <Link to="/cart">
              <BsFillCartFill className="w-7 h-7 text-base_grey hover:text-blue3 transition-all" />
            </Link>
          )}

          {wishlistData &&
          access_token &&
          refresh_token &&
          userData.role_id === 3 ? (
            <Link to="/all-wishlist" className="relative">
              <RiBookmark3Fill
                className={`w-7 h-7 hover:text-blue3 text-base_grey transition-all ${
                  location.pathname === "/all-wishlist"
                    ? "text-blue-500 font-semibold"
                    : "text-base_grey"
                } `}
              />
              <span className="absolute top-0 right-0 bg-red-500 rounded-full px-1 text-white text-xs">
                {wishlistData.length === 0 ? null : wishlistData.length}
              </span>
            </Link>
          ) : (
            <Link to="/all-wishlist">
              <RiBookmark3Fill className="w-7 h-7 hover:text-blue3 text-base_grey transition-all" />
            </Link>
          )}
        </div>
        <div className="flex gap-4">
          {access_token && refresh_token && userData.role_id === 3 ? (
            <>
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={
                        userData.User_detail?.img_profile
                          ? `${process.env.REACT_APP_API_BASE_URL}${userData.User_detail?.img_profile}`
                          : emptyImage
                      }
                      alt="profile"
                    />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <Link
                            to={item.to}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                            onClick={item.onClick}
                          >
                            {item.name}
                          </Link>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </>
          ) : (
            <>
              <ModalLogin />
              <ButtonLink
                buttonSize="small"
                buttonText="Sign up"
                bgColor="bg-blue3"
                colorText="text-white"
                fontWeight="font-semibold"
                to="/sign-up"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavbarDesktop;
