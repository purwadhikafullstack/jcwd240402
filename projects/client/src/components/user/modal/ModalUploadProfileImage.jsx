import React, { useRef, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import Button from "../../Button";
import { profileUser } from "../../../features/userDataSlice";
import AlertWithIcon from "../../AlertWithIcon";

const ModalUploadProfileImage = () => {
  const userData = useSelector((state) => state.profiler.value);
  const access_token = getCookie("access_token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [image, setImage] = useState(null);
  const [showImage, setShowImage] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const props = { openModal, setOpenModal };

  const editImageProfile = async (e) => {
    e.preventDefault();

    if (!image) {
      setErrMsg("you have to upload an image to submit");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);

    try {
      await axios
        .patch("/user/profile", formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          axios
            .get("/user/profile", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => dispatch(profileUser(res.data.result)));
          setErrMsg("");
          setShowImage(URL.createObjectURL(image));
          navigate("/user/setting");
          setOpenModal(false);
        });
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(err.response?.data?.error);
      }
    }
  };

  const handleFile = (e) => {
    const selectedImage = e.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setImage(selectedImage);
  };

  const inputPhotoRef = useRef();

  return (
    <>
      <button
        className="px-4 py-1 h-8 rounded-lg text-xs w-full bg-blue3 text-white"
        onClick={() => setOpenModal(true)}
        type="button"
      >
        upload image
      </button>
      <Modal
        show={props.openModal}
        size="md"
        popup
        onClose={() => setOpenModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <form onSubmit={editImageProfile}>
              {errMsg ? <AlertWithIcon errMsg={errMsg} /> : null}
              <img
                src={
                  showImage
                    ? showImage
                    : `${process.env.REACT_APP_API_BASE_URL}${userData?.User_detail?.img_profile}`
                }
                alt="upload profile"
              />
              <input
                type="file"
                onChange={handleFile}
                name="image"
                accept="image/png, image/jpg, image/jpeg"
                required
                className="rounded-full m-4 hidden"
                ref={inputPhotoRef}
              />

              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to upload this image?
              </h3>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => inputPhotoRef.current.click()}
                  buttonSize="small"
                  buttonText="Choose"
                  type="button"
                  bgColor="bg-green-400"
                  colorText="text-white"
                  fontWeight="font-semibold"
                />
                <Button
                  buttonSize="small"
                  buttonText="Submit"
                  type="submit"
                  bgColor="bg-blue3"
                  colorText="text-white"
                  fontWeight="font-semibold"
                />
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalUploadProfileImage;
