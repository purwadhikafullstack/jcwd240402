import React from "react";
import dayjs from "dayjs";
import { Badge } from "flowbite-react";

import { rupiahFormat } from "../../../utils/formatter";
import { weightFormat } from "../../../utils/formatter";
import emptyImage from "../../../assets/images/emptyImage.jpg";

const CardWishlist = ({ item }) => {
  return (
    <div className="my-5">
      <div className="px-4 py-1 rounded-t-md w-fit shadow-card-1">
        <h1 className="text-sm font-semibold">
          {dayjs(item.date).format("D MMMM YYYY")}
        </h1>
      </div>
      <div className="shadow-card-1 rounded-b-md rounded-r-md  md:justify-between lg:justify-between hover:bg-gray-200 transition-all duration-200">
        <div className="md:grid lg:grid md:grid-cols-4 lg:grid-cols-4  ">
          <div className="flex p-2 justify-center md:justify-center lg:justify-center md:items-center lg:items-center">
            <img
              src={
                item?.src
                  ? `${process.env.REACT_APP_API_BASE_URL}${item?.src}`
                  : emptyImage
              }
              alt={`wishlist ${item.name}`}
              className="w-40 object-cover"
            />
          </div>
          <div className="p-4 md:col-span-3 lg:col-span-3 text-xs text-grayText">
            <p className="font-bold text-black">{item.name}</p>
            <Badge color="purple" className="w-fit">
              {item.category}
            </Badge>
            <p>{item.desc}</p>
            <p className="text-base font-bold">{rupiahFormat(item.price)}</p>
            <p>Stock: {item.stock} pcs</p>
            <p>Weight: {weightFormat(item.weight)} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardWishlist;
