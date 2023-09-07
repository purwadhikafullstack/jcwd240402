import React from "react";
import { Carousel } from "react-carousel-minimal";

const CarouselProductDetail = ({ data }) => {
  const captionStyle = {
    fontSize: "2em",
    fontWeight: "bold",
  };

  const slideNumberStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };
  return (
    <Carousel
      data={data}
      time={1000}
      width="400px"
      height="400px"
      captionStyle={captionStyle}
      radius="10px"
      slideNumber={true}
      slideNumberStyle={slideNumberStyle}
      captionPosition="bottom"
      automatic={false}
      dots={false}
      pauseIconColor="white"
      pauseIconSize="40px"
      slideBackgroundColor="darkgrey"
      slideImageFit="cover"
      thumbnails={true}
      thumbnailWidth="50px"
      style={{
        textAlign: "center",
        maxWidth: "600px",
        maxHeight: "600px",
        margin: "40px auto",
      }}
    />
  );
};

export default CarouselProductDetail;
