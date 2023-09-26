import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavigatorSetting = () => {
  const location = useLocation();

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
            location.pathname === "/user/setting/order"
              ? " text-blue2 underline underline-offset-8 decoration-4"
              : " text-gray-600"
          } font-semibold`}
          to="/user/setting/order"
        >
          <h2>Order</h2>
        </Link>
      </div>
    </>
  );
};

export default NavigatorSetting;
