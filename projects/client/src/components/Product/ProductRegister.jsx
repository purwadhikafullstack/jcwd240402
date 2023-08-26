import React, { useState } from "react";
import Button from "../Button";
import ImageGallery from "../image/ImageGallery";
import axios from "../../api/axios";
import ProductInputs from "./ProductInputs";

const ProductRegister = ({ initialData, onSubmit, isEditMode = false }) => {
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
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("weight", product.weight);
      formData.append("category_id", product.category_id);
      formData.append("price", product.price);

      uploadedImages.forEach((image, index) => {
        formData.append(`images`, image);
      });

      const response = await axios.post("/admin/product", formData, {});
      resetForm();
      console.log("Product created:", response.data);
    } catch (error) {
      console.error("Error creating product:", error.response.data);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-700 body-font bg-white">
          <div className="container mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row justify-center items-start p-10 border-rounded">
                <div className=" w-full flex flex-col justify-center items-center mt-6">
                  <ImageGallery
                    images={uploadedImages}
                    onUpload={updateImages}
                  />
                </div>
                <div className="w-full flex flex-col items-center">
                  <ProductInputs
                    product={product}
                    handleInputChange={handleInputChange}
                  />
                  <div className="flex mt-6 justify-center w-full">
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

export default ProductRegister;
