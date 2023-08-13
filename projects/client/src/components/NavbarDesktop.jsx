import React from "react";
import { BsFillCartFill } from "react-icons/bs";
import { useLocation } from "react-router-dom";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";

import SearchBar from "./SearchBar";
import ModalLogin from "./ModalLogin";
import ButtonLink from "./ButtonLink";
import logo from "../assets/images/furniforNav.png";
import { getCookie } from "../utils";

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};

const userNavigation = [
  { name: "Your Profile", href: "#" },
  { name: "Settings", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const NavbarDesktop = () => {
  const location = useLocation();
  const access_token = getCookie("access_token");

  return (
    <div
      className={`hidden w-full lg:grid bg-white justify-center sticky z-10 top-0 ${
        location.pathname === "/register" ||
        location.pathname === "/log-in" ||
        location.pathname === "/sign-up" ||
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
          {access_token ? (
            // <div className="w-16 h-16">
            //   <img src="" alt="" className="object-cover" />
            // </div>
            <>
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.imageUrl}
                      alt=""
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
                          <a
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700"
                            )}
                          >
                            {item.name}
                          </a>
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
