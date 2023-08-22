import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome, AiFillHome } from "react-icons/ai";
import { BiPurchaseTag, BiSolidPurchaseTag } from "react-icons/bi";
import { BsCart, BsCartFill } from "react-icons/bs";
import { FaRegUser, FaUser } from "react-icons/fa";

import { getCookie } from "../../../utils/tokenSetterGetter";

const NavigatorMobile = () => {
  const location = useLocation();
  const access_token = getCookie("access_token");

  return (
    <div className="sticky bottom-0 lg:hidden ">
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
            location.pathname === "/order" ? "text-yellow2" : "text-white"
          } col-span-1`}
        >
          {location.pathname === "/order" ? (
            <Link
              to={`${access_token ? "/order" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <BiSolidPurchaseTag />
              <h1 className="bg-inherit text-xs ">My Order</h1>
            </Link>
          ) : (
            <Link
              to={`${access_token ? "/order" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <BiPurchaseTag />
              <h1 className="bg-inherit text-xs ">My Order</h1>
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
          {location.pathname === "/user/setting" ? (
            <Link
              to={`${access_token ? "/user/setting" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <FaUser />
              <h1 className="bg-inherit text-xs ">My Profile</h1>
            </Link>
          ) : (
            <Link
              to={`${access_token ? "/user/setting" : "/redirect-login"}`}
              className="bg-inherit flex flex-col justify-center items-center"
            >
              <FaRegUser />
              <h1 className="bg-inherit text-xs ">My Profile</h1>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigatorMobile;
