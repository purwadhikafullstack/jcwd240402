import React from "react";
import { Badge, Button } from "flowbite-react";  
import { FaCartArrowDown, FaEdit, FaTrash } from "react-icons/fa";

const AdminCardProduct = ({ src, category, name, price, isActive, onEdit, onDelete }) => {
    const defaultImage = "https://t4.ftcdn.net/jpg/02/51/95/53/360_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg"; 

  return (
    <div className="bg-white flex flex-col justify-center items-center  ">
      <div className="w-36 md:w-52 md:h-60  lg:h-80 flex flex-col items-center shadow-card-1 rounded-lg p-4 m-3">
        <div className="">
          <img src={src || defaultImage} alt={`${name} product`} className="w-20 lg:w-40" />
        </div>
        <div className=" ">
          <div>
            <Badge color="purple" className="w-fit">
              {category}
            </Badge>
          </div>
          <h2 className="text-xs font-bold">{name}</h2>
          <p className="text-xs font-semibold">
            <sup>Rp</sup>
            {price}
          </p>
          <div className="text-xs font-semibold">
            Status: {isActive ? 'Active' : 'Inactive'}
          </div>
          <div className="flex justify-between mt-3">
            <Button size="sm" color="primary" onClick={onEdit}>
              <FaEdit className="mr-2" /> Edit
            </Button>
            <Button size="sm" color="danger" onClick={onDelete}>
              <FaTrash className="mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCardProduct;
