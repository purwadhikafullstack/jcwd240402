import React from "react";
import { Label } from "flowbite-react";
import { BiSearch } from "react-icons/bi";

const SearchBar = () => {
  return (
    <div className="w-96">
      <div className="relative">
        <input
          type="search"
          id="search"
          className="block w-full p-2.5 text-sm text-gray-900 border border-gray-300 rounded-xl bg-gray-50"
          placeholder="Search"
        />
        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-lg">
          <button className="flex justify-center items-center w-12 h-7 bg-blue3 rounded-lg">
            <BiSearch />
          </button>
        </span>
      </div>
    </div>
  );
};

export default SearchBar;
