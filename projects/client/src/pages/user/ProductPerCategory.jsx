import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GrLinkTop } from "react-icons/gr";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import CardProduct from "../../components/user/card/CardProduct";
import { Pagination } from "flowbite-react";
import SlideOverFilter from "../../components/user/slide/SlideOverFilter";
import productNotFound from "../../assets/images/productNotFound.png";

const ProductPerCategory = () => {
  const [errMsg, setErrMsg] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const [display, setDisplay] = useState([]);
  const { categoryName } = useParams();

  const currentPagination = searchParams.get("page");

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?perPage=20&page=&product=&category=${categoryName}`
      )
      .then((res) => {
        setDisplay(res.data?.data);
      })
      .catch((error) => {
        console.log(error.response);
        setErrMsg("Category Product is not found");
      });
  }, [categoryName, currentPagination]);

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?perPage=9&page=${currentPagination}&product=&category=${categoryName}`
      )
      .then((res) => {
        setProductData(res.data?.data);
        setTotalPage(Math.ceil(res.data?.pagination?.totalPages));
      })
      .catch((error) => {
        setSearchParams({ page: 1 });
      });
  }, [categoryName, currentPagination, setSearchParams]);

  function handlePage(page) {
    setCurrentPage(page);
    setSearchParams({ page: page });
  }

  const imageDisplay = display.map((item) => {
    return {
      banner: item?.Product?.Image_products[3]?.img_product,
      name: item?.Product?.name,
      price: item?.Product?.price,
    };
  });
  console.log(imageDisplay);
  const categoryImage = productData[0]?.Product?.category?.category_img;

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div
        className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32"
        id="back-to-the-top"
      >
        {imageDisplay.length === 0 && errMsg ? (
          <div className="w-full h-full flex flex-col justify-center items-center ">
            <img src={productNotFound} alt="" className="w-1/2 lg:w-1/3" />
            <p>{errMsg}</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold text-lg">{categoryName}</h1>
              <div className="flex flex-col justify-center items-center md:gap-4 md:grid md:grid-cols-2 lg:gap-4 lg:grid lg:grid-cols-2">
                <div className="mb-4 lg:mb-0 md:mb-0 lg:col-span-1">
                  <img
                    src={`${process.env.REACT_APP_API_BASE_URL}${categoryImage}`}
                    alt=""
                    className="md:w-full"
                  />
                </div>
                <div className="lg:col-span-1 grid grid-cols-2 grid-rows-1">
                  <>
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[1]?.banner}`}
                      alt=""
                      className="row-span-1 col-span-1"
                    />
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[5]?.banner}`}
                      alt=""
                      className="row-span-1 col-span-1"
                    />
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[10]?.banner}`}
                      alt=""
                      className="row-span-1 col-span-1"
                    />
                    <img
                      src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[6]?.banner}`}
                      alt=""
                      className="row-span-1 col-span-1"
                    />
                  </>
                </div>
              </div>
              <h2 className="font-bold">Our {categoryName} Proudly Product</h2>
              <h4 className="text-xs text-justify text-gray-400">
                FURNIFOR, our reputable company, takes immense pride in its
                commitment to delivering furniture of the utmost quality,
                meticulously crafted to meet the highest standards, all while
                ensuring that our prices remain accessible to a wide range of
                customers.
              </h4>
              <div className="grid grid-cols-4">
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[1]?.banner}`}
                  alt=""
                  className=""
                />
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[11]?.banner}`}
                  alt=""
                  className=""
                />
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[2]?.banner}`}
                  alt=""
                  className=""
                />
                <img
                  src={`${process.env.REACT_APP_API_BASE_URL}${imageDisplay[11]?.banner}`}
                  alt=""
                  className=""
                />
              </div>
              <h2 className="font-bold">Colors for your comfort in life</h2>
              <h4 className="text-xs text-justify text-gray-400">
                Here at FURNIFOR, we specialize in offering a delightful range
                of home goods in soothing, soft hues that are designed to create
                a cozy and inviting ambiance, making your home a place where
                you'll truly feel at ease
              </h4>
            </div>
            <div className="mt-4 py-2 sticky top-14 lg:top-[3.9rem] h-full m-0 z-10 w-full bg-white">
              <SlideOverFilter />
            </div>
            <div className="flex flex-col justify-center  ">
              <div className="w-full flex justify-center lg:hidden md:hidden">
                <Pagination
                  layout="navigation"
                  showIcons
                  currentPage={currentPage}
                  onPageChange={handlePage}
                  totalPages={totalPage}
                />
              </div>
              <div className=" lg:h-[42rem] md:h-[72rem]  mt-4 mb-4 md:mb-0 lg:mb-0">
                <div className="flex flex-wrap justify-center ">
                  {productData.map((productItem) => (
                    <CardProduct
                      src={`${process.env.REACT_APP_API_BASE_URL}${productItem?.Product?.Image_products[0]?.img_product}`}
                      category={productItem.Product?.category?.name}
                      name={productItem.Product?.name}
                      desc={productItem.Product?.description}
                      price={productItem.Product?.price}
                      key={productItem.id}
                    />
                  ))}
                </div>

                <a
                  href="#back-to-the-top"
                  className="fixed bottom-16 right-4 bg-gray-300 w-16 h-16 flex justify-center items-center rounded-full"
                >
                  <GrLinkTop />
                </a>
              </div>

              <div className="w-full justify-center hidden lg:flex md:flex mb-4">
                <Pagination
                  layout="navigation"
                  showIcons
                  currentPage={currentPage}
                  onPageChange={handlePage}
                  totalPages={totalPage}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default ProductPerCategory;
