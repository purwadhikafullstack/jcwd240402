import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminCardProduct from "../AdminCardProduct";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/products"
        );
        const data = response.data.data;
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid">
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

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-20">
          {products.map((product) => (
            <AdminCardProduct
              key={product.id}
              src={`http://localhost:8000${product.Image_products[0]?.img_product}`}
              width="200"
              height="200"
              category={product.category.name}
              name={product.name}
              price={product.price}
              isActive={product.is_active}
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
