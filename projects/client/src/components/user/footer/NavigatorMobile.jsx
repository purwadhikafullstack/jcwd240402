import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BsCart, BsCartFill } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { RiBookmark3Fill, RiBookmark3Line } from "react-icons/ri";

import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../../utils/tokenSetterGetter";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../../api/axios";
import { profileUser } from "../../../features/userDataSlice";
import emptyImage from "../../../assets/images/emptyImage.jpg";

const NavigatorMobile = () => {
  const location = useLocation();
  const access_token = getCookie("access_token");

  const refresh_token = getLocalStorage("refresh_token");

  const userData = useSelector((state) => state.profiler.value);

  const [newAccessToken, setNewAccessToken] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token && refresh_token) {
      axios
        .get("/user/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => dispatch(profileUser(res.data.result)))
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
  }, [access_token, dispatch, newAccessToken, refresh_token]);

  return (
    <div className="sticky bottom-0 z-20 lg:hidden ">
      <div className="bg-blue4 w-full h-12 grid grid-cols-4 justify-center items-center">
        {/* HOME */}
        <div
          className={`bg-inherit ${
            location.pathname === "/" ? "text-yellow2" : "text-white"
          } col-span-1`}
        >
          {location.pathname === "/" ? (
            <Link
              to="/"
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <AiFillHome />
              <h1 className="bg-inherit text-xs ">Home</h1>
            </Link>
          ) : (
            <Link
              to="/"
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <AiOutlineHome />
              <h1 className="bg-inherit text-xs ">Home</h1>
            </Link>
          )}
        </div>
        {/* CART */}
        <div
          className={`bg-inherit ${
            location.pathname === "/cart" ? "text-yellow2" : "text-white"
          } col-span-1`}
        >
          {location.pathname === "/cart" ? (
            <Link
              to={`${access_token ? "/cart" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <BsCartFill />
              <h1 className="bg-inherit text-xs ">My Cart</h1>
            </Link>
          ) : (
            <Link
              to={`${access_token ? "/cart" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <BsCart />
              <h1 className="bg-inherit text-xs ">My Cart</h1>
            </Link>
          )}
        </div>
        {/* ORDER */}
        <div
          className={`bg-inherit ${
            location.pathname === "/all-wishlist"
              ? "text-yellow2"
              : "text-white"
          } col-span-1`}
        >
          {location.pathname === "/all-wishlist" ? (
            <Link
              to={`${access_token ? "/all-wishlist" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <RiBookmark3Fill />
              <h1 className="bg-inherit text-xs ">My Wishlist</h1>
            </Link>
          ) : (
            <Link
              to={`${access_token ? "/all-wishlist" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <RiBookmark3Line />
              <h1 className="bg-inherit text-xs ">My Wishlist</h1>
            </Link>
          )}
        </div>
        {/* PROFILE */}

        <div
          className={`bg-inherit ${
            location.pathname === "/user/setting"
              ? "text-yellow2"
              : "text-white"
          } col-span-1`}
        >
          <Link
            to={`${access_token ? "/user/setting" : "/redirect-login"}`}
            className="bg-inherit flex flex-col justify-center items-center"
          >
            {access_token && refresh_token && userData.role_id === 3 ? (
              <div className="relative w-8 h-8  flex flex-col max-w-xs items-center rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <img
                  className="w-full h-full object-cover rounded-full "
                  src={
                    userData.User_detail?.img_profile
                      ? `${process.env.REACT_APP_API_BASE_URL}${userData.User_detail?.img_profile}`
                      : emptyImage
                  }
                  alt="profile"
                />
              </div>
            ) : (
              <>
                <FaRegUser />
                <h1 className="bg-inherit text-xs ">My Profile</h1>
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigatorMobile;
