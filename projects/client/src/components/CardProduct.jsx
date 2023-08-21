import React from "react";
import { Badge } from "flowbite-react";
import { FaCartArrowDown } from "react-icons/fa";
import BadgeTag from "./BadgeTag";
import { Link } from "react-router-dom";

const CardProduct = ({ src, category, name, desc, price, id }) => {
  return (
    <div className="bg-white flex flex-col justify-center items-center  ">
      <div className="w-36 md:w-52 md:h-60  lg:h-80 flex flex-col items-center shadow-card-1 rounded-lg p-4 m-3">
        <div className="w-20 lg:w-40 h-20 lg:h-40 overflow-hidden">
          <img
            src={src}
            alt=""
            className="w-full h-full object-center object-cover"
          />
        </div>
        <div className=" w-full h-auto">
          <div>
            <Badge color="purple" className="w-fit">
              test
            </Badge>
          </div>
          <h2 className="text-xs font-bold">{name}</h2>
          <h4 className="text-xs">{desc}</h4>
          <p className="text-xs font-semibold">
            <sup>Rp</sup>
            {price}
          </p>
          <Link to={`/product/${id}`} className="flex justify-end">
            <button className="bg-blue3 flex justify-center items-center  w-7 h-7 rounded-full">
              <FaCartArrowDown className="text-white" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
