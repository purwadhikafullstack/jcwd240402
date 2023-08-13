import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import CardProduct from "./CardProduct";

import { FaCartArrowDown } from "react-icons/fa";
import { Badge } from "flowbite-react";

const CarouselProduct = ({ productsData }) => {
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  const products = productsData.map((item, index) => (
    <CardProduct
      key={index}
      src={item.src}
      category={item.category}
      name={item.name}
      desc={item.desc}
      price={item.price}
    />
  ));

  return (
    <div className="z-0">
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {products}
      </Carousel>
    </div>
  );
};

export default CarouselProduct;
