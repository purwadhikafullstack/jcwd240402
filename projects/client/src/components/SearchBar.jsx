import React, { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { Badge } from "flowbite-react";

import emptyImage from "../assets/images/emptyImage.jpg";

const SearchBar = ({
  width = "w-full",
  height,
  rounded,
  position,
  bgColor,
  margin,
}) => {
  const navigate = useNavigate();
  const [searchProduct, setSearchProduct] = useState("");
  const [productList, setProductList] = useState([]);
  const [errMsg, setErrMsg] = useState();

  const handleSearch = async () => {
    try {
      await axios
        .get(
          `/user/warehouse-stock/filter?page=1&product=${searchProduct}&category=&warehouseName=&weightMin=&weightMax=&stockMin=&stockMax=&priceMin=&priceMax=`
        )
        .then((res) => {
          setSearchProduct("");
          if (searchProduct) {
            setSearchProduct("");
            navigate(`/product/${searchProduct}`);
            return;
          }
          setSearchProduct("");
          navigate("/all-product");
        })
        .catch((error) => {
          setErrMsg(error.response?.data?.message);
        });
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.message);
        setSearchProduct("");
      }
    }
  };

  useEffect(() => {
    axios
      .get(`/user/products?searchProduct=${searchProduct}`)
      .then((res) => setProductList(res.data.result))
      .catch((error) => {
        setErrMsg(error.response?.data?.message);
      });
  }, [searchProduct]);

  return (
    <>
      <div className="relative ">
        <form action="">
          <input
            type="search"
            value={searchProduct}
            id="search"
            className={`block ${margin} ${width} ${height} p-2.5 text-sm text-gray-900 border border-gray-300 ${rounded} bg-gray-50`}
            placeholder="Search Product"
            onChange={(e) => {
              setSearchProduct(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
          />
          <span
            className={`absolute ${position} md:left-[560px] lg:left-[335px] top-1/2 transform -translate-y-1/2 text-lg`}
          >
            <button
              className={`flex justify-center items-center w-12 h-7 ${bgColor} rounded-lg`}
              type="button"
              onClick={handleSearch}
            >
              <BiSearch className="text-base_grey" />
            </button>
          </span>
          <div
            className={`absolute w-full mt-1 bg-white ${
              searchProduct ? "rounded-lg border-b-2 shadow-card-1" : null
            }`}
          >
            {searchProduct && productList ? (
              productList.length > 0 ? (
                productList.slice(0, 5).map((item, idx) => (
                  <Link
                    key={idx}
                    className="p-2 relative gap-2 flex border-t-2 "
                    to={`/product/${item.name}`}
                    onClick={() => setSearchProduct("")}
                  >
                    <img
                      src={
                        item.img
                          ? `${process.env.REACT_APP_API_BASE_URL}${item.img}`
                          : emptyImage
                      }
                      alt={`search product ${item.name}`}
                      className="w-20 rounded-md"
                    />
                    <div className="flex flex-col">
                      <h1 className="text-base font-semibold">{item.name}</h1>
                      <Badge color="purple" className="mt-1 w-fit">
                        {item.category}
                      </Badge>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-2 relative gap-2 flex border-t-2">
                  <div className="flex flex-col">
                    <h1 className="text-xs text-grayText font-semibold">
                      Product not found
                    </h1>
                  </div>
                </div>
              )
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
};

export default SearchBar;
