import React from "react";
import { Carousel } from "flowbite-react";

const CarouselBanner = ({ imageUrls }) => {
  return (
    <div>
      <Carousel
        slideInterval={5000}
        className="h-[5.5rem] w-[21rem] md:h-[12rem] md:w-[54rem] lg:h-[20rem] lg:w-[78rem] transition-all duration-500 ease-in"
        indicators={false}
        leftControl=" "
        rightControl=" "
      >
        {imageUrls.map((url, index) => (
          <img key={index} alt="Carousel Slide" src={url} />
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
