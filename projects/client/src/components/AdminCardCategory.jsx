import React, { useState } from "react";
import moment from "moment";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import EditCategoryNameModal from "./Modals/category/ModalEditCategoryName";
import EditCategoryImageModal from "./Modals/category/ModalEditCategoryImage";
import ConfirmDeleteModal from "./Modals/category/ModalDeleteCategory";

const AdminCategoryCard = ({
  src,
  name,
  createdAt,
  handleSuccessfulEdit,
  onDelete,
  id,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    <div className="p-4 border rounded shadow-sm relative h-72 pt-8">
      <img
        src={`http://localhost:8000${src}`}
        alt={name}
        className="w-full h-48 object-cover"
      />
      <h3 className="text-lg font-semibold mt-2">{name}</h3>
      <p className="text-sm text-gray-500">
        Created: {moment(createdAt).format("MMMM D, YYYY")}
      </p>
      <div className="absolute top-1 right-2">
        <button className="p-2 rounded-full" onClick={handleMenuToggle}>
          <IoEllipsisHorizontalCircle />
        </button>

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
        handleSuccessfulEdit={handleSuccessfulEdit}
      />
      <EditCategoryImageModal
        show={showEditImageModal}
        onClose={handleEditImageModalClose}
        categoryId={id}
        handleSuccessfulEdit={handleSuccessfulEdit}
      />
      <ConfirmDeleteModal
        show={showDeleteModal}
        onClose={handleDeleteModalClose}
        categoryId={id}
        handleSuccessfulEdit={handleSuccessfulEdit}
      />
    </div>
  );
};

export default AdminCategoryCard;
