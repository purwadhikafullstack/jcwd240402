import React, { useState } from "react";
import toRupiah from "@develoka/angka-rupiah-js";

const TableCart = ({ img, name, price, weight, setValueCount }) => {
  const [count, setCount] = useState(1);

  return (
    <>
      <div className="col-span-2 md:col-span-3 lg:col-span-3">
        <div className="flex gap-2 h-full justify-center items-center md:justify-start lg:justify-start mt-2 md:mt-0 lg:mt-0">
          <img
            src={img}
            alt=""
            className="w-16 h-16 md:w-36 md:h-36 lg:w-40 lg:h-40"
          />
          <div className="flex flex-col md:gap-1 lg:gap-1">
            <h1 className="text-xs md:text-base font-semibold">{name}</h1>
            <h1 className="text-xs font-bold">{toRupiah(price)}</h1>
            <h1 className="text-xs text-gray-400">weight: {weight}</h1>
            <h1 className="text-xs text-gray-400">
              Total weight: {weight * count} gr
            </h1>
          </div>
        </div>
      </div>
      <div className="col-span-2 md:col-span-1 lg:col-span-1 grid justify-center">
        <div className="flex justify-evenly items-center w-20 text-xs h-full rounded-full">
          <button
            onClick={() => (count <= 0 ? 0 : setCount(count - 1))}
            className=""
          >
            -
          </button>
          <p>{count}</p>
          <button onClick={() => setCount(count + 1)} className="">
            +
          </button>
        </div>
      </div>
      <div className="hidden md:grid lg:grid md:col-span-1 lg:col-span-1 ">
        <div className=" md:flex lg:flex md:text-xs lg:text-xs md:gap-2 lg:gap-2 md:h-full lg:h-full justify-center items-center">
          <h1>{toRupiah(price * count)}</h1>
        </div>
      </div>
    </>
  );
};

export default TableCart;
