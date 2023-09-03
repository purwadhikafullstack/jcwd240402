import React, { useState } from "react";
import { Accordion } from "flowbite-react";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";

const AccordionFilter = () => {
  const [price, setPrice] = useState([20, 37]);
  const [weight, setWeight] = useState([20, 37]);

  const handleChangeRangePrice = (event, newPrice) => {
    setPrice(newPrice);
    console.log(event);
  };
  const handleChangeRangeWeight = (event, newWeight) => {
    setWeight(newWeight);
  };

  const [minPrice, maxPrice] = price;
  const [minWeight, maxWeight] = weight;

  return (
    <Accordion className="w-full">
      <Accordion.Panel>
        <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
          PRICE
        </Accordion.Title>
        <Accordion.Content>
          <Box sx={{ width: 300 }}>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={price}
              onChange={handleChangeRangePrice}
              valueLabelDisplay="auto"
            />
          </Box>
          <p>Nilai Minimum (Min): {minPrice}</p>
          <p>Nilai Maksimum (Max): {maxPrice}</p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
          WEIGHT
        </Accordion.Title>
        <Accordion.Content>
          <Box sx={{ width: 300 }}>
            <Slider
              getAriaLabel={() => "Temperature range"}
              value={weight}
              onChange={handleChangeRangeWeight}
              valueLabelDisplay="auto"
            />
          </Box>
          <p>Nilai Minimum (Min): {minWeight}</p>
          <p>Nilai Maksimum (Max): {maxWeight}</p>
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
  );
};

export default AccordionFilter;
