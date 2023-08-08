import React from "react";
import logo from "../assets/images/image_example.jpg";
import SearchBar from "./SearchBar";
import Button from "./Button";

const NavbarDesktop = () => {
  return (
    <div className="hidden w-full  lg:grid justify-center fixed">
      <div className="flex w-[1200px] justify-evenly items-center">
        <div className="">
          <img src={logo} alt="" className="w-16" />
        </div>
        <div className="flex w-60 justify-around">
          <button>Category</button>
          <button>Inspiration</button>
        </div>
        <div className="w-96">
          <SearchBar />
        </div>
        <div className="flex justify-between w-20 items-center ">
          <button>
            <box-icon type="solid" name="cart"></box-icon>
          </button>
          <button>
            <box-icon type="solid" name="purchase-tag"></box-icon>
          </button>
        </div>
        <div className="flex gap-4">
          <Button
            buttonSize="small"
            buttonText="Log in"
            bgColor="bg-blue3"
            colorText="text-white"
            fontWeight="font-semibold"
          />
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
