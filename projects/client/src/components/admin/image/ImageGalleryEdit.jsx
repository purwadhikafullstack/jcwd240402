import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaUpload } from "react-icons/fa";
import axios from "../../../api/axios";
import { fetchProductDetails } from "../../../features/actions/productActions";
import { getCookie } from "../../../utils/tokenSetterGetter";

function ImageGalleryEdit() {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.product.productDetails);

  const [mainImage, setMainImage] = useState(null);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    setProductImages(productDetails.Image_products || []);
  }, [productDetails]);

  const handleImageUpdate = async (event, imgProductId) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("image", file);

        let response;

        if (imgProductId) {
          response = await axios.patch(
            `/admin/product/image/${imgProductId}`,
            formData,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
        } else {
          response = await axios.post(
            `/admin/product/${productDetails.id}/image`,
            formData,
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          );
        }

        await dispatch(fetchProductDetails(productDetails.name));
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  const handleImageHover = (hoveredImage) => {
    setMainImage(hoveredImage);
  };

  const SubImageBox = ({ image, imgProductId, onHover }) => {
    const handleDelete = async () => {
      try {
        await axios.delete(`/admin/product/image/${imgProductId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        dispatch(fetchProductDetails(productDetails.name));
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    };

    return (
      <div className="sub-image-box relative inline-block m-2 shadow-md rounded-md overflow-hidden">
        {image ? (
          <div className="sub-image-preview">
            <img
              className="w-20 h-20"
              src={`${process.env.REACT_APP_API_BASE_URL}${image.img_product}`}
              alt="Product Preview"
              onMouseOver={() => onHover(image.img_product)}
            />
            <div className="flex justify-between p-1">
              <span className="cursor-pointer" onClick={handleDelete}>
                <FaTrash />
              </span>
              <label
                className="cursor-pointer"
                htmlFor={`update-image-${imgProductId}`}
              >
                <FaUpload />
              </label>
              <input
                id={`update-image-${imgProductId}`}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(event) => handleImageUpdate(event, imgProductId)}
              />
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 object-cover border-2 border-dashed border-gray-300 flex items-center justify-center">
            <label
              htmlFor={`image-upload-${imgProductId}`}
              className="cursor-pointer"
            >
              <FaUpload />
            </label>
            <input
              id={`image-upload-${imgProductId}`}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => handleImageUpdate(event, imgProductId)}
            />
          </div>
        )}
      </div>
    );
  };

  const subImageBoxes = [...Array(5)].map((_, index) => {
    const image = productImages[index] || null;
    const imgProductId = image?.id || null;
    return (
      <SubImageBox
        key={index}
        image={image}
        imgProductId={imgProductId}
        onHover={handleImageHover}
      />
    );
  });

  return (
    <div className="image-gallery-edit flex flex-col items-center">
      <div className="main-image-container flex items-center justify-center w-80 h-80 relative overflow-hidden">
        <img
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={`${process.env.REACT_APP_API_BASE_URL}${
            mainImage || productImages[0]?.img_product
          }`}
          alt="Main Preview"
        />
      </div>
      <div className="sub-images-container">{subImageBoxes}</div>
    </div>
  );
}

export default ImageGalleryEdit;
