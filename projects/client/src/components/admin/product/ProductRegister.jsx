import React, { useState } from "react";
import Button from "../../Button";
import ImageGallery from "../image/ImageGallery";
import axios from "../../../api/axios";
import ProductInputs from "../product/ProductInputs";
import { useFormik } from 'formik';
import * as Yup from 'yup';

const ProductRegister = ({ initialData, onSubmit, isEditMode = false }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("weight", values.weight);
      formData.append("category_id", values.category_id);
      formData.append("price", values.price);

      uploadedImages.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post("/admin/product", formData, {});
      formik.resetForm();
      setUploadedImages([]);
      setSuccessMessage("Product created successfully"); // Set success message here
      console.log("Product created:", response.data);
    } catch (error) {
      console.error("Error creating product:", error.response.data);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      weight: initialData?.weight || "",
      category_id: initialData?.category_id || "",
      price: initialData?.price || "",
      images: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      weight: Yup.string().required("Weight is required"),
      category_id: Yup.string().required("Category is required"),
      price: Yup.string().required("Price is required"),
    }),
    onSubmit: handleSubmit,
  });

  const updateImages = (updatedImages) => {
    setUploadedImages(updatedImages);
  };

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-700 body-font bg-white">
          <div className="container mx-auto">
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col lg:flex-row justify-center items-start p-10 border-rounded">
                <div className="w-full flex flex-col justify-center items-center mt-6">
                  <ImageGallery
                    images={uploadedImages}
                    onUpload={updateImages}
                  />
                </div>
                <div className="w-full flex flex-col items-center">
                  <ProductInputs
                    product={formik.values}
                    handleInputChange={formik.handleChange}
                    formik={formik}
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
                  {successMessage && (
                    <p className="text-green-500 mt-3">{successMessage}</p>
                  )}
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
