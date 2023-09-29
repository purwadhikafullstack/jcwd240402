import React, { useState } from "react";
import moment from "moment";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import EditCategoryNameModal from "../../modal/category/ModalEditCategoryName";
import EditCategoryImageModal from "../../modal/category/ModalEditCategoryImage";
import ConfirmDeleteModal from "../../modal/category/ModalDeleteCategory";
import noimage from "../../../assets/images/noimagefound.jpg";
import { useSelector } from "react-redux";

const AdminCategoryCard = ({
  src,
  name,
  createdAt,
  handleSuccessfulEdit,
  id,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const role_id = useSelector((state) => state.profilerAdmin.value.role_id);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleEditNameModalOpen = () => {
    setShowEditNameModal(true);
    setShowMenu(false);
  };

  const handleEditNameModalClose = () => {
    setShowEditNameModal(false);
  };

  const handleEditImageModalOpen = () => {
    setShowEditImageModal(true);
    setShowMenu(false);
  };

  const handleEditImageModalClose = () => {
    setShowEditImageModal(false);
  };

  const handleDeleteModalOpen = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="p-4 border rounded shadow-lg relative h-72 pt-8">
      <img
        src={src ? `${process.env.REACT_APP_API_BASE_URL}${src}` : noimage}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <h3 className="text-lg font-semibold mt-2">{name}</h3>
      <p className="text-sm text-gray-500">
        Created: {moment(createdAt).format("MMMM D, YYYY")}
      </p>
      <div className="absolute top-1 right-2">
        {role_id === 1 && (
          <button className="p-2 rounded-full" onClick={handleMenuToggle}>
            <IoEllipsisHorizontalCircle />
          </button>
        )}
        {showMenu && (
          <div className="absolute top-full right-0  bg-white rounded-lg shadow-card-1 border border-gray-200 z-20 w-48 max-h-40 overflow-y-auto">
            <ul className="list-none">
              <li
                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                onClick={handleEditNameModalOpen}
              >
                Edit Name
              </li>
              <li
                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                onClick={handleEditImageModalOpen}
              >
                Edit Image
              </li>
              <li
                className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                onClick={handleDeleteModalOpen}
              >
                Delete
              </li>
            </ul>
          </div>
        )}
      </div>
      <EditCategoryNameModal
        show={showEditNameModal}
        onClose={handleEditNameModalClose}
        categoryId={id}
        categoryName={name}
        handleSuccessfulEdit={handleSuccessfulEdit}
      />
      <EditCategoryImageModal
        show={showEditImageModal}
        onClose={handleEditImageModalClose}
        categoryId={id}
        categoryName={name}
        handleSuccessfulEdit={handleSuccessfulEdit}
      />
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={handleDeleteModalClose}
        categoryId={id}
        categoryName={name}
        handleSuccessfulEdit={handleSuccessfulEdit}
      />
    </div>
  );
};

export default AdminCategoryCard;
