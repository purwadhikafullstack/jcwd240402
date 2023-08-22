import React, { useState } from "react";
import Button from "./Button";
import InputForm from "./InputForm";
import TextArea from "./TextArea";
import ImageGallery from "./Image/ImageGallery";
import axios from "axios";

const ProductForm = ({ initialData, onSubmit, isEditMode = false }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [product, setProduct] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    weight: initialData?.weight || "",
    category_id: initialData?.category_id || "",
    price: initialData?.price || "",
    images: [],
});
  const handleImageUpload = (uploadedImages) => {
    setUploadedImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const handleInputChange = (event) => {
    console.log(event.target.name, event.target.value);
    const { name, value } = event.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(product);

    try {
      const productData = {
        ...product,
        images: uploadedImages,
      };

      const response = await axios.post(
        "http://localhost:8000/api/admin/product",
        productData
      );
      

      console.log("Product created:", response.data);
    } catch (error) {
      console.error("Error creating product:", error.response.data);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-100 h-screen">
      <div className="text-gray-700 body-font overflow-hidden bg-white w-3/5">
        <div className="container mx-auto p-5">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row justify-center lg:space-x-10">
              <div className="lg:w-1/2 w-full flex flex-col justify-center items-center">
                <ImageGallery
                  images={uploadedImages}
                  onUpload={handleImageUpload}
                />
              </div>
              <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
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
                <div className="flex mt-4 gap-5 justify-center content-evenly">
                  <InputForm
                    label="Weight"
                    placeholder="Enter product weight"
                    value={product.weight}
                    name="weight"
                    onChange={handleInputChange}
                    width="w-35"
                  />
                  <InputForm
                    label="Price"
                    placeholder="Enter product price"
                    value={product.price}
                    name="price"
                    onChange={handleInputChange}
                    width="w-35"
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
                <div className="flex mt-6 justify-center content-evenly">
                  <Button
                    type="submit"
                    buttonText={isEditMode ? "Update Product" : "Add Product"}
                    bgColor="bg-red-500"
                    colorText="text-white"
                    fontWeight="font-bold"
                    buttonSize="large"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;