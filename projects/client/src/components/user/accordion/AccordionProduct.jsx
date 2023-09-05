import React from "react";
import { Accordion } from "flowbite-react";
import toRupiah from "@develoka/angka-rupiah-js";

const AccordionProduct = ({ name, price, desc, weight }) => {
  return (
    <Accordion className="w-full">
      <Accordion.Panel>
        <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
          Description Product
        </Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-gray-500 dark:text-gray-400">{desc}</p>
        </Accordion.Content>
      </Accordion.Panel>
      <Accordion.Panel>
        <Accordion.Title className="hover:bg-blue2 bg-blue3 text-white">
          Weight
        </Accordion.Title>
        <Accordion.Content>
          <p className="mb-2 text-gray-500 dark:text-gray-400">
            Introducing our product, {name}, priced at {toRupiah(price)} and
            weighing <span className="font-bold">{weight}</span>. Kindly note
            that the stated price excludes shipping charges.
          </p>
        </Accordion.Content>
      </Accordion.Panel>
    </Accordion>
  );
};

export default AccordionProduct;
