import React, { useState } from "react";
import { Accordion } from "flowbite-react";
import { rupiahFormat } from "../../../utils/formatter";
import { weightFormat } from "../../../utils/formatter";

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
              From {rupiahFormat(priceMin)} to {rupiahFormat(priceMax)}
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
              Apply
            </button>
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
            WEIGHT
          </Accordion.Title>
          <Accordion.Content>
            <span className="text-xs font-bold">
              From {weightFormat(weightMin)} to {weightFormat(weightMax)}
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
      </Accordion>
    </>
  );
};

export default AccordionFilter;
