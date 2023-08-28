import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const NavigatorSetting = () => {
  const location = useLocation();
  const userData = useSelector((state) => state.profiler.value);

  return (
    <>
      <div className="text-xs md:text-sm lg:text-base flex justify-around border-b-2 border-gray-300 p-2 ">
        <Link
          to="/user/setting"
          className={`${
            location.pathname === "/user/setting"
              ? " text-blue2 underline underline-offset-8 decoration-4 "
              : " text-gray-600 "
          } font-semibold `}
        >
          <h2>Personal Data</h2>
        </Link>
        <Link
          to="/user/setting/address"
          className={`${
            location.pathname === "/user/setting/address"
              ? " text-blue2 underline underline-offset-8 decoration-4"
              : " text-gray-600"
          } font-semibold`}
        >
          <h2>Address List</h2>
        </Link>
        <Link
          className={`${
            location.pathname === "/user/cart"
              ? " text-blue2 underline underline-offset-8 decoration-4"
              : " text-gray-600"
          } font-semibold`}
        >
          <h2>Cart</h2>
        </Link>
        <Link
          className={`${
            location.pathname === "/user/order"
              ? " text-blue2 underline underline-offset-8 decoration-4"
              : " text-gray-600"
          } font-semibold`}
        >
          <h2>Order</h2>
        </Link>
      </div>
    </>
  );
};

export default NavigatorSetting;
