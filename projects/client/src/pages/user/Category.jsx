import React, { useEffect, useState } from "react";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import { Link } from "react-router-dom";

const Category = () => {
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    axios.get(`/user/category`).then((res) => setCategoryList(res.data.result));
  }, []);
  console.log(categoryList);

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold mt-4 text-xl">All Categories</h1>
          <div className="grid grid-cols-2 gap-4 relative z-0">
            {categoryList.map((list) => (
              <div
                key={list.id}
                className="w-full h-32 relative overflow-hidden"
              >
                <Link
                  to={`/product/product-category/${list.name}`}
                  className=" absolute inset-0 w-full h-full flex items-center justify-center bg-opacity-50 bg-gray-800 hover:bg-opacity-70 text-white font-bold z-10 transition-all duration-200 ease-in"
                >
                  {list.name}
                </Link>
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${list.category_img}`}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in "
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default Category;
