import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaCartArrowDown } from "react-icons/fa";
import { Badge } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";

import CardProduct from "../card/CardProduct";
import axios from "../../../api/axios";
import { productsUser } from "../../../features/productListUserSlice";

const CarouselProduct = ({ products }) => {
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.producter.value);
  const [data, setData] = useState([]);
  const [test, setTest] = useState([]);

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
      items: 3,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  const productsReady = products.map((item) => (
    <CardProduct
      src={`${process.env.REACT_APP_API_BASE_URL}${item?.product_img?.img}`}
      category={item.category}
      name={item.name}
      desc={item.description}
      price={item.price}
      key={item.id}
    />
  ));

  return (
    <div className="z-0">
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {productsReady}
      </Carousel>
    </div>
  );
};

export default CarouselProduct;
