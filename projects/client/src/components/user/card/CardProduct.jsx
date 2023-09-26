import React from "react";
import { Badge } from "flowbite-react";
import { Link } from "react-router-dom";
import { rupiahFormat } from "../../../utils/formatter";

import SlideOverProduct from "../slide/SlideOverProduct";

const CardProduct = ({ src, category, name, desc, price, id }) => {
  return (
    <div className="bg-white flex flex-col justify-center items-center  ">
      <div className="w-36 md:w-52 h-full  flex flex-col items-center hover:shadow-card-1 transition-all ease-out duration-400 rounded-lg m-3">
        <Link
          to={`/product/${name}`}
          className="w-full h-36 md:h-52 lg:h-40 overflow-hidden rounded-t-lg"
        >
          <img
            src={src}
            alt="product"
            className="w-full h-full object-center object-cover"
          />
        </Link>
        <div className=" w-full h-28 flex flex-col justify-end  p-4 mt-10">
          <div>
            <Badge color="purple" className="w-fit">
              {category}
            </Badge>
          </div>
          <h2 className="text-xs md:text-base lg:text-base font-bold">
            {name}
          </h2>
          {desc?.length > 20 ? (
            <h4 className="text-xs text-ellipsis text-gray-400">
              {desc?.slice(0, 20)}...
            </h4>
          ) : (
            <h4 className="text-xs text-ellipsis text-gray-400">{desc}</h4>
          )}
          <p className="text-xs md:text-xl lg:text-xl font-semibold mt-2">
            {rupiahFormat(price)}
          </p>
          <div className="flex justify-end ">
            <SlideOverProduct name={name} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
