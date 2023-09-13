import React from "react";
import { Modal } from "flowbite-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ProductDetailsModal = ({ show, onClose, product }) => {
  if (!product) {
    return null;
  }

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(product.price);

  const formattedWeight = product.weight / 1000;

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 1024 },
      items: 1,
    },
    desktop: {
      breakpoint: { max: 1024, min: 800 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <Modal show={show} size="lg" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900">
            Product: {product.name}
          </h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <Carousel responsive={responsive}>
            {product.Image_products.map((image, index) => (
              <div key={index} className="flex items-center justify-center">
                <img
                  className="object-cover w-60 h-60"
                  alt={`Product Image ${index}`}
                  src={`${process.env.REACT_APP_API_BASE_URL}${image.img_product}`}
                />
              </div>
            ))}
          </Carousel>
          <div className="mx-auto w-full max-w-md"></div>
          <p>
            <strong>Name:</strong> {product.name}
          </p>
          <p>
            <strong>Category:</strong> {product.category?.name || "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Price:</strong> {formattedPrice}
          </p>
          <p>
            <strong>Weight:</strong> {formattedWeight.toFixed(2)} kg
          </p>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ProductDetailsModal;
