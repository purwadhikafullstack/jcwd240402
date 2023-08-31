import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import CardProduct from "../../components/user/card/CardProduct";
import { Pagination } from "flowbite-react";

const ProductPerCategory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const { categoryName } = useParams();

  const currentPagination = searchParams.get("page");

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?page=${currentPagination}&product=&category=${categoryName}`
      )
      .then((res) => {
        setProductData(res.data?.data);
        setTotalPage(Math.ceil(res.data?.pagination?.totalPages));
      });
  }, [categoryName, currentPagination]);

  if (productData.length === 0) {
    return <p></p>;
  }

  function handlePage(page) {
    setCurrentPage(page);
    setSearchParams({ page: page });
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="lg:grid md:grid lg:grid-cols-4 md:grid-cols-4 my-4">
          <div className="flex flex-col gap-2 lg:col-span-1 md:col-span-1">
            <h1 className="font-bold text-lg">{categoryName}</h1>
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${productData[0].Product?.category?.category_img}`}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-center lg:col-span-3 md:col-span-3 ">
            <div className="w-full flex justify-center">
              <Pagination
                layout="navigation"
                showIcons
                currentPage={currentPage}
                onPageChange={handlePage}
                totalPages={totalPage}
              />
            </div>
            <div className="flex flex-wrap justify-center">
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
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default ProductPerCategory;
