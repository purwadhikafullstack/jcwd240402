import React from "react";
import { CiMenuKebab } from "react-icons/ci";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import ModalConfirmationPrimaryAddress from "./modal/ModalConfirmationPrimaryAddress";
import ModalConfirmationDelete from "./modal/ModalConfirmationDeleteAddress";

const BurgerSettingAddress = ({ idAddress }) => {
  return (
    <div>
      <Menu as="div" className="relative">
        <Menu.Button className="relative flex max-w-xs items-center rounded-full  text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
          <CiMenuKebab className="text-2xl" />
        </Menu.Button>

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
            <div className="flex flex-col justify-start gap-3 p-2">
              <Menu.Item>
                <ModalConfirmationPrimaryAddress idAddress={idAddress} />
              </Menu.Item>
              <Menu.Item>
                <ModalConfirmationDelete idAddress={idAddress} />
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default BurgerSettingAddress;
