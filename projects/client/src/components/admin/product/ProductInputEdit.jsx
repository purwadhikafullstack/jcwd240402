import React, { useState, useEffect } from "react";
import InputForm from "../../InputForm";
import TextAreaForm from "../../TextAreaForm";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";

const ProductInputsEdit = ({ initialProduct, handleInputChange, errors }) => {
  const access_token = getCookie("access_token");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [displayedCategory, setDisplayedCategory] = useState(null);
  const [actualCategory, setActualCategory] = useState(null);

  useEffect(() => {
    const fetchDefaultCategories = async () => {
      try {
        const categories = await loadCategoryOptions("");
        setDefaultCategories(categories);
      } catch (error) {
        console.error("Error fetching default categories:", error);
      }
    };
    fetchDefaultCategories();
  }, []);

  useEffect(() => {
    if (
      initialProduct &&
      initialProduct.category &&
      initialProduct.category.id &&
      initialProduct.category.name
    ) {
      const initialCategory = {
        value: initialProduct.category.id,
        label: initialProduct.category.name,
      };
      setSelectedCategory(initialCategory);
    }
  }, [initialProduct]);

  const loadCategoryOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/categories`,
        {
          params: { name: inputValue },
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
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
    handleInputChange("category_id", selectedOption.value);
    setSelectedCategory(selectedOption);
    setDisplayedCategory(selectedOption);
    setActualCategory(selectedOption.value);
  };

  const getErrorMessage = (field) => {
    const errorObj = errors.find((err) => err.path === field);
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
        errorMessage={getErrorMessage("name")}
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
        errorMessage={getErrorMessage("description")}
      />
      <div className="flex my-4 gap-5 justify-center content-evenly">
        <InputForm
          label="Weight(Grams)"
          placeholder="Enter product weight"
          value={initialProduct.weight}
          name="weight"
          onChange={handleInputChange}
          errorMessage={getErrorMessage("weight")}
          width="w-full"
        />
        <InputForm
          label="Price(Rp)"
          placeholder="Enter product price"
          value={initialProduct.price}
          name="price"
          onChange={handleInputChange}
          errorMessage={getErrorMessage("price")}
          width="w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block font-poppins mb-1 text-gray-700">
          Category
        </label>
        <AsyncSelect
          cacheOptions
          defaultOptions={defaultCategories}
          loadOptions={loadCategoryOptions}
          value={displayedCategory || null}
          onChange={handleCategoryChange}
          placeholder="Select a category"
          className="relative z-50"
        />
        {getErrorMessage("category_id") && (
          <p className="text-red-500 mt-2">{getErrorMessage("category_id")}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInputsEdit;
