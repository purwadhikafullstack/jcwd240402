import React, { useState } from "react";
import { useSelector } from "react-redux";
import { CiMenuKebab } from "react-icons/ci";

import ModalChangeAddress from "../modal/ModalChangeAddress";
import ModalConfirmationDelete from "../modal/ModalConfirmationDelete";
import ModalConfirmationPrimaryAddress from "../modal/ModalConfirmationPrimaryAddress";
import BurgerSettingAddress from "../BurgerSettingAddress";

const CardAddress = ({ address_title, address_details, city, idAddress }) => {
  const [showMenu, setShowMenu] = useState(false);

  const userData = useSelector((state) => state.profiler.value);

  const primaryAddress = userData.User_detail?.address_user_id;
  console.log(showMenu);
  return (
    <div className="w-full pb-4">
      <div
        className={`text-xs ${
          primaryAddress === idAddress ? "bg-blue5" : "border-2"
        } rounded-lg p-4 flex justify-between`}
      >
        <div>
          <h4 className="font-bold text-sm md:text-xl lg:text-base">
            {address_title}
          </h4>
          <h4>{city}</h4>
          <h4>{userData.username}</h4>
          <h4>{userData.User_detail?.phone}</h4>
          <h4>{address_details}</h4>
          <ModalChangeAddress id={idAddress} />
        </div>
        <div className="flex flex-col items-end">
          {/* <BurgerSettingAddress idAddress={idAddress} /> */}
          <button onClick={() => setShowMenu(!showMenu)}>
            <CiMenuKebab className="text-xl" />
          </button>
          {showMenu ? (
            <div className="absolute mt-5 bg-white rounded-lg shadow-card-1 border-gray-200 z-20">
              <ul className="list-none">
                <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                  <ModalChangeAddress />
                </li>
                <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                  <ModalConfirmationPrimaryAddress />
                </li>
                <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                  <ModalConfirmationDelete />
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CardAddress;
