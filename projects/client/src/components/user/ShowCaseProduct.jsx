import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import CardProduct from "./card/CardProduct";
import { Card, Pagination } from "flowbite-react";

const ShowCaseProduct = () => {
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?page=${currentPage}&product=&category=`
      )
      .then((res) => {
        setProductData(res.data?.data);
        setTotalPage(Math.ceil(res.data?.pagination?.totalPages));
      });
  }, [currentPage]);

  if (productData.length === 0) {
    return <p></p>;
  }

  function handlePage(page) {
    setCurrentPage(page);
  }
  return (
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
  );
};

export default ShowCaseProduct;