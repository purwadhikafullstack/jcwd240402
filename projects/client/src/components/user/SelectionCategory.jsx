import React from "react";
import { Link } from "react-router-dom";

import emptyImage from "../../assets/images/emptyImage.jpg";

const SelectionCategory = ({ category }) => {
  return (
    <div className="">
      <div className="flex gap-4 lg:gap-x-4 justify-center items-center flex-wrap ">
        {category.slice(0, 4).map((item) => (
          <Link
            key={item.id}
            className="hover:shadow-3xl shadow-3xl lg:shadow-none rounded-lg flex justify-center items-center flex-col"
            to={`/product/product-category/${item.name}`}
          >
            <div className="w-32 md:w-40 lg:w-40 md:h-28 lg:h-28 rounded-lg truncate">
              <img
                src={
                  item.category_img
                    ? `${process.env.REACT_APP_API_BASE_URL}${item.category_img}`
                    : emptyImage
                }
                alt="category"
                className="object-cover w-40 h-28 rounded-lg hover:scale-[1.2] transition-all duration-500 ease-in "
              />
            </div>
            <div className="flex text-xs lg:text-base justify-center items-center py-2">
              <h1 className="text-sm font-bold">{item.name}</h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SelectionCategory;
