import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import CardProduct from "./card/CardProduct";
import { Pagination } from "flowbite-react";
import { useSearchParams } from "react-router-dom";
import { TbZoomMoney } from "react-icons/tb";
import { RiScales2Fill } from "react-icons/ri";

import SlideOverFilter from "./slide/SlideOverFilter";

const ShowCaseProduct = () => {
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

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

  console.log(currentPriceMin);
  console.log(currentPriceMax);
  console.log(currentWeightMin);
  console.log(currentWeightMax);

  useEffect(() => {
    axios
      .get(
        `/user/warehouse-stock/filter?perPage=20&page=${currentPagination}&product=&category=&&weightMin=${currentWeightMin}&weightMax=${currentWeightMax}&stockMin=&stockMax=&priceMin=${currentPriceMin}&priceMax=${currentPriceMax}`
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
      })
      .catch((error) => setSearchParams({ page: 1 }));
  }, [
    currentPagination,
    currentPriceMax,
    currentPriceMin,
    currentWeightMax,
    currentWeightMin,
    setSearchParams,
  ]);

  if (productData.length === 0) {
    return <p></p>;
  }

  function handlePage(page) {
    setCurrentPage(page);
    setSearchParams({
      page: page,
      priceMin: currentPriceMin,
      priceMax: currentPriceMax,
      weightMax: currentWeightMax,
      weightMin: currentPriceMin,
    });
  }

  function handleResetFilter() {
    setSearchParams();
  }

  return (
    <div>
      <div className="mt-4 flex justify-between py-2 sticky top-14 lg:top-[3.9rem] h-full m-0 z-10 w-full bg-white">
        <div className="flex justify-center items-center">
          <SlideOverFilter
            rangePriceMin={rangePriceMin}
            rangePriceMax={rangePriceMax}
            rangeWeightMin={rangeWeightMin}
            rangeWeightMax={rangeWeightMax}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
            limitPrice={limitPrice}
            limitWeight={limitWeight}
          />
          {currentPriceMin && currentPriceMax ? (
            <p className="flex text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2">
              <span>
                <TbZoomMoney className="text-xl" />
              </span>
              from {currentPriceMin} to {currentPriceMax}
            </p>
          ) : null}
          {currentWeightMin && currentWeightMax ? (
            <p className="flex text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2">
              <span>
                <RiScales2Fill className="text-xl" />
              </span>
              from {currentWeightMin} to {currentWeightMax}
            </p>
          ) : null}
          {(currentPriceMin && currentPriceMax) ||
          (currentWeightMin && currentWeightMax) ? (
            <button
              onClick={handleResetFilter}
              className="text-center flex text-xs lg:text-sm justify-start items-center px-3 py-1 rounded-full w-fit gap-2 border-2"
            >
              reset all filter
            </button>
          ) : null}
        </div>
        <Pagination
          layout="navigation"
          showIcons
          currentPage={currentPage}
          onPageChange={handlePage}
          totalPages={totalPage}
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
      </div>
    </div>
  );
};

export default ShowCaseProduct;
