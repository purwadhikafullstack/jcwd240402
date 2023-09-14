import React from "react";
import { Badge } from "flowbite-react";
import SlideOverProduct from "../slide/SlideOverProduct";
import Wishlist from "../Wishlist";
import ShareButton from "../ShareButton";

const CardWishlist = ({ item }) => {
  return (
    <div className="shadow-card-1 rounded-md grid  md:grid lg:grid md:grid-cols-12 lg:grid-cols-12 md:justify-between lg:justify-between">
      <div className="md:grid lg:grid md:grid-cols-5 lg:grid-cols-5 md:col-span-11 lg:col-span-11 border-2">
        <div className="flex justify-center md:col-span-1 lg:col-span-1 md:grid lg:grid md:justify-center lg:justify-center md:items-center lg:items-center">
          <img
            src={`${process.env.REACT_APP_API_BASE_URL}${item?.src}`}
            alt=""
            className="w-40 object-cover"
          />
        </div>
        <div className="p-4 md:col-span-4 lg:col-span-4 text-xs text-grayText">
          <p className="font-bold text-black">{item.name}</p>
          <Badge color="purple" className="w-fit">
            {item.category}
          </Badge>
          <p>{item.desc}</p>
          <p className="text-base font-bold">Rp.{item.price}</p>
          <p>stock: {item.stock} pcs</p>
          <p>weight: {item.weight} gr</p>
          <div className="flex justify-end text-base md:hidden lg:hidden">
            <SlideOverProduct name={item.name} />
          </div>
        </div>
      </div>
      <div className="hidden md:flex lg:flex md:justify-center md:items-center lg:justify-center lg:items-center md:col-span-1 lg:col-span-1 border-2">
        <SlideOverProduct name={item.name} />
      </div>
    </div>
  );
};

export default CardWishlist;
