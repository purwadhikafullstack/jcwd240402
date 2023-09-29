/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import { getCookie, getLocalStorage } from "../../utils/tokenSetterGetter";

import wishlistempty from "../../assets/images/wishlistempty.png";
import CardWishlist from "../../components/user/card/CardWishlist";
import withAuthUser from "../../components/user/withAuthUser";
import loadingfurnifor from "../../assets/icons/iconfurnifor.png";

const AllWishlist = () => {
  const [errMsg, setErrMsg] = useState("");

  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");
  const userData = useSelector((state) => state.profiler.value);

  const [list, setList] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [limit, setLimit] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  const wishlistData = useSelector((state) => state.wishlister.value);

  useEffect(() => {
    getList();
  }, [lastId, limit]);

  const getList = async () => {
    if (!access_token || !refresh_token || userData.role_id !== 3) {
      return;
    }

    try {
      const response = await axios.get(
        `/user/show-wishlist?lastId=${lastId}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const newList = response.data.result;
      setList([...list, ...newList]);
      setTempId(response.data.lastId);
      setHasMore(response.data.hasMore);
    } catch (error) {
      setErrMsg(error.response.data.message);
    }
  };

  const fetchMore = () => {
    setTimeout(() => {
      setLastId(tempId);
    }, 1000);
  };

  const wishlistMap = list.map((item) => ({
    src: item.Warehouse_stock?.Product?.Image_products[0].img_product,
    category: item.Warehouse_stock?.Product?.category?.name,
    name: item.Warehouse_stock?.Product?.name,
    desc: item.Warehouse_stock?.Product?.description,
    price: item.Warehouse_stock?.Product?.price,
    stock: item.Warehouse_stock?.product_stock,
    weight: item.Warehouse_stock?.Product?.weight,
    id: item.Warehouse_stock?.id,
    date: item.createdAt,
  }));

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb crumbs={[{ title: ["Wishlist"], link: "/all-wishlist" }]} />

      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div>
          {wishlistData.length === 0 ? (
            <div className="space-y-4 flex w-full h-screen flex-col justify-center items-center">
              <div className="flex justify-center items-center">
                <img
                  src={wishlistempty}
                  alt="wishlist empty"
                  className="w-1/2"
                />
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center">
                <p className="text-sm font-bold">
                  All Your Wishlist Will be Saved Here
                </p>
                <p className="text-xs text-center text-grayText">
                  Fill in your Wishlist by clicking the heart icon when you find
                  a product you like.
                </p>
                <Link
                  to="/all-products"
                  className="px-8 py-1 bg-blue3 rounded-lg text-white font-semibold"
                >
                  Find Your Wishlist Product
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2 ">
              <h1 className="font-bold text-xl">Wishlist</h1>

              <InfiniteScroll
                dataLength={list.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={
                  <div className="animate-bounce flex gap-4 mb-4 justify-center items-center">
                    <img src={loadingfurnifor} alt="loading scroll" />
                  </div>
                }
                endMessage={
                  <div className="flex flex-col gap-4 mb-4 justify-center items-center">
                    <img
                      src={loadingfurnifor}
                      alt="end scroll"
                      className="w-8"
                    />
                  </div>
                }
              >
                {wishlistMap.map((item) => (
                  <div key={item.id} className="lg:mx-20 md:mx-20">
                    <Link to={`/product/${item.name}`}>
                      <CardWishlist item={item} />
                    </Link>
                  </div>
                ))}
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default withAuthUser(AllWishlist);
