import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios"; 

const ImageGalleryEdit = ({ productData, onImagesChange }) => {
  const [images, setImages] = useState(productData.images);

  useEffect(() => {
    setImages(productData.images);
  }, [productData]);

  const handleImageClick = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChange && onImagesChange(newImages);
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files[0];

    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axios.post("/api/admin/product/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const newImageUrl = response.data.url;
        setImages((prevImages) => [...prevImages, newImageUrl]);
        onImagesChange && onImagesChange([...images, newImageUrl]);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  return (
    <div>
      <Carousel>
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
      <input type="file" accept="image/*" onChange={handleUploadImage} />
    </div>
  );
};

export default ImageGalleryEdit;

