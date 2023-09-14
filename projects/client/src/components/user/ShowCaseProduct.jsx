import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import CardProduct from "./card/CardProduct";
import { useSearchParams } from "react-router-dom";

import AlertWithIcon from "../AlertWithIcon";
import NavbarFilterPagination from "./navbar/NavbarFilterPagination";
import productNotFound from "../../assets/images/productNotFound.png";
import Loading from "../Loading";

const ShowCaseProduct = ({ perPage }) => {
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const [openAlert, setOpenAlert] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [limitPrice, setLimitPrice] = useState(0);
  const [limitWeight, setLimitWeight] = useState(0);
  const [rangePriceMin, setRangePriceMin] = useState(0);
  const [rangePriceMax, setRangePriceMax] = useState(0);
  const [rangeWeightMin, setRangeWeightMin] = useState(0);
  const [rangeWeightMax, setRangeWeightMax] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPagination = searchParams.get("page");
  const currentPriceMax = searchParams.get("priceMax") || limitPrice;
  const currentPriceMin = searchParams.get("priceMin") || 0;
  const currentWeightMax = searchParams.get("weightMax") || limitWeight;
  const currentWeightMin = searchParams.get("weightMin") || 0;

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?perPage=${perPage}&page=${currentPagination}&product=&category=&&weightMin=${currentWeightMin}&weightMax=${currentWeightMax}&stockMin=&stockMax=&priceMin=${currentPriceMin}&priceMax=${currentPriceMax}`
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
        setTimeout(() => {
          setSearchParams({});
        }, 4000);
      });
    setLoading(false);
  }, [
    currentPage,
    currentPagination,
    currentPriceMax,
    currentPriceMin,
    currentWeightMax,
    currentWeightMin,
    perPage,
    setSearchParams,
  ]);

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
      <div className=" w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="mt-4 flex justify-between py-2 sticky top-14 lg:top-[3.9rem] h-full m-0 z-10 w-full bg-white">
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
      <div className="flex flex-col justify-center">
        {errMsg ? (
          <div className=" flex flex-col justify-center items-center">
            <AlertWithIcon errMsg={errMsg} />
            <img src={productNotFound} alt="" className="w-96" />
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default ShowCaseProduct;
