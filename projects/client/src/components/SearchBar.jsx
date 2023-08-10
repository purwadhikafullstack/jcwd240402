import React from "react";
import { BiSearch } from "react-icons/bi";

const SearchBar = ({
  width = "w-full",
  height,
  rounded,
  position,
  bgColor,
  margin,
}) => {
  return (
    <div className="relative ">
      <input
        type="search"
        id="search"
        className={`block ${margin} ${width} ${height} p-2.5 text-sm text-gray-900 border border-gray-300 ${rounded} bg-gray-50`}
        placeholder="Search"
      />
      <span
        className={`absolute ${position}  md:right-0  top-1/2 transform -translate-y-1/2 text-lg`}
      >
        <button
          className={`flex justify-center items-center w-12 h-7 ${bgColor} rounded-lg`}
        >
          <BiSearch className="text-base_grey" />
        </button>
      </span>
    </div>
  );
};

export default SearchBar;
