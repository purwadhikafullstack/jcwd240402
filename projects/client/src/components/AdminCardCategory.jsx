import React, { useState } from "react";
import { FaEdit, FaTrash, IoEllipsisHorizontalCircle } from "react-icons/all";
import { Link } from "react-router-dom";

const AdminCardCategory = ({ src, name, onEdit, onDelete }) => {
    const defaultImage = "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg";
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    return (
        <div className="bg-pink-200 flex flex-col justify-between items-center w-48 h-60 p-6 rounded-lg shadow-card-1 m-3 relative">
            <img
                src={src || defaultImage}
                alt={name}
                className="w-full h-24 object-cover mb-2"
            />

            <button
                className="absolute top-2 right-2 z-10"
                onClick={handleMenuToggle}
            >
                <IoEllipsisHorizontalCircle />
            </button>

            {showMenu && (
                <div className="absolute top-6 right-0 mt-2 bg-white rounded-lg shadow-card-1 border border-gray-200 z-20">
                    <ul className="list-none">
                        <li
                            className="py-2 px-4 cursor-pointer hover:bg-gray-100"
                            onClick={onEdit}
                        >
                            <Link to={`/admin/categories/edit/${name}`}>
                                <FaEdit className="mr-2" /> Edit
                            </Link>
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

            <h2 className="text-xs font-bold py-1 truncate">{name}</h2>
        </div>
    );
};

export default AdminCardCategory;
