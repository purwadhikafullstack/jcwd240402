import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { IoEllipsisHorizontalCircle } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Badge } from "flowbite-react";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import noimage from "../../../assets/images/noimagefound.jpg";
import { useSelector } from "react-redux";
import { rupiahFormat } from "../../../utils/formatter";

const AdminCardProduct = ({ product, onEdit, onDelete, setActive }) => {
  const access_token = getCookie("access_token");
  const [showMenu, setShowMenu] = useState(false);
  const role_id = useSelector((state) => state.profilerAdmin.value.role_id);
  const dropdownRef = useRef(null);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const toggleProductStatus = async () => {
    try {
      await axios.patch(
        `/admin/product/status/${product.name}`,
        {},
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      setActive(!product.is_active);
      setShowMenu(false);
    } catch (error) {
      console.error("Error toggling product status:", error);
    }
  };

  return (
    <div className="bg-white flex flex-col justify-between items-start w-48 h-60 p-6 rounded-lg shadow-card-1 m-3 relative">
      <img
        src={
          product.Image_products[0]?.img_product
            ? `${process.env.REACT_APP_API_BASE_URL}${product.Image_products[0]?.img_product}`
            : noimage
        }
        alt={`${product.name} product`}
        className="w-full h-24 object-cover mb-2"
      />
      {role_id === 1 && (
        <button
          className="absolute top-2 right-2 z-0"
          onClick={handleMenuToggle}
        >
          <IoEllipsisHorizontalCircle />
        </button>
      )}
      {showMenu && (
        <div
          ref={dropdownRef}
          className=" absolute top-6 right-0 bg-white rounded-lg shadow-card-1 border-gray-200 z-10"
          style={{ width: "150px" }}
        >
          <ul className="list-none">
            <li
              className="py-2 px-4 cursor-pointer hover:bg-gray-100 z-20"
              onClick={onEdit}
            >
              <Link
                to={`/admin/products/edit/${encodeURIComponent(product.name)}`}
              >
                <FaEdit className="mr-2" /> Edit
              </Link>
            </li>
            <li className="py-2 px-4 cursor-pointer hover:bg-gray-100">
              <button onClick={toggleProductStatus}>
                {product.is_active ? (
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
            {product.category.name}
          </Badge>
        </div>
        <h2 className="text-xs font-bold py-1 truncate">{product.name}</h2>
        <div className="text-sm font-semibold py-1">
          {rupiahFormat(product.price)}
        </div>
        <div className="text-xs font-semibold py-1">
          Status:{" "}
          <span
            className={`${
              product.is_active ? "text-green-500" : "text-red-500"
            }`}
          >
            {product.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminCardProduct;
