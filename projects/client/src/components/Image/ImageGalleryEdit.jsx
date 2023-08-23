import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ImageGalleryEdit = ({ productData, onImagesChange }) => {
  // Initialize state with the images from productData
  const [images, setImages] = useState(productData?.images || []);
  console.log(images)

  // Function to handle image click
  const handleImageClick = (index) => {
    // Remove the clicked image
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    // If you have any callback function to handle this change, you can call it here
    onImagesChange && onImagesChange(newImages);
  };

  // Define carousel responsiveness settings
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

  return (
    <div>
      <Carousel
        responsive={responsive}
        removeArrowOnDeviceType={["tablet", "mobile"]}
      >
        {images.map((url, index) => (
          <div key={index} onClick={() => handleImageClick(index)}>
            <img
              src={url}
              alt={`Product Image - ${index}`}
              style={{ width: "100%", height: "auto", cursor: "pointer" }}
            />
            <p>Click to remove</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageGalleryEdit;
