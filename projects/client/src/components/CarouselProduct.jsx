import React, { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { FaCartArrowDown } from "react-icons/fa";
import { Badge } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";

import CardProduct from "./CardProduct";
import axios from "../api/axios";
import { productsUser } from "../features/productListUserSlice";

const CarouselProduct = () => {
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state.producter.value);

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

  useEffect(() => {
    axios.get("/admin/products").then((res) => {
      dispatch(productsUser(res.data?.data));
    });
  }, [dispatch]);

  const products = productsData.map((item, index) => (
    <CardProduct
      key={index}
      src={`${process.env.REACT_APP_API_BASE_URL}${item?.Image_products[0]?.img_product}`}
      category={item.category}
      name={item.name}
      desc={item.description}
      price={item.price}
      id={item.id}
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
