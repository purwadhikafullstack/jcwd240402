import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import { BiPurchaseTag } from "react-icons/bi";
import { BsCart } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";

const NavigatorMobile = () => {
  const location = useLocation();

  return (
    <div className="block bottom-0 sticky bottom-0 lg:hidden ">
      <div className="bg-blue4 w-screen h-12 grid grid-cols-4 justify-center items-center">
        <div
          className={`bg-inherit ${
            location.pathname === "/homepage" ? "text-yellow-500" : "text-white"
          } col-span-1`}
        >
          <Link
            to="/homepage"
            className="bg-inherit flex flex-col justify-center items-center"
          >
            <AiOutlineHome />
            <h1 className="bg-inherit text-xs ">Home</h1>
          </Link>
        </div>
        <div
          className={`bg-inherit ${
            location.pathname === "/category" ? "text-yellow-500" : "text-white"
          } col-span-1`}
        >
          <Link
            to="/category"
            className="bg-inherit flex flex-col justify-center items-center"
          >
            <BsCart />
            <h1 className="bg-inherit text-xs ">My Cart</h1>
          </Link>
        </div>
        <div
          className={`bg-inherit ${
            location.pathname === "/cart" ? "text-yellow-500" : "text-white"
          } col-span-1`}
        >
          <Link
            to="/cart"
            className="bg-inherit flex flex-col justify-center items-center"
          >
            <BiPurchaseTag />
            <h1 className="bg-inherit text-xs ">My Order</h1>
          </Link>
        </div>
        <div
          className={`bg-inherit ${
            location.pathname === "/profile" ||
            location.pathname === "/profile/my-transaction" ||
            location.pathname === "/profile/store-transaction" ||
            location.pathname === "/profile/sell-product" ||
            location.pathname === "/profile/my-store" ||
            location.pathname === "/profile/my-store/edit-category" ||
            location.pathname === "/profile/my-store/edit-product"
              ? "text-yellow-500"
              : "text-white"
          } col-span-1`}
        >
          <Link
            to="/profile/my-transaction"
            className="bg-inherit flex flex-col justify-center items-center"
          >
            <CgProfile />
            <h1 className="bg-inherit text-xs ">Profile</h1>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigatorMobile;
