import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaUpload } from "react-icons/fa";
import axios from "../../../api/axios";
import { fetchProductDetails } from "../../../features/actions/productActions";
import { getCookie } from "../../../utils/tokenSetterGetter";
import AlertWithIcon from "../../AlertWithIcon";
import noimage from "../../../assets/images/noimagefound.jpg"

function ImageGalleryEdit() {
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.product.productDetails);
  const [mainImage, setMainImage] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [alert, setAlert] = useState({ message: null, color: null });
  const [alertTimeout, setAlertTimeout] = useState(null);

  const showAlert = (message, color = null) => {
    setAlert({ message, color });
    if (alertTimeout) clearTimeout(alertTimeout);
    const timeout = setTimeout(() => {
      setAlert({ message: null, color: null });
    }, 5000);
    setAlertTimeout(timeout);
  };

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

        if (response.data.message) {
          showAlert(response.data.message, "success");
        }
        await dispatch(fetchProductDetails(productDetails.name));
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          showAlert(error.response.data.error, "bg-red-500");
        }
      }
    }
  };

  const handleImageHover = (hoveredImage) => {
    setMainImage(hoveredImage);
  };

  const SubImageBox = ({ image, imgProductId, onHover }) => {
    const handleDelete = async () => {
      try {
        const response = await axios.delete(
          `/admin/product/image/${imgProductId}`,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );

        if (response.data.message) {
          showAlert(response.data.message, "success");
        }

        dispatch(fetchProductDetails(productDetails.name));
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          showAlert(error.response.data.error, "error");
        } else {
          showAlert(
            "An unexpected error occurred while deleting. Please try again.",
            "error"
          );
        }
      }
    };

    return (
      <div className="sub-image-box relative inline-block m-2 shadow-md rounded-md overflow-hidden">
        {image ? (
          <div className="sub-image-preview">
            <img
              className="w-20 h-20"
              src={ image.img_product ? `${process.env.REACT_APP_API_BASE_URL}${image.img_product}`: noimage}
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
          src={ productImages[0]?.img_product ? `${process.env.REACT_APP_API_BASE_URL}${
            mainImage || productImages[0]?.img_product
          }` : noimage}
          alt="Main Preview"
        />
      </div>
      <div className="sub-images-container">{subImageBoxes}</div>
      {alert.message && (
        <AlertWithIcon
          errMsg={alert.message}
          color={alert.color === "bg-red-500" ? "failure" : "success"}
          className={alert.color}
        />
      )}
    </div>
  );
}

export default ImageGalleryEdit;
