import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import CardProduct from "../../components/user/card/CardProduct";
import { Pagination } from "flowbite-react";

const ProductPerCategory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [productData, setProductData] = useState([]);
  const { categoryName } = useParams();

  console.log(categoryName);

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?page=${currentPage}&product=&category=${categoryName}`
      )
      .then((res) => setProductData(res.data?.data));
  }, [categoryName, currentPage]);

  if (productData.length === 0) {
    return <p></p>;
  }

  function handlePage(page) {
    setCurrentPage(page);
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="lg:flex md:flex my-4">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-lg">{categoryName}</h1>
            <img
              src={`${process.env.REACT_APP_API_BASE_URL}${productData[0].Product?.category?.category_img}`}
              alt=""
            />
          </div>
          <div className="flex flex-col justify-center">
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
            <div className="w-full flex justify-center">
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
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default ProductPerCategory;
