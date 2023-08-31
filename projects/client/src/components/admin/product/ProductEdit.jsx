import React, { useState, useEffect } from "react";
import Button from "../../Button";
import ImageGalleryEdit from "../image/ImageGalleryEdit";
import axios from "../../../api/axios";
import ProductInputsEdit from "./ProductInputEdit";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

const ProductEdit = () => {
  const dispatch = useDispatch();
  const { productName: encodedProductName } = useParams();
  const [changedFields, setChangedFields] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    weight: "",
    category_id: "",
    price: "",
    images: [],
  });
  const [isFormValid, setIsFormValid] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get("/admin/single-product", {
          params: { name: encodedProductName },
        });
        const productData = response.data;
        const imagesURL = productData.Image_products.map(
          (img) => `http://localhost:8000${img.img_product}`
        );
        setProduct({ ...productData, images: imagesURL });
        dispatch({ type: "UPDATE_PRODUCT_DETAILS", payload: productData });
      } catch (error) {
        console.error("Error fetching the product details:", error);
      }
    };
    fetchProductDetails();
  }, [dispatch, encodedProductName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid) {
      console.error("Form is not valid");
      return;
    }
    try {
      await axios.patch(`/admin/product/${product.id}`, changedFields);
      setSuccessMessage("Product updated successfully");
      setServerErrors([]);
      setChangedFields({});
    } catch (error) {
      setServerErrors(error.response.data.errors);
      console.error("Error updating product:", error.response.data);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    setChangedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };
  

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-700 body-font bg-white">
          <div className="container mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row justify-center items-start p-10 border-rounded">
                <div className="w-full flex flex-col justify-center items-center mt-6">
                  <ImageGalleryEdit
                    productData={product}
                    onImagesChange={setUploadedImages}
                  />
                </div>
                <div className="w-full flex flex-col items-center">
                  <ProductInputsEdit
                    initialProduct={product}
                    handleInputChange={handleInputChange}
                    errors={serverErrors}
                  />
                  <div className="flex mt-6 justify-center w-full">
                    <Button
                      type="submit"
                      buttonText="Update"
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

export default ProductEdit;