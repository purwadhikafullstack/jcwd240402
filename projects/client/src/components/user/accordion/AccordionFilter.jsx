import React, { useState } from "react";
import { Accordion } from "flowbite-react";

const AccordionFilter = () => {
  const [rangeValue, setRangeValue] = useState([30, 60]);
  const handleRangeChange = (event) => {
    const { name, value } = event.target;
    const newRangeValue = [...rangeValue];
    newRangeValue[name === "min" ? 0 : 1] = parseInt(value);
    setRangeValue(newRangeValue);
  };
  return (
    <Accordion className="w-full">
      <Accordion.Panel>
        <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
          PRICE
        </Accordion.Title>
        <Accordion.Content>
          <div className="mb-2 text-gray-500 dark:text-gray-400">HARGA</div>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
          WEIGHT
        </Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-gray-500 dark:text-gray-400">BERAT</p>
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
