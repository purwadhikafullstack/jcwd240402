import React from "react";
import logo from "../assets/images/image_example.jpg";
import SearchBar from "./SearchBar";
import Button from "./Button";
import { BsFillCartFill } from "react-icons/bs";
import { BiSolidPurchaseTag } from "react-icons/bi";
import ModalLogin from "./ModalLogin";
import { useLocation, useParams } from "react-router-dom";

const NavbarDesktop = () => {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div
      className={`hidden w-full lg:grid bg-white justify-center sticky z-10 top-0 ${
        location.pathname === "/register" ||
        location.pathname === "/login" ||
        location.pathname === "/verify-page"
          ? "lg:hidden"
          : "lg:grid"
      }`}
    >
      <div className="flex w-[1200px] justify-evenly items-center">
        <div className="">
          <img src={logo} alt="" className="w-16" />
        </div>
        <div className="flex w-60 justify-around">
          <button>Category</button>
          <button>Inspiration</button>
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
          <BsFillCartFill className="w-7 h-7 text-base_grey hover:text-blue3 transition-all" />
          <button>
            <BiSolidPurchaseTag className="w-7 h-7 text-base_grey hover:text-blue3 transition-all" />
          </button>
        </div>
        <div className="flex gap-4">
          <ModalLogin />
          <Button
            buttonSize="small"
            buttonText="Sign up"
            bgColor="bg-blue3"
            colorText="text-white"
            fontWeight="font-semibold"
          />
        </div>
      </div>
    </div>
  );
};

export default NavbarDesktop;
