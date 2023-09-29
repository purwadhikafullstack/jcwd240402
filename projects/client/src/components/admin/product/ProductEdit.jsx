import React, { useState, useEffect } from "react";
import Button from "../../Button";
import ImageGalleryEdit from "../image/ImageGalleryEdit";
import axios from "../../../api/axios";
import ProductInputsEdit from "./ProductInputEdit";
import { getCookie } from "../../../utils/tokenSetterGetter";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import withAuthAdmin from "../withAuthAdmin";

const ProductEdit = () => {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productName: encodedProductName } = useParams();
  const [changedFields, setChangedFields] = useState({});
  const [serverErrors, setServerErrors] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
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
          (img) => `${process.env.REACT_APP_API_BASE_URL}${img.img_product}`
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
      await axios.patch(`/admin/product/${product.id}`, changedFields, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      setSuccessMessage("Product updated successfully");
      setIsSubmitted(true); 
      setTimeout(() => {
        navigate("/admin/products");
      }, 5000);
      setServerErrors([]);
      setChangedFields({});
    } catch (error) {
      setSuccessMessage("");
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

  const handleInputChange = (name, value) => {
    if (typeof name === "object" && name.target) {
      ({ name, value } = name.target);
    }
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    setChangedFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className="flex lg:h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-700 body-font bg-white">
          <div className="container mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col lg:flex-row justify-center items-start  lg:p-10 border-rounded">
                <div className="w-full flex flex-col justify-center items-center lg:mt-6">
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
                  <div className="flex my-4 lg:mt-6 justify-center w-full gap-4">
                    <Button
                      onClick={handleCancel}
                      buttonText="Cancel"
                      bgColor="bg-gray-300"
                      colorText="text-black"
                      fontWeight="font-bold"
                      buttonSize="medium"
                      className="ml-4"
                    />
                    <Button
                      type="submit"
                      buttonText="Save"
                      bgColor="bg-blue3"
                      colorText="text-white"
                      fontWeight="font-bold"
                      buttonSize="medium"
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

export default withAuthAdmin(ProductEdit);
