import React, { useState,useEffect } from "react";
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
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files).slice(0, remaining);
    onUpload(files);
    setInputKey(Date.now());
  };

  return (
    <div className="image-uploader mt-5">
      <input
        key={inputKey}
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
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    setMainImage(images.length ? images[0] : null);
  }, [images]);

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
  <div className="image-gallery-container flex flex-col items-center max-h-[600px] overflow-y-auto">
    <MainImageDisplay image={mainImage} />
    <div className="sub-images-container flex h-24 mb-5 overflow-y-auto flex-nowrap">
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
