import React from "react";
import SlideOverFilter from "../slide/SlideOverFilter";
import { Pagination } from "flowbite-react";
import { TbZoomMoney } from "react-icons/tb";
import { RiScales2Fill } from "react-icons/ri";
import toRupiah from "@develoka/angka-rupiah-js";

const NavbarFilterPagination = ({
  rangePriceMin,
  rangePriceMax,
  rangeWeightMin,
  rangeWeightMax,
  setSearchParams,
  searchParams,
  limitPrice,
  limitWeight,

  currentPriceMax,
  currentPriceMin,
  currentWeightMax,
  currentWeightMin,
  currentPage,
  totalPage,
  handlePage,
  handleResetFilter,
}) => {
  return (
    <div className="w-full">
      <div className="flex w-full mb-2 h-fit items-center justify-between">
        <div className="flex justify-center items-center">
          <SlideOverFilter
            rangePriceMin={rangePriceMin}
            rangePriceMax={rangePriceMax}
            rangeWeightMin={rangeWeightMin}
            rangeWeightMax={rangeWeightMax}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
            limitPrice={limitPrice}
            limitWeight={limitWeight}
          />
          <div className="hidden lg:flex md:flex">
            {currentPriceMin && currentPriceMax ? (
              <p className="flex  text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2">
                <span>
                  <TbZoomMoney className="text-xl" />
                </span>
                from {toRupiah(currentPriceMin)} to {toRupiah(currentPriceMax)}
              </p>
            ) : null}
            {currentWeightMin && currentWeightMax ? (
              <p className="flex text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2">
                <span>
                  <RiScales2Fill className="text-xl" />
                </span>
                from {currentWeightMin} gr to {currentWeightMax} gr
              </p>
            ) : null}
            {(currentPriceMin && currentPriceMax) ||
            (currentWeightMin && currentWeightMax) ? (
              <button
                onClick={handleResetFilter}
                className="text-center flex text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2 flex-nowrap"
              >
                reset filter
              </button>
            ) : null}
          </div>
        </div>

        <Pagination
          layout="navigation"
          showIcons
          currentPage={currentPage}
          onPageChange={handlePage}
          totalPages={totalPage}
        />
      </div>
      <div className="flex flex-nowrap w-full overflow-x-auto items-center lg:hidden md:hidden">
        {(currentPriceMin && currentPriceMax) ||
        (currentWeightMin && currentWeightMax) ? (
          <button
            onClick={handleResetFilter}
            className="text-center text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit h-fit gap-2 border-2 "
          >
            reset filter
          </button>
        ) : null}
        <div className="flex w-full overflow-x-auto  lg:hidden md:hidden">
          {currentPriceMin && currentPriceMax ? (
            <p
              className="flex text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2"
              style={{ minWidth: "200px" }}
            >
              <span>
                <TbZoomMoney className="text-xl" />
              </span>
              from {toRupiah(currentPriceMin)} to {toRupiah(currentPriceMax)}
            </p>
          ) : null}
          {currentWeightMin && currentWeightMax ? (
            <p
              className="flex text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2"
              style={{ minWidth: "200px" }}
            >
              <span>
                <RiScales2Fill className="text-xl" />
              </span>
              from {currentWeightMin} to {currentWeightMax}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NavbarFilterPagination;
