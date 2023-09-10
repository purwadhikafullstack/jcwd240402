import React, { useState } from "react";
import { Modal } from 'flowbite-react';

const ProductDetailsModal = ({ show, onClose, product }) => {
  console.log(product)

  if (!product) {
    return null;
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(product.price);

  const formattedWeight = (product.weight / 1000);

  return (
    <Modal show={show} size="lg" popup onClose={onClose}>
      <Modal.Header>
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900">Product: {product.name}</h3>
        </div>
      </Modal.Header>
      <Modal.Body>
        {product && (
          <div className="mb-4">
            <div className="mx-auto w-full max-w-md">
            </div>
            <p><strong>Name:</strong> {product?.name}</p>
            <p><strong>Category:</strong> {product?.category?.name || 'N/A'}</p>
            <p><strong>Description:</strong> {product?.description}</p>
            <p><strong>Price:</strong> {formattedPrice}</p>
            <p><strong>Weight:</strong> {formattedWeight.toFixed(2)} kg</p>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default ProductDetailsModal;

