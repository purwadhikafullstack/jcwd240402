import React, { useState, useEffect } from "react";
import InputForm from "../../InputForm";
import TextArea from "../../TextArea";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";

const ProductInputsEdit = ({ initialProduct, handleInputChange }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategoryOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/categories`,
        {
          params: {
            name: inputValue,
          },
        }
      );
      const categoryOptions = response.data.data.map((category) => ({
        value: category.id,
        label: category.name,
      }));
      return categoryOptions;
    } catch (error) {
      console.error("Error loading categories:", error);
      return [];
    }
  };

  return (
    <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 mx-5">
      <InputForm
        label="Product Name"
        placeholder="Enter product name"
        value={initialProduct.name}
        name="name"
        onChange={handleInputChange}
        width="w-full"
      />
      <div className="flex mt-4">
        <div className="block font-poppins">Description</div>
      </div>
      <TextArea
        placeholder="Enter product description"
        value={initialProduct.description}
        name="description"
        onChange={handleInputChange}
      />
      <div className="flex my-4 gap-5 justify-center content-evenly">
        <InputForm
          label="Weight"
          placeholder="Enter product weight"
          value={initialProduct.weight}
          name="weight"
          onChange={handleInputChange}
          width="w-full"
        />
        <InputForm
          label="Price"
          placeholder="Enter product price"
          value={initialProduct.price}
          name="price"
          onChange={handleInputChange}
          width="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block font-poppins mb-1 text-gray-700">Category</label>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadCategoryOptions}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Select a category"
        />
      </div>
    </div>
  );
};

export default ProductInputsEdit;
