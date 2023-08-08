import React from "react";
import logo from "../assets/images/image_example.jpg";

const NavbarDesktop = () => {
  return (
    <div>
      <div className="flex border-2 w-full justify-evenly items-center">
        <div className="">
          <img src={logo} alt="" className="w-14" />
        </div>
        <div className="flex w-60 border-2 justify-between">
          <h1>Category</h1>
          <h1>Inspiration</h1>
        </div>
        <div className="border-2">
          <input type="text" />
          <button>
            <box-icon name="search-alt"></box-icon>
          </button>
        </div>
        <div>
          <box-icon type="solid" name="cart"></box-icon>
          <box-icon type="solid" name="bell"></box-icon>
          <button>Log in</button>
          <button>Sign up</button>
        </div>
      </div>
    </div>
  );
};

export default NavbarDesktop;
