import React from "react";
import { Badge } from "flowbite-react";
import { Link } from "react-router-dom";
import SlideOverProduct from "./SlideOverProduct";

const CardProduct = ({ src, category, name, desc, price, id }) => {
  return (
    <div className="bg-white flex flex-col justify-center items-center  ">
      <div className="w-36 md:w-52 md:h-60  lg:h-80 h-64 flex flex-col items-center shadow-card-1 rounded-lg m-3">
        <Link
          to={`/product/${id}`}
          className="w-full  h-20 lg:h-40 overflow-hidden rounded-e-lg"
        >
          <img
            src={src}
            alt=""
            className="w-full h-full object-center object-cover"
          />
        </Link>
        <div className=" w-full border-2  h-28 flex flex-col justify-end p-4 mt-10">
          <div>
            <Badge color="purple" className="w-fit">
              test
            </Badge>
          </div>
          <h2 className="text-xs lg:text-base font-bold">{name}</h2>
          {desc?.length > 25 ? (
            <h4 className="text-xs text-ellipsis">{desc?.slice(0, 25)}...</h4>
          ) : (
            <h4 className="text-xs text-ellipsis">{desc}</h4>
          )}
          <p className="text-xs lg:text-xl font-semibold">
            <sup>Rp</sup>
            {price}
          </p>
          <div className="flex justify-end ">
            <SlideOverProduct id={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardProduct;
