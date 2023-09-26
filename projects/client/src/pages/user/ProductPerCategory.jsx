import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { GrLinkTop } from "react-icons/gr";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import CardProduct from "../../components/user/card/CardProduct";
import productNotFound from "../../assets/images/productNotFound.png";
import { useDispatch } from "react-redux";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { profileUser } from "../../features/userDataSlice";
import NavbarFilterPagination from "../../components/user/navbar/NavbarFilterPagination";
import AlertWithIcon from "../../components/AlertWithIcon";
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import productpercategorynotfound from "../../assets/images/productpercategorynotfound.png";
import emptyImage from "../../assets/images/emptyImage.jpg";

const ProductPerCategory = () => {
  const { categoryName } = useParams();

  const [errMsg, setErrMsg] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const [display, setDisplay] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");

  const dispatch = useDispatch();

  const [newAccessToken, setNewAccessToken] = useState("");
  const [category, setCategory] = useState([]);

  const [limitPrice, setLimitPrice] = useState(0);
  const [limitWeight, setLimitWeight] = useState(0);
  const [rangePriceMin, setRangePriceMin] = useState(0);
  const [rangePriceMax, setRangePriceMax] = useState(0);
  const [rangeWeightMin, setRangeWeightMin] = useState(0);
  const [rangeWeightMax, setRangeWeightMax] = useState(0);

  const currentPagination = searchParams.get("page");
  const currentPriceMax = searchParams.get("priceMax") || limitPrice;
  const currentPriceMin = searchParams.get("priceMin") || 0;
  const currentWeightMax = searchParams.get("weightMax") || limitWeight;
  const currentWeightMin = searchParams.get("weightMin") || 0;

  useEffect(() => {
    if (access_token && refresh_token) {
      axios
        .get("/user/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => dispatch(profileUser(res.data.result)))
        .catch((error) => {
          if (
            error.response?.data?.message === "Invalid token" &&
            error.response?.data?.error?.name === "TokenExpiredError"
          ) {
            axios
              .get("/user/auth/keep-login", {
                headers: { Authorization: `Bearer ${refresh_token}` },
              })
              .then((res) => {
                setNewAccessToken(res.data?.accessToken);
                setCookie("access_token", newAccessToken, 1);
              });
          }
        });
    }
  }, [access_token, dispatch, newAccessToken, refresh_token]);

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?perPage=10&page=${currentPagination}&product=&category=${categoryName}&&weightMin=${currentWeightMin}&weightMax=${currentWeightMax}&stockMin=&stockMax=&priceMin=${currentPriceMin}&priceMax=${currentPriceMax}`
      )
      .then((res) => {
        setProductData(res.data?.data);
        setTotalPage(Math.ceil(res.data?.pagination?.totalPages));
        setRangePriceMin(res.data?.pagination?.rangePriceMin);
        setRangePriceMax(res.data?.pagination?.rangePriceMax);
        setRangeWeightMin(res.data?.pagination?.rangeWeightMin);
        setRangeWeightMax(res.data?.pagination?.rangeWeightMax);
        setLimitPrice(res.data?.pagination?.limitPriceMax);
        setLimitWeight(res.data?.pagination?.limitWeightMax);
        setErrMsg("");
        setLoading(false);
      })
      .catch((error) => {
        setErrMsg("product not found");
        setLoading(false);
        setTimeout(() => {
          setSearchParams({});
        }, 4000);
      });
  }, [
    categoryName,
    currentPagination,
    currentPriceMax,
    currentPriceMin,
    currentWeightMax,
    currentWeightMin,
    setSearchParams,
  ]);

  useEffect(() => {
    axios
      .get(`/user/products/category?category=${categoryName}`)
      .then((res) => {
        setDisplay(res.data?.data);
      })
      .catch((error) => {
        setErrMsg("Category Product is not found");
      });
  }, [categoryName, currentPagination]);

  const imageDisplay = display.map((item) => {
    return {
      banner: item?.Image_products[2]?.img_product
        ? item?.Image_products[2]?.img_product
        : emptyImage,
      name: item?.name,
      price: item?.price,
      category: item?.category?.name,
    };
  });

  const categoryImage = productData[0]?.category?.category_img;

  function handlePage(page) {
    setCurrentPage(page);
    const { ...otherParams } = Object.fromEntries(searchParams);
    setSearchParams({
      ...otherParams,
      page: page,
    });
  }

  function handleResetFilter() {
    setSearchParams({});
    setCurrentPage(1);
  }

  if (loading) {
    return (
      <div className="border-2 w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div
    // id="back-to-the-top"
    >
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb
        crumbs={[
          { title: ["Category"], link: "/product-category" },
          {
            title: ["Product per Category"],
            link: `/product/product-category/${categoryName}`,
          },
        ]}
      />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        {imageDisplay.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-screen">
            <img
              src={productpercategorynotfound}
              alt="product not found"
              className="w-96"
            />
            <h1 className="font-bold text-grayText text-xs">
              product not found
            </h1>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-2 ">
              <h1 className="font-bold text-lg">{categoryName}</h1>
              <div className="flex flex-col justify-center items-center md:gap-4 md:grid md:grid-cols-2 lg:gap-4 lg:grid lg:grid-cols-2">
                <div className="mb-4 lg:mb-0 md:mb-0 lg:col-span-1">
                  <img
                    src={
                      categoryImage
                        ? `${process.env.REACT_APP_API_BASE_URL}${categoryImage}`
                        : emptyImage
                    }
                    alt="category"
                    className="md:w-full"
                  />
                </div>
                <div className="lg:col-span-1 grid grid-cols-2 grid-rows-1">
                  <>
                    <img
                      src={
                        imageDisplay[7]?.banner
                          ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[7]?.banner}`
                          : emptyImage
                      }
                      alt="display product"
                      className="row-span-1 col-span-1"
                    />
                    <img
                      src={
                        imageDisplay[5]?.banner
                          ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[5]?.banner}`
                          : emptyImage
                      }
                      alt="display product"
                      className="row-span-1 col-span-1"
                    />
                    <img
                      src={
                        imageDisplay[10]?.banner
                          ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[10]?.banner}`
                          : emptyImage
                      }
                      alt="display product"
                      className="row-span-1 col-span-1"
                    />
                    <img
                      src={
                        imageDisplay[6]?.banner
                          ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[6]?.banner}`
                          : emptyImage
                      }
                      alt="display product"
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
                  src={
                    imageDisplay[8]?.banner
                      ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[8]?.banner}`
                      : emptyImage
                  }
                  alt="display product"
                />
                <img
                  src={
                    imageDisplay[11]?.banner
                      ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[11]?.banner}`
                      : emptyImage
                  }
                  alt="display product"
                />
                <img
                  src={
                    imageDisplay[2]?.banner
                      ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[2]?.banner}`
                      : emptyImage
                  }
                  alt="display product"
                />
                <img
                  src={
                    imageDisplay[10]?.banner
                      ? `${process.env.REACT_APP_API_BASE_URL}${imageDisplay[10]?.banner}`
                      : emptyImage
                  }
                  alt="display product"
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
            <div className="mt-4 py-2 flex justify-between sticky top-14 lg:top-[3.9rem] h-full m-0 z-10 w-full bg-white">
              <NavbarFilterPagination
                rangePriceMin={rangePriceMin}
                rangePriceMax={rangePriceMax}
                rangeWeightMin={rangeWeightMin}
                rangeWeightMax={rangeWeightMax}
                setSearchParams={setSearchParams}
                searchParams={searchParams}
                limitPrice={limitPrice}
                limitWeight={limitWeight}
                currentPriceMax={currentPriceMax}
                currentPriceMin={currentPriceMin}
                currentWeightMax={currentWeightMax}
                currentWeightMin={currentWeightMin}
                currentPage={currentPage}
                totalPage={totalPage}
                handlePage={handlePage}
                handleResetFilter={handleResetFilter}
                setCurrentPage={setCurrentPage}
              />
            </div>
            <div className="flex flex-col justify-center  mb-4">
              <div className=" lg:h-[42rem] md:h-[72rem]  mt-4 mb-4 md:mb-0 lg:mb-0">
                <div className="flex flex-wrap justify-center ">
                  {errMsg || productData.length === 0 ? (
                    <div className=" flex flex-col justify-center items-center">
                      <AlertWithIcon errMsg={errMsg || "product not found"} />
                      <img src={productNotFound} alt="" className="w-96" />
                      <h1 className="text-xs font-bold text-grayText">
                        Please reset your filter to find another products
                      </h1>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center">
                      {productData.map((productItem) => (
                        <CardProduct
                          src={
                            productItem?.Image_products[0]?.img_product
                              ? `${process.env.REACT_APP_API_BASE_URL}${productItem?.Image_products[0]?.img_product}`
                              : emptyImage
                          }
                          category={productItem?.category?.name}
                          name={productItem?.name}
                          desc={productItem?.description}
                          price={productItem?.price}
                          key={productItem.id}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* <a
                  href="#back-to-the-top"
                  className="fixed bottom-16 right-4 bg-gray-300 w-16 h-16 flex justify-center items-center rounded-full"
                >
                  <GrLinkTop />
                </a> */}
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
