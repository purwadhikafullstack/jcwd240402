import React, { useEffect, useState } from "react";
import { Accordion } from "flowbite-react";
import toRupiah from "@develoka/angka-rupiah-js";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const AccordionFilter = ({
  rangePriceMin,
  rangeWeightMin,
  limitPrice,
  limitWeight,
  setSearchParams,
  searchParams,
  setCurrentPage,
}) => {
  const [price, setPrice] = useState([rangePriceMin, limitPrice]);
  const [weight, setWeight] = useState([rangeWeightMin, limitWeight]);

  const currentPage = searchParams.get("page");
  console.log(currentPage);

  const handleChangeRangePrice = (event, newPrice) => {
    setPrice(newPrice);
  };
  const handleChangeRangeWeight = (event, newWeight) => {
    setWeight(newWeight);
  };

  const [priceMin, priceMax] = price;
  const [weightMin, weightMax] = weight;

  const handleFilterPrice = () => {
    const { ...otherParams } = Object.fromEntries(searchParams);
    setCurrentPage(1);
    setSearchParams({
      ...otherParams,
      page: 1,
      priceMin,
      priceMax,
    });
  };

  const handleFilterWeight = () => {
    const { ...otherParams } = Object.fromEntries(searchParams);
    setCurrentPage(1);
    setSearchParams({
      ...otherParams,
      page: 1,
      weightMax,
      weightMin,
    });
  };

  return (
    <>
      <Accordion alwaysOpen className="w-full">
        <Accordion.Panel>
          <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
            PRICE
          </Accordion.Title>
          <Accordion.Content>
            <span className="text-xs font-bold">
              From {toRupiah(priceMin)} to {toRupiah(priceMax)}
            </span>
            <div className="flex flex-col justify-center items-center">
              <Box sx={{ width: 250 }}>
                <Slider
                  value={price}
                  onChange={handleChangeRangePrice}
                  valueLabelDisplay="auto"
                  max={limitPrice}
                />
              </Box>
            </div>
            <button
              onClick={handleFilterPrice}
              className="bg-blue3 w-fit px-7 text-white text-xs text-center py-1 font-semibold rounded-lg"
            >
              apply
            </button>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
            WEIGHT
          </Accordion.Title>
          <Accordion.Content>
            <span className="text-xs font-bold">
              From {weightMin} gr to {weightMax} gr
            </span>
            <div className="flex flex-col justify-center items-center">
              <Box sx={{ width: 250 }}>
                <Slider
                  getAriaLabel={() => "Temperature range"}
                  value={weight}
                  onChange={handleChangeRangeWeight}
                  valueLabelDisplay="auto"
                  max={limitWeight}
                />
              </Box>
            </div>
            <button
              onClick={handleFilterWeight}
              className="bg-blue3 w-fit px-7 text-white text-xs text-center py-1 font-semibold rounded-lg"
            >
              apply
            </button>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
            STOCK
          </Accordion.Title>
          <Accordion.Content>
            <p className="mb-2 text-gray-500 dark:text-gray-400">STOCK</p>
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </>
  );
};

export default AccordionFilter;
