import React, { useState, useEffect } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";

function MainImageDisplay({ image }) {

  if (!image || !(image instanceof Blob || image instanceof File)) {
    return (
      <div className="main-image-placeholder w-80 h-80 border-2 border-dashed border-gray-300 flex items-center justify-center m-5">
        <div className="text-gray-800 flex flex-col items-center justify-center">
          <FaUpload size={32} />
          <p>No Image</p>
        </div>
      </div>
    );
  }
  return (
    <div className="main-image mb-5">
      <img
        className="w-80 h-80 object-cover"
        src={URL.createObjectURL(image)}
        alt="Main Preview"
      />
    </div>
  );
}

function SubImageBox({ image, onHover, onDelete, onUpload }) {
  const handleDelete = () => {
    onDelete(image);
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="sub-image-box relative inline-block m-2 shadow-md rounded-md overflow-hidden">
      {image && (image instanceof Blob || image instanceof File) ? (
        <div className="sub-image-preview">
          <img
            className="w-20 h-20"
            src={URL.createObjectURL(image)}
            alt="Sub Preview"
            onMouseOver={() => onHover(image)}
          />
          <div className="flex justify-center p-1">
            <span className="cursor-pointer" onClick={handleDelete}>
              <FaTrash />
            </span>
          </div>
        </div>
      ) : (
        <div className="w-20 h-20 object-cover border-2 border-dashed border-gray-300 flex items-center justify-center">
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
            <FaUpload />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
          </label>
        </div>
      )}
    </div>
  );
}

function ImageGallery({ images, onUpload }) {
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    setMainImage(images.length ? images[0] : null);
  }, [images]);

  const handleImageUpload = (uploadedFile) => {
    const combinedImages = [...images, uploadedFile];
    onUpload(combinedImages);
    if (!mainImage) {
      setMainImage(uploadedFile);
    }
  };

  const handleImageHover = (hoveredImage) => {
    setMainImage(hoveredImage);
  };

  const handleImageDelete = (imageToDelete) => {
    const updatedImages = images.filter((image) => image !== imageToDelete);
    onUpload(updatedImages);
    if (mainImage === imageToDelete) {
      setMainImage(updatedImages[0]);
    }
  };

  return (
    <div className="image-gallery-container flex flex-col items-center">
      <div className="main-image-container flex items-center justify-center w-80 h-80 relative overflow-hidden">
        <MainImageDisplay image={mainImage || images[0]} />
      </div>

      <div className="sub-images-container">
        {Array.from({ length: 5 }).map((_, index) => (
          <SubImageBox
            key={index}
            image={images[index] || null}
            onDelete={handleImageDelete}
            onHover={handleImageHover}
            onUpload={handleImageUpload}
          />
        ))}
      </div>
    </div>
  );
}

ImageGallery.defaultProps = {
  images: [],
};

export default ImageGallery;
