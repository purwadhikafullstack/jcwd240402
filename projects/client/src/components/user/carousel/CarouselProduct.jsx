import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

import CardProduct from "../card/CardProduct";
import emptyImage from "../../../assets/images/emptyImage.jpg";

const CarouselProduct = ({ products }) => {
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
      src={
        item?.product_img?.img
          ? `${process.env.REACT_APP_API_BASE_URL}${item?.product_img?.img}`
          : emptyImage
      }
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
