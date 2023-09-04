import React, { useEffect, useState } from "react";
import { Accordion } from "flowbite-react";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const AccordionFilter = ({
  rangePriceMin,
  rangeWeightMin,
  limitPrice,
  limitWeight,
  setSearchParams,
  searchParams,
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

  const handleFilter = () => {
    setSearchParams({
      ...searchParams,
      priceMin,
      priceMax,
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
            <span>
              From {priceMin} to {priceMax}
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
          </Accordion.Content>
        </Accordion.Panel>
        <Accordion.Panel>
          <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
            WEIGHT
          </Accordion.Title>
          <Accordion.Content>
            <span>
              From {weightMin} to {weightMax}
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
      <button onClick={handleFilter}>submit</button>
    </>
  );
};

export default AccordionFilter;
