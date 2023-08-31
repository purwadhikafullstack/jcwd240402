import React, { useState } from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Badge } from "flowbite-react";
import axios from "../../../api/axios";

const AdminCardProduct = ({
  src,
  category,
  name,
  price,
  isActive,
  onEdit,
  onDelete,
  setActive,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const toggleProductStatus = async () => {
    try {
      await axios.patch(`/admin/product/status/${name}`);
      setActive(!isActive);
      setShowMenu(false);
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  return (
    <div className="bg-white flex flex-col justify-between items-start w-48 h-60 p-6 rounded-lg shadow-card-1 m-3 relative">
      <img
        src={src}
        alt={`${name} product`}
        className="w-full h-24 object-cover mb-2"
      />

      <button
        className="absolute top-2 right-2 z-10"
        onClick={handleMenuToggle}
      >
        <IoEllipsisHorizontalCircle />
      </button>

      {showMenu && (
        <div
          className="absolute top-6 right-0 bg-white rounded-lg shadow-card-1 border border-gray-200 z-20"
          style={{ width: "150px" }}
        >
          <ul className="list-none">
            <li
              className="py-2 px-4 cursor-pointer hover:bg-gray-100"
              onClick={onEdit}
            >
              <Link to={`/admin/products/edit/${encodeURIComponent(name)}`}>
                <FaEdit className="mr-2" /> Edit
              </Link>
            </li>
            <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
              <button onClick={toggleProductStatus}>
                {isActive ? (
                  <>
                    <FaToggleOn className="mr-2" /> Activate
                  </>
                ) : (
                  <>
                    <FaToggleOff className="mr-2" /> Inactivate
                  </>
                )}
              </button>
            </li>
            <li
              className="py-2 px-4 cursor-pointer hover:bg-gray-100"
              onClick={onDelete}
            >
              <FaTrash className="mr-2" /> Delete
            </li>
          </ul>
        </div>
      )}

      <div className="flex flex-col justify-start items-start">
        <div className="py-1">
          <Badge color="purple" className="w-fit">
            {category}
          </Badge>
        </div>
        <h2 className="text-xs font-bold py-1 truncate">{name}</h2>
        <div className="text-sm font-semibold py-1">
          {price.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
        <div className="text-xs font-semibold py-1">
          Status:{" "}
          <span className={`${isActive ? "text-green-500" : "text-red-500"}`}>
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminCardProduct;
