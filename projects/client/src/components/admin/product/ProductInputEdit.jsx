import React, { useState } from "react";
import InputForm from "../../InputForm";
import TextAreaForm from "../../TextAreaForm";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";

const ProductInputsEdit = ({ initialProduct, handleInputChange, errors }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const loadCategoryOptions = async (inputValue) => {
    try {
      const response = await axios.get(`/admin/categories`, {
        params: { name: inputValue },
      });
      return response.data.data.map((category) => ({
        value: category.id,
        label: category.name,
      }));
    } catch (error) {
      console.error("Error loading categories:", error);
      return [];
    }
  };

  const handleCategoryChange = (selectedOption) => {
    handleInputChange({
      target: { name: "category_id", value: selectedOption.value },
    });
    setSelectedCategory(selectedOption);
  };

  // Extract error message based on field name
  const getErrorMessage = (field) => {
    const errorObj = errors.find(err => err.path === field);
    return errorObj ? errorObj.msg : null;
  };

  return (
    <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 mx-5">
      <InputForm
        label="Product Name"
        placeholder="Enter product name"
        value={initialProduct.name}
        name="name"
        onChange={handleInputChange}
        errorMessage={getErrorMessage('name')}
        width="w-full"
      />
      <div className="flex mt-4">
        <div className="block font-poppins">Description</div>
      </div>
      <TextAreaForm
        placeholder="Enter product description"
        value={initialProduct.description}
        name="description"
        onChange={handleInputChange}
        errorMessage={getErrorMessage('description')}
      />
      <div className="flex my-4 gap-5 justify-center content-evenly">
        <InputForm
          label="Weight"
          placeholder="Enter product weight"
          value={initialProduct.weight}
          name="weight"
          onChange={handleInputChange}
          errorMessage={getErrorMessage('weight')}
          width="w-full"
        />
        <InputForm
          label="Price"
          placeholder="Enter product price"
          value={initialProduct.price}
          name="price"
          onChange={handleInputChange}
          errorMessage={getErrorMessage('price')}
          width="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block font-poppins mb-1 text-gray-700">
          Category
        </label>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadCategoryOptions}
          value={selectedCategory || null}
          onChange={handleCategoryChange}
          placeholder="Select a category"
        />
        {getErrorMessage('category_id') && (
          <p className="text-red-500 mt-2">{getErrorMessage('category_id')}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInputsEdit;
