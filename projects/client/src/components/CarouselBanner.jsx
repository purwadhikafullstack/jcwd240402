import React from "react";
import { Carousel } from "flowbite-react";

const CarouselBanner = ({ imageUrls }) => {
  return (
    <div>
      <Carousel
        slideInterval={5000}
        className="h-[6rem] w-[17rem] md:h-[12rem] md:w-[40rem] lg:h-[15rem] lg:w-[60rem] transition-all duration-500 ease-in"
      >
        {imageUrls.map((url, index) => (
          <img key={index} alt="Carousel Slide" src={url} />
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselBanner;
