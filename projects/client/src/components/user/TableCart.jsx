import React, { useState } from "react";
import toRupiah from "@develoka/angka-rupiah-js";

import { CiMenuKebab } from "react-icons/ci";

import ModalConfirmationPrimaryAddress from "./modal/ModalConfirmationPrimaryAddress";

import { Badge } from "flowbite-react";
import SlideOverCart from "./slide/SlideOverCart";
import ModalConfirmationDeleteCart from "./modal/ModalConfirmationDeleteCart";

const TableCart = ({
  img,
  name,
  price,
  weight,
  subtotalPrice,
  quantity,
  setTotal,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <div className="col-span-2 md:col-span-3 lg:col-span-3 ">
        <div className="flex gap-2 h-full justify-center items-center md:justify-start lg:justify-start mt-2 md:mt-0 lg:mt-0">
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${img}`}
            alt=""
            className="w-16 h-16 md:w-36 md:h-36 lg:w-40 lg:h-40"
          />
          <div className="flex flex-col md:gap-1 lg:gap-1">
            <h1 className="text-xs md:text-base font-semibold flex items-center ">
              {name}
              <span className="ml-1">
                <Badge color="purple">{quantity}pcs</Badge>
              </span>
            </h1>
            <h1 className="text-xs font-bold">{toRupiah(price)}</h1>
            <h1 className="text-xs text-gray-400">weight: {weight}</h1>
            <h1 className="text-xs text-gray-400">
              Total weight: {weight * quantity} gr
            </h1>
          </div>
        </div>
      </div>
      <div className="hidden md:grid lg:grid md:col-span-1 lg:col-span-1 ">
        <div className=" md:flex lg:flex md:text-xs lg:text-xs md:gap-2 lg:gap-2 md:h-full lg:h-full justify-center items-center">
          <h1>{toRupiah(subtotalPrice)}</h1>
        </div>
      </div>
      <div className="col-span-2 md:col-span-1 lg:col-span-1 grid justify-center">
        <div className="flex justify-evenly items-center  w-20 text-xs h-full rounded-full ">
          <div className="flex flex-col items-end">
            <button onClick={() => setShowMenu(!showMenu)}>
              <CiMenuKebab className="text-xl" />
            </button>
            {showMenu ? (
              <div className="absolute mt-5 bg-white rounded-lg shadow-card-1 border-gray-200 z-20">
                <ul className="list-none">
                  <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                    <SlideOverCart name={name} quantity={quantity} />
                  </li>

                  <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
                    <ModalConfirmationDeleteCart
                      productName={name}
                      setTotal={setTotal}
                    />
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default TableCart;
