import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillCartFill } from "react-icons/bs";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";

import SearchBar from "../../SearchBar";
import {
  getCookie,
  getLocalStorage,
  logout,
  setCookie,
} from "../../../utils/tokenSetterGetter";
import axios from "../../../api/axios";

const NavbarMobile = () => {
  const [newAccessToken, setNewAccessToken] = useState("");
  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");

  useEffect(() => {
    if (!access_token && refresh_token) {
      axios
        .get("/user/auth/keep-login", {
          headers: { Authorization: `Bearer ${refresh_token}` },
        })
        .then((res) => {
          setNewAccessToken(res.data?.accessToken);
          setCookie("access_token", newAccessToken, 1);
        });
    }
  }, [access_token, newAccessToken, refresh_token]);

  let Links = [
    { name: "HOME", to: "/" },
    { name: "PROFILE", to: "/user/setting" },
    { name: "CART", to: "/cart" },
    { name: "ORDER", to: "/order" },
  ];
  let [open, setOpen] = useState(false);
  return (
    <div className="sticky top-0 w-full z-10">
      <div className="lg:hidden  left-9 h-14 bg-white flex justify-between items-center ">
        <div className="w-full">
          <SearchBar
            width="w-52 md:w-[700px]"
            position="left-44 md:left-[670px]"
            rounded="rounded-md"
            height="h-7"
            margin="ml-2"
          />
        </div>
        <div className="flex w-24 justify-evenly gap-2 items-center">
          <button>
            <BsFillCartFill className="hover:text-blue3 text-base_grey transition-all" />
          </button>
          <button>
            <BiSolidPurchaseTag className="hover:text-blue3 text-base_grey transition-all" />
          </button>
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
                  className="text-gray-800 hover:text-blue-400 duration-500 "
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {access_token ? (
              <button className="bg-blue-600 text-white text-sm font-semibold px-2 py-1 rounded duration-500">
                <Link
                  to="/"
                  onClick={() => {
                    logout();
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
