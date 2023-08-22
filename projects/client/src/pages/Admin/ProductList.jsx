import React from "react";
import AdminCardProduct from "../../components/AdminCardProduct";
import SidebarAdminDesktop from "../../components/SidebarAdminDesktop";

const mockProducts = [
  {
    src: "",
    category: "Living Room",
    name: "Sofa Set",
    price: "15000",
    isActive: true,
  },
  {
    src: "",
    category: "Bedroom",
    name: "Queen-sized Bed",
    price: "10000",
    isActive: true,
  },
  {
    src: "",
    category: "Kitchen",
    name: "Dining Table",
    price: "7000",
    isActive: true,
  },
  {
    src: "",
    category: "Office",
    name: "Study Desk",
    price: "4000",
    isActive: true,
  },
  {
    src: "",
    category: "Living Room",
    name: "Coffee Table",
    price: "3000",
    isActive: true,
  },
  {
    src: "",
    category: "Bedroom",
    name: "Nightstand",
    price: "1500",
    isActive: false,
  },
  {
    src: "",
    category: "Office",
    name: "Office Chair",
    price: "2500",
    isActive: true,
  },
  {
    src: "",
    category: "Kitchen",
    name: "Kitchen Island",
    price: "12000",
    isActive: true,
  },
];

const ProductList = () => {
  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdminDesktop />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center mb-5">
          <input
            type="text"
            placeholder="Search Product"
            className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mr-4"
          />
          <select className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mr-4">
            <option value="all">All Categories</option>
            <option value="living-room">Living Room</option>
            <option value="bedroom">Bedroom</option>
            <option value="kitchen">Kitchen</option>
            <option value="office">Office</option>
          </select>
          <select className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm">
            <option value="all">All Prices</option>
            <option value="0-1000">0 - 1,000</option>
            <option value="1000-5000">1,000 - 5,000</option>
            <option value="5000-10000">5,000 - 10,000</option>
            <option value="10000+">10,000+</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {mockProducts.map((product, index) => (
            <AdminCardProduct
              key={index}
              {...product}
              onEdit={() => console.log("Edit product:", product.name)}
              onDelete={() => console.log("Delete product:", product.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
