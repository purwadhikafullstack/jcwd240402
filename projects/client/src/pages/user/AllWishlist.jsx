import React, { useEffect, useState } from "react";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import axios from "../../api/axios";
import { getCookie } from "../../utils/tokenSetterGetter";
import CardProduct from "../../components/user/card/CardProduct";
import Loading from "../../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { wishlistUser } from "../../features/wishlistDataSlice";
import wishlistempty from "../../assets/images/wishlistempty.png";
import { Link } from "react-router-dom";
import CardWishlist from "../../components/user/card/CardWishlist";
import Alert from "../../components/user/Alert";
import withAuthUser from "../../components/user/withAuthUser";

const AllWishlist = () => {
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const wishlistData = useSelector((state) => state.wishlister.value);

  useEffect(() => {
    axios
      .get("/user/wishlist", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(wishlistUser(res.data?.result));
        setLoading(false);
      })
      .catch((error) => {
        setErrMsg(error.response?.data?.message);
      });
  }, [access_token, dispatch]);

  if (loading) {
    return (
      <div className=" w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  const wishlistMap = wishlistData.map((item) => {
    return {
      src: item.Warehouse_stock?.Product?.Image_products[0].img_product,
      category: item.Warehouse_stock?.Product?.category?.name,
      name: item.Warehouse_stock?.Product?.name,
      desc: item.Warehouse_stock?.Product?.description,
      price: item.Warehouse_stock?.Product?.price,
      stock: item.Warehouse_stock?.product_stock,
      weight: item.Warehouse_stock?.Product?.weight,
      id: item.Warehouse_stock?.id,
    };
  });

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
                <img src={wishlistempty} alt="" className="w-1/2" />
              </div>
              <div className="space-y-4 flex flex-col justify-center items-center">
                <p className="text-sm font-bold">
                  All Your Wishlist Will be Saved Here
                </p>
                <p className="text-xs text-grayText">
                  Fill in your Wishlist by clicking the heart icon when you find
                  an product you like.
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
            <div className="space-y-2">
              {/* {wishlistMap.map((productItem) => (
                <CardProduct
                  src={`${process.env.REACT_APP_API_BASE_URL}${productItem?.src}`}
                  category={productItem.category}
                  name={productItem?.name}
                  desc={productItem?.desc}
                  price={productItem?.price}
                  key={productItem.id}
                />
              ))} */}

              {wishlistMap.map((item) => (
                <CardWishlist key={item.id} item={item} />
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

export default withAuthUser(AllWishlist);
