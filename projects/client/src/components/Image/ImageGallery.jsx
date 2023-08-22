import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";

function MainImageDisplay({ image }) {
  if (!image) {
    return (
      <div className="main-image-placeholder border-2 border-dashed border-gray-300 w-72 h-72 flex items-center justify-center mb-5">
        No Image
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

function SubImageDisplay({ image, onHover, onDelete }) {
  const handleDelete = () => {
    onDelete(image);
  };

  return (
    <div className="sub-image relative inline-block m-2 shadow-md rounded-md overflow-hidden">
      <img
        className="w-20 h-20"
        src={URL.createObjectURL(image)}
        alt="Sub Preview"
        onMouseOver={() => onHover(image)}
      />
      <span
        className="absolute top-1 right-1 cursor-pointer bg-white p-1 rounded-full"
        onClick={handleDelete}
      >
        <FaTrash />
      </span>
    </div>
  );
}

function ImageUploader({ onUpload, remaining }) {
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).slice(0, remaining);
    onUpload(files);
  };

  return (
    <div className="image-uploader mt-5">
      <input
        className="border p-2 rounded"
        type="file"
        multiple
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
}

function ImageGallery({ images, onUpload }) {
  const [mainImage, setMainImage] = useState(
    images && images.length ? images[0] : null
  );

  const handleImageUpload = (uploadedFiles) => {
    const combinedImages = [...images, ...uploadedFiles];
    onUpload(combinedImages);
    if (!mainImage) {
      setMainImage(uploadedFiles[0]);
    }
  };

  const handleImageHover = (imageFile) => {
    setMainImage(imageFile);
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
      <MainImageDisplay image={mainImage} />
      <div className="sub-images-container flex h-24 mb-5">
        {images.slice(0, 5).map((imageFile, idx) => (
          <SubImageDisplay
            key={idx}
            image={imageFile}
            onHover={handleImageHover}
            onDelete={handleImageDelete}
          />
        ))}
      </div>
      {images.length < 5 && (
        <ImageUploader
          onUpload={handleImageUpload}
          remaining={5 - images.length}
        />
      )}
    </div>
  );
}

ImageGallery.defaultProps = {
  images: [],
  setImages: () => {},
};

export default ImageGallery;
