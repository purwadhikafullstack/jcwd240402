import React from "react";
import { Carousel } from "flowbite-react";

const CarouselBanner = ({ imageUrls }) => {
  return (
    <div>
      <Carousel
        slideInterval={5000}
        className="w-72 h-32 md:w-[60rem] md:h-[15rem] lg:w-[79rem] lg:h-[20rem] transition-all duration-500 ease-in"
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
