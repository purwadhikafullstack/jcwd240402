import React, { useState } from "react";
import Button from "./Button";
import InputForm from "./InputForm";
import TextArea from "./TextArea";
import ImageGallery from "./Image/ImageGallery";
import axios from "../api/axios";
import SidebarAdminDesktop from "./SidebarAdminDesktop";

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

  const resetForm = () => {
    setProduct({
      name: "",
      description: "",
      weight: "",
      category_id: "",
      price: "",
      images: [],
    });
    setUploadedImages([]);
  };

  const updateImages = (updatedImages) => {
    setUploadedImages(updatedImages);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('weight', product.weight);
      formData.append('category_id', product.category_id);
      formData.append('price', product.price);
      
      uploadedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });
      
      const response = await axios.post("/admin/product", formData, {
      });
      resetForm(); 
  
      console.log("Product created:", response.data);
    } catch (error) {
      console.error("Error creating product:", error.response.data);
    }
  };

  

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarAdminDesktop />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-700 body-font bg-white">
          <div className="container mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row justify-center">
                <div className="lg:w-3/5 w-full flex flex-col justify-center items-center">
                  <ImageGallery
                    images={uploadedImages}
                    onUpload={updateImages}
                  />
                </div>
                <div className="lg:w-2/5 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0 mx-5">
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
                  <div className="flex mt-6 justify-center content-evenly">
                    <Button
                      type="submit"
                      buttonText={isEditMode ? "Update Product" : "Add Product"}
                      bgColor="bg-blue3"
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
    </div>
  );
};

export default ProductForm;
