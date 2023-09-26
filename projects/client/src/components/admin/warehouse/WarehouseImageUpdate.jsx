import React, { useState } from "react";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import { useParams } from "react-router-dom";

const ImageUpload = ({ currentImage, showImage, setShowImage }) => {
  const [image, setImage] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { warehouseName } = useParams();
  const access_token = getCookie("access_token");

  const handleFile = (e) => {
    const selectedImage = e.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setImage(selectedImage);
  };

  const handleUpdateImage = async (e) => {
    e.preventDefault();
    if (!image) {
      setErrMsg("you have to upload an image to submit");
      return;
    }
    const formData = new FormData();
    formData.append("file", image);
    try {
      await axios
        .patch(`/warehouse/image/${warehouseName}`, formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setSuccessMsg("image update successful");
          setErrMsg("");
          setTimeout(() => {
            setSuccessMsg("");
          }, 3000);
        })
        .catch((err) => {
          setErrMsg(err.response?.data?.error);
        });
    } catch (error) {
      setSuccessMsg("");
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.error);
      }
    }
  };

  return (
    <div className="md:col-span-1 lg:col-span-1 h-96 flex flex-col justify-center items-center mt-10">
      <img
        src={
          showImage
            ? showImage
            : `${process.env.REACT_APP_API_BASE_URL}${currentImage}`
        }
        alt=""
        className="w-1/2"
      />
      <div className="flex flex-col items-center">
        <input
          type="file"
          onChange={handleFile}
          name="image"
          accept="image/png, image/jpg, image/jpeg"
          className="rounded-full m-4 border-2"
        />
        <button
          onClick={handleUpdateImage}
          className="bg-blue3 text-white text-sm font-bold px-4 py-2 rounded-lg"
        >
          Change Image
        </button>
        {errMsg && <div className="text-red-500 mt-2">{errMsg}</div>}
        {successMsg && <div className="text-green-500 mt-2">{successMsg}</div>}
      </div>
    </div>
  );
};

export default ImageUpload;
