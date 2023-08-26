import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { FaTrash, FaUpload } from "react-icons/fa";

const SubImageBox = ({ image,productId, imgProductId, onDelete, onUpdate, onHover }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/product/image/${imgProductId}`);
      onDelete(imgProductId);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleUpdate = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);
        let response;
        
        if (imgProductId) {
          response = await axios.patch(
            `/admin/product/image/${imgProductId}`,
            formData
          );
        } else {
          response = await axios.post(
            `/admin/product/${productId}/image`,
            formData
          );
        }
        
        const newImageUrl = response.data.data.img_product;
        onUpdate(newImageUrl, imgProductId || response.data.data.id);

      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="sub-image-box relative inline-block m-2 shadow-md rounded-md overflow-hidden">
      {image ? (
        <div className="sub-image-preview">
          <img
            className="w-20 h-20"
            src={image}
            alt="Product Preview"
            onMouseOver={() => onHover(image)}
          />
          <div className="flex justify-between p-1">
            <span className="cursor-pointer" onClick={handleDelete}>
              <FaTrash />
            </span>
            <label
              className="cursor-pointer"
              htmlFor={`update-image-${imgProductId}`}
            >
              <FaUpload />
            </label>
            <input
              id={`update-image-${imgProductId}`}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpdate}
            />
          </div>
        </div>
      ) : (
        <div className="w-20 h-20 object-cover border-2 border-dashed border-gray-300 flex items-center justify-center">
          <label htmlFor="image-upload" className="cursor-pointer">
            <FaUpload />
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleUpdate}
          />
        </div>
      )}
    </div>
  );
};

function ImageGalleryEdit({ productData, onImagesChange }) {
  console.log(productData)
  const [mainImage, setMainImage] = useState(null);
  const [productImages, setProductImages] = useState(productData.images || []);
  console.log(productImages)

  useEffect(() => {
    setProductImages(productData.images || []);
}, [productData.images]);

  const handleImageDelete = (imgProductId) => {
    const newImages = productImages.filter(
      (image, index) => productData.Image_products[index]?.id !== imgProductId
    );
    setProductImages(newImages);
    onImagesChange && onImagesChange(newImages);
  };

  const handleImageUpdate = (newImageUrl, imgProductId) => {
    const updatedImages = productImages.map((image, index) => {
      if (productData.Image_products[index]?.id === imgProductId) {
        return newImageUrl;
      }
      return image;
    });
    setProductImages(updatedImages);
    onImagesChange && onImagesChange(updatedImages);
  };

  const handleImageHover = (hoveredImage) => {
    setMainImage(hoveredImage);
  };

  return (
    <div className="image-gallery-edit flex flex-col items-center">
      <div className="main-image-container flex items-center justify-center w-80 h-80 relative overflow-hidden">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={mainImage || productImages[0]}
          alt="Main Preview"
        />
      </div>
      <div className="sub-images-container">
        {Array.from({ length: 5 }).map((_, index) => (
          <SubImageBox
            key={index}
            image={productImages[index] || null}
            productId={productData.id}
            imgProductId={
              productData.Image_products &&
              productData.Image_products[index]?.id
            }
            onDelete={handleImageDelete}
            onUpdate={handleImageUpdate}
            onHover={handleImageHover}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGalleryEdit;

