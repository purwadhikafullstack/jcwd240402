import React from "react";
import InputForm from "../../InputForm";
import TextAreaForm from "../../TextAreaForm";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";

const ProductInputs = ({ formik, setSelectedCategory, selectedCategory }) => {
  const loadCategoryOptions = async (inputValue) => {
    try {
      const response = await axios.get(`/admin/categories`, {
        params: {
          name: inputValue,
        },
      });
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

  const handleCategoryChange = (selectedOption) => {
    formik.setFieldValue("category_id", selectedOption.value);
    setSelectedCategory(selectedOption); // use setSelectedCategory from props
  };

  return (
    <div className="w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 mx-5">
      <InputForm
        label="Product Name"
        placeholder="Enter product name"
        value={formik.values.name}
        name="name"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errorMessage={formik.touched.name && formik.errors.name}
        width="w-full"
      />
      <div className="flex mt-4">
        <div className="block font-poppins">Description</div>
      </div>
      <TextAreaForm
        placeholder="Enter product description"
        value={formik.values.description}
        name="description"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        errorMessage={formik.touched.description && formik.errors.description}
      />
      <div className="flex my-4 gap-5 justify-center content-evenly">
        <InputForm
          label="Weight(Grams)"
          placeholder="Enter product weight"
          value={formik.values.weight}
          name="weight"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.touched.weight && formik.errors.weight}
          width="w-full"
        />
        <InputForm
          label="Price(Rp)"
          placeholder="Enter product price"
          value={formik.values.price}
          name="price"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={formik.touched.price && formik.errors.price}
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
          onChange={(selectedOption) => {
            handleCategoryChange(selectedOption);
            formik.setFieldValue("category_label", selectedOption.label);
          }}
          onBlur={formik.handleBlur}
          placeholder="Select a category"
          className="relative z-50"
        />
        {formik.touched.category_id && formik.errors.category_id && (
          <p className="text-red-500">{formik.errors.category_id}</p>
        )}
      </div>
    </div>
  );
};

export default ProductInputs;
