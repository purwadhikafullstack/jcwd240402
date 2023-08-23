import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InputForm from '../InputForm';
import TextArea from '../TextArea';

const ProductInputsEdit = ({ productId }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    weight: '',
    price: '',
    category_id: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`YOUR_API_ENDPOINT_FOR_PRODUCT/${productId}`);
        setProduct(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 mx-5">
      <InputForm
        label="Product Name"
        placeholder="Enter product name"
        value={product.name}
        name="name"
        onChange={handleInputChange}
        width="w-full"
      />
      <div className="flex mt-4">
        <div className="block font-poppins">Description</div>
      </div>
      <TextArea
        placeholder="Enter product description"
        value={product.description}
        name="description"
        onChange={handleInputChange}
      />
      <div className="flex my-4 gap-5 justify-center content-evenly">
        <InputForm
          label="Weight"
          placeholder="Enter product weight"
          value={product.weight}
          name="weight"
          onChange={handleInputChange}
          width="w-full"
        />
        <InputForm
          label="Price"
          placeholder="Enter product price"
          value={product.price}
          name="price"
          onChange={handleInputChange}
          width="w-full"
        />
      </div>
      <InputForm
        label="Category"
        placeholder="Enter product category"
        value={product.category_id}
        name="category_id"
        onChange={handleInputChange}
        width="w-35"
      />
    </div>
  );
};

export default ProductInputsEdit;
