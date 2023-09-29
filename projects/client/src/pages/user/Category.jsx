import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillArrowRightCircleFill } from "react-icons/bs";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import emptyImage from "../../assets/images/emptyImage.jpg";

const Category = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get(`/user/category`).then((res) => {
      setCategoryList(res.data.result);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="border-2 w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb
        crumbs={[{ title: ["Category"], link: "/product-category" }]}
      />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="flex flex-col gap-4">
          {categoryList == false ? (
            <h1 className="font-bold mt-4 text-xl">Empty Categories</h1>
          ) : (
            <div className="flex justify-between items-end">
              <h1 className="font-bold mt-4 text-xl">All Categories</h1>
              <Link
                to="/all-categories"
                className="flex items-center text-xs md:text-sm lg:text-sm hover:underline hover:decoration-black"
              >
                see more category
                <span className="ml-2 text-blue3">
                  <BsFillArrowRightCircleFill />
                </span>
              </Link>
            </div>
          )}
          {categoryList.length <= 8 ? (
            <div className="grid grid-cols-2 gap-4 relative z-0 mb-4">
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
                    src={
                      list.category_img
                        ? `${process.env.REACT_APP_API_BASE_URL}${list.category_img}`
                        : emptyImage
                    }
                    alt={`${list.name}`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in "
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 relative z-0 mb-4">
              {categoryList.slice(0, 8).map((list) => (
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
                    src={
                      list.category_img
                        ? `${process.env.REACT_APP_API_BASE_URL}${list.category_img}`
                        : emptyImage
                    }
                    alt={`${list.name}`}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in "
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default Category;
