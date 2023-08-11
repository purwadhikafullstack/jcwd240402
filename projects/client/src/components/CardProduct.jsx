import React from "react";
import { Badge } from "flowbite-react";
import { FaCartArrowDown } from "react-icons/fa";

const CardProduct = ({ src, category, name, desc, price }) => {
  return (
    <div>
      <div className="m-2 w-36 md:w-48 lg:w-60 h-fit shadow-card-1 rounded-lg">
        <div>
          <img src={src} alt="" className="w-36 md:w-48 lg:w-60 rounded-lg" />
        </div>
        <div className="text-left px-4 pb-4">
          <div>
            <Badge color="purple" className="w-fit">
              {category}
            </Badge>
          </div>
          <h2 className="font-bold text-xs lg:text-base text-justify">
            {name}
          </h2>
          <h4 className="text-xs lg:text-base">{desc}</h4>
          <p className="font-bold text-sm lg:text-base mt-2">
            <sup>Rp</sup>
            {price}
          </p>
          <div className="mt-2 flex justify-end">
            <button className="bg-blue3 flex justify-center items-center  w-10 h-10 rounded-full">
              <FaCartArrowDown className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
