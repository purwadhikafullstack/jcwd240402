import React from "react";
import { Carousel } from "flowbite-react";

const CarouselBanner = ({ imageUrls, carouselSize }) => {
  let sizeClasses;
  let parentWidht;

  switch (carouselSize) {
    case "home":
      sizeClasses = "w-full h-32  md:h-[15rem]  lg:h-[20rem]";
      parentWidht = "w-screen";
      break;
    case "products":
      sizeClasses =
        "w-[21rem] h-[21rem] md:w-[20rem] md:h-[20rem] lg:w-[30rem] lg:h-[30rem]";
      parentWidht = "";
      break;

    default:
      sizeClasses =
        "w-[24rem] h-32 md:w-[49rem] md:h-[15rem] lg:w-[79rem] lg:h-[20rem]";
      break;
  }
  return (
    <div className={parentWidht}>
      <Carousel
        slideInterval={5000}
        className={`${sizeClasses} transition-all duration-500 ease-in`}
        indicators={false}
        leftControl=" "
        rightControl=" "
      >
        {imageUrls.map((url, index) => (
          <img
            key={index}
            alt="Carousel Slide"
            src={url}
            className="object-cover w-full h-full"
          />
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
