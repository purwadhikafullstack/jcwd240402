import React, { useEffect, useState } from "react";
import { rupiahFormat } from "../../utils/formatter";

import addtocart from "../../assets/images/addtocart.png";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import TableCart from "../../components/user/TableCart";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { useDispatch, useSelector } from "react-redux";
import { cartsUser } from "../../features/cartSlice";
import withAuthUser from "../../components/user/withAuthUser";
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import { Link } from "react-router-dom";

const Cart = () => {
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");
  const dispatch = useDispatch();
  const cartsData = useSelector((state) => state.carter.value);
  const userData = useSelector((state) => state.profiler.value);

  const [loading, setLoading] = useState(true);
  const [newAccessToken, setNewAccessToken] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!refresh_token || !access_token || userData.role_id !== 3) {
      return;
    }
    axios
      .get("/user/cart", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(cartsUser(res.data?.result));
        setTotal(res.data?.total);
        setLoading(false);
      })
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
  }, [access_token, dispatch, newAccessToken, refresh_token, userData.role_id]);

  const productsData = cartsData.map((cart) => {
    return {
      id: cart.id,
      quantity: cart.quantity,
      stock: cart.Warehouse_stock?.product_stock,
      name: cart.Warehouse_stock?.Product?.name,
      price: cart.Warehouse_stock?.Product?.price,
      weight: cart.Warehouse_stock?.Product?.weight,
      category: cart.Warehouse_stock?.Product?.category?.name,
      img: cart.Warehouse_stock?.Product?.Image_products[0].img_product,
      subtotalPrice: cart.quantity * cart.Warehouse_stock?.Product?.price,
    };
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb crumbs={[{ title: ["Cart"], link: "/cart" }]} />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
          Your Shopping Cart
        </h1>
        {/* PHONE CART */}
        <div className="p-4 w-full border-b-2 h-20 flex justify-between items-center sticky top-14 md:hidden lg:hidden bg-white rounded-lg">
          <div>
            <h1 className="text-xs">{productsData.length} products:</h1>
            <h1>{rupiahFormat(total)}</h1>
          </div>
          <Link to="/checkout">
            <button className="w-36 h-12 text-sm rounded-full font-bold text-white bg-blue3">
              Checkout
            </button>
          </Link>
        </div>
        {/* TAB AND DESKTOP */}
        <div className="h-full py-4 border-b-2">
          <div className="w-full grid grid-cols-5 md:grid-cols-6 lg:grid-cols-6 ">
            <div className="text-xs md:text-sm lg:text-sm col-span-2 md:col-span-3 lg:col-span-3 border-b-2 font-bold items-center">
              <h1>Product item</h1>
            </div>
            <div className="flex text-xs md:text-sm lg:text-sm col-span-1 md:lg:col-span-1 lg:col-span-1 border-b-2 font-bold justify-center items-center">
              <h1>Quantity</h1>
            </div>
            <div className="text-xs flex md:text-sm lg:text-sm col-span-1 md:lg:col-span-1 lg:col-span-1 border-b-2 font-bold items-center justify-center">
              <h1>Subtotal</h1>
            </div>
            <div className="text-xs md:text-sm lg:text-sm  col-span-1 md:col-span-1 lg:col-span-1 border-b-2 font-bold grid justify-center">
              <h1>Edit</h1>
            </div>
            {productsData.length === 0 ? (
              <div className="flex flex-col justify-center items-center w-[21rem] md:w-[47rem] lg:w-[79rem]">
                <img
                  src={addtocart}
                  alt="add to cart"
                  className="w-56 md:w-96"
                />
                <h1 className="text-gray-400 text-center text-xs md:text-sm lg:text-sm mt-2">
                  Your Shopping Cart is empty. You do not have any products in
                  your shopping list
                </h1>
              </div>
            ) : (
              productsData.map((item) => (
                <TableCart
                  key={item.id}
                  img={item.img}
                  name={item.name}
                  price={item.price}
                  weight={item.weight}
                  subtotalPrice={item.subtotalPrice}
                  quantity={item.quantity}
                  setTotal={setTotal}
                />
              ))
            )}
          </div>
        </div>
        <div>
          <div className="hidden md:flex lg:flex justify-between items-center mb-4">
            <h1>
              Total Amount :{" "}
              <span className="font-bold">{rupiahFormat(total)}</span>
            </h1>
            <Link to="/checkout">
              <button className="bg-blue3 font-bold text-white w-96 h-10 rounded-full">
                check out
              </button>
            </Link>
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default withAuthUser(Cart);
