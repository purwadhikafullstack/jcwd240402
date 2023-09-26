import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AiFillCheckCircle,
  AiFillCloseCircle,
  AiFillPlusSquare,
  AiFillMinusSquare,
} from "react-icons/ai";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import AccordionProduct from "../../components/user/accordion/AccordionProduct";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import ModalLogin from "../../components/user/modal/ModalLogin";
import Alert from "../../components/user/Alert";
import { cartsUser } from "../../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import productNotFound from "../../assets/images/productNotFound.png";
import { profileUser } from "../../features/userDataSlice";
import ShowCaseProduct from "../../components/user/ShowCaseProduct";
import Loading from "../../components/Loading";
import AlertWithIcon from "../../components/AlertWithIcon";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import ShareButton from "../../components/user/ShareButton";
import Wishlist from "../../components/user/Wishlist";
import { rupiahFormat } from "../../utils/formatter";
import emptyImage from "../../assets/images/emptyImage.jpg";

const ProductDetail = () => {
  const { name } = useParams();

  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");

  const userData = useSelector((state) => state.profiler.value);

  const [openAlert, setOpenAlert] = useState(false);
  const [detailProduct, setDetailProduct] = useState({});
  const [dataImage, setDataImage] = useState([]);
  const [stock, setStock] = useState(0);
  const [qty, setQty] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [newAccessToken, setNewAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [reservedStock, setReservedStock] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!access_token && !refresh_token && userData.role_id !== 3) {
      return;
    }
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
  }, [access_token, dispatch, newAccessToken, refresh_token]);

  useEffect(() => {
    axios
      .get(`/user/warehouse-stock/product/${name}`)
      .then((res) => {
        setDetailProduct(res.data?.result);
        setDataImage(res.data?.result?.Image_products);
        setStock(res.data?.remainingStock);
        setLoading(false);
      })
      .catch((error) => {
        setErrMsg(error.response?.data?.message);
        setLoading(false);
      });
  }, [name]);

  const handleAddProductToCart = async (name, qty) => {
    try {
      await axios
        .post(
          "/user/cart",
          { product_name: name, qty: qty },
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        )
        .then((res) => {
          axios
            .get("/user/cart", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => {
              dispatch(cartsUser(res.data?.result));
            });
          setQty(0);
          setSuccessMsg(res.data?.message);
          setOpenAlert(true);
          setLoading(false);
        })
        .catch((error) => {
          setOpenAlert(true);
          setLoading(false);
          setErrMsg(error.response?.data?.message);
        });
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.message);
        setOpenAlert(true);
        setQty(0);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="border-2 w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb
        crumbs={[
          { title: ["Products"], link: "/all-products" },
          { title: [`${name}`], link: `/product/${name}` },
        ]}
      />
      <div className="min-h-screen mx-6 mb-8 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
          <div className=" md:flex md:items-center  lg:flex lg:flex-col lg:items-center lg:col-span-2 lg:w-full lg:h-full">
            <Alert
              successMsg={successMsg}
              setOpenAlert={setOpenAlert}
              openAlert={openAlert}
              errMsg={errMsg}
            />
            {dataImage.length === 0 ? (
              <div className="w-full h-full mt-10 flex flex-col justify-center items-center ">
                <AlertWithIcon errMsg={errMsg} />
                <img src={productNotFound} alt="" className="w-1/2 lg:w-2/3" />
              </div>
            ) : (
              // <div className="md:w-96 lg:w-96 mt-10 flex flex-col justify-center items-center">
              <Carousel className=" mx-auto  md:w-96 md:h-full lg:w-96 lg:h-full mt-10 flex flex-col justify-center items-center">
                {dataImage.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-center items-center h-full"
                  >
                    <img
                      src={
                        item?.img_product
                          ? `${process.env.REACT_APP_API_BASE_URL}${item?.img_product}`
                          : emptyImage
                      }
                      alt="product"
                      className=""
                    />
                  </div>
                ))}
              </Carousel>
              // </div>
            )}
            <div className="hidden lg:block md:hidden w-full">
              {dataImage.length === 0 ? null : (
                <AccordionProduct
                  desc={detailProduct.description}
                  name={detailProduct.name}
                  price={detailProduct.price}
                  weight={detailProduct.weight}
                />
              )}
            </div>
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-16 lg:h-fit p-4 lg:p-4 ">
            {dataImage.length === 0 ? null : (
              <>
                <h1 className="font-bold lg:text-4xl">{detailProduct.name}</h1>
                <h1 className="font-bold text-xl">
                  {rupiahFormat(detailProduct.price)}
                </h1>
              </>
            )}
            <hr />
            <div className="flex justify-between mt-4">
              <p>Amount:</p>
              <div className="flex justify-between items-center w-24  rounded-full px-1">
                <button
                  onClick={() => (qty <= 0 ? 0 : setQty(qty - 1))}
                  className="px-1"
                  disabled={qty <= 0}
                >
                  <AiFillMinusSquare
                    className={`${
                      qty <= 0 ? "text-gray-400" : "text-blue3"
                    } text-2xl`}
                  />
                </button>
                <p>{qty}</p>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-1"
                  disabled={qty === stock}
                >
                  <AiFillPlusSquare
                    className={` ${
                      qty === stock ? "text-gray-400" : "text-blue3"
                    } text-2xl`}
                  />
                </button>
              </div>
            </div>
            <div className="my-4">
              {!refresh_token || !access_token || userData.role_id !== 3 ? (
                <h1 className="">
                  please log in to get add to cart access{" "}
                  <span>
                    <ModalLogin buttonText="click here" />
                  </span>
                </h1>
              ) : (
                <button
                  onClick={() => handleAddProductToCart(name, qty)}
                  className={` ${
                    stock === 0 || qty === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue3 cursor-pointer"
                  } text-white w-full h-10 rounded-full`}
                  disabled={stock === 0 || qty === 0 || userData.role_id !== 3}
                >
                  add to cart
                </button>
              )}
              <div className="flex justify-start items-center mt-2">
                {stock === 0 ? (
                  <>
                    <AiFillCloseCircle className="text-red-500" />
                    <h1 className="text-xs ">This product is unavailable</h1>
                  </>
                ) : (
                  <>
                    <AiFillCheckCircle className="text-green-400" />
                    <h1 className="text-xs ">
                      This product is still available in{" "}
                      <span className="font-bold">{stock}</span>
                    </h1>
                  </>
                )}
              </div>
              <div className="flex justify-between items-center mt-2">
                <ShareButton />
                <Wishlist
                  product={name}
                  setErrMsg={setErrMsg}
                  setOpenAlert={setOpenAlert}
                  setSuccessMsg={setSuccessMsg}
                />
              </div>
            </div>
            <div className="lg:hidden">
              {dataImage.length === 0 ? null : (
                <AccordionProduct
                  desc={detailProduct.description}
                  name={detailProduct.name}
                  price={detailProduct.price}
                  weight={detailProduct.weight}
                />
              )}
            </div>
          </div>
        </div>
        <div className="relative z-0">
          <ShowCaseProduct perPage={10} />
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default ProductDetail;
