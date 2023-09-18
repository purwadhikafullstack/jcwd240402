import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { profileUser } from "../../features/userDataSlice";
import { addressUser } from "../../features/userAddressSlice";
import { cartsUser } from "../../features/cartSlice";
import toRupiah from "@develoka/angka-rupiah-js";
import { Badge } from "flowbite-react";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import emptyImage from "../../assets/images/emptyImage.jpg";
import Button from "../../components/Button";
import Loading from "../../components/Loading";

const PaymentFinalizing = () => {
  const [totalCart, setTotalCart] = useState(0);
  const [paymentProofData, setPaymentProofData] = useState("");
  const [yourOrder, setYourOrder] = useState([]);
  const [orderProduct, setOrderProduct] = useState([]);
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState({});
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [productReview, setProductReview] = useState([]);

  const { invoiceId } = useParams();
  console.log(invoiceId);
  const inputPhotoRef = useRef();

  useEffect(() => {
    setLoadingOrder(true);
    setTimeout(() => {
      axios
        .get(`/user/order/${invoiceId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setYourOrder(res.data?.order);
          setLoadingOrder(false);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setLoadingOrder(false);
        });
    }, 2000);
  }, [access_token, invoiceId]);

  console.log("first yourOrder", yourOrder);

  useEffect(() => {
    if (!access_token && refresh_token) {
      axios
        .get("/user/auth/keep-login", {
          headers: { Authorization: `Bearer ${refresh_token}` },
        })
        .then((res) => {
          setNewAccessToken(res.data?.accessToken);
          setCookie("access_token", newAccessToken, 1);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [access_token, newAccessToken, refresh_token]);

  useEffect(() => {
    axios
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(profileUser(res.data?.result));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/profile/address", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(addressUser(res.data?.result));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/cart", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(cartsUser(res.data?.result));
        setTotalCart(res.data?.total);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [access_token, dispatch]);

  function handleChange(event) {
    const selectedImage = event.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setFile(event.target.files[0]);
    setIsFilePicked(true);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch(`/user/payment-proof/${invoiceId}`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setPaymentProofData(res.data?.order);
        setLoading(false);
        setTimeout(() => {
          navigate(`/user/setting/order`);
        }, 3000);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  if (loading || loadingOrder) {
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
      <BreadCrumb
        crumbs={[
          { title: ["Profile"], link: "/user/setting" },
          { title: ["Order"], link: "/user/setting/order" },
          {
            title: ["Order Confirmation"],
            link: `/order-confirm/${invoiceId}`,
          },
          { title: ["Payment"], link: `/payment/${invoiceId}` },
        ]}
      />
      <div className="min-h-screen mx-6 space-y-2 md:space-y-2 lg:space-y-2 lg:mx-32 mb-4">
        {/* decor aka */}
        <h1 className="font-bold text-xl">Payment</h1>
        {yourOrder.order_status_id === 1 || yourOrder.order_status_id === 2 ? (
          <div className="grid gap-4  ">
            <div className="  justify-center items-center w-full h-full">
              <h1>{yourOrder?.delivery_time}</h1>
              <div className="flex  w-full justify-between items-center font-bold text-sm text-grayText">
                <h1 className="py-1">
                  Order Total: Rp. {yourOrder?.total_price}
                </h1>

                <h1 className="py-1">invoice id: {invoiceId}</h1>
              </div>

              <div className="md:grid md:grid-cols-2 lg:grid lg:grid-cols-2 md:gap-8 lg:gap-8 space-y-4 md:space-y-0 lg:space-y-0">
                {yourOrder.Order_details?.map((item) => (
                  <div
                    key={item.id}
                    className="shadow-card-1 rounded-lg md:col-span-1 lg:col-span-1 "
                  >
                    <div className=" flex flex-col justify-center items-center">
                      <div className="w-52 md:w-80 lg:w-80">
                        <Carousel>
                          {item.Warehouse_stock?.Product?.Image_products?.map(
                            (image, idx) => (
                              <div key={idx} className=" ">
                                <img
                                  src={`${process.env.REACT_APP_API_BASE_URL}${image.img_product}`}
                                  alt=""
                                  className=""
                                />
                              </div>
                            )
                          )}
                        </Carousel>
                      </div>
                    </div>
                    <div className="p-4 text-xs ">
                      <div className="flex gap-4 items-center">
                        <h1 className="font-bold md:text-base lg:text-base">
                          {item.Warehouse_stock?.Product?.name}
                        </h1>
                        <Badge color="purple" className="w-fit">
                          {item.Warehouse_stock?.Product?.category?.name}
                        </Badge>
                      </div>
                      <div className="mt-2">
                        <h1>
                          Rp. {item.Warehouse_stock?.Product?.price} x{" "}
                          {item.quantity} unit
                        </h1>
                        <h1>
                          {item.Warehouse_stock?.Product?.weight *
                            item.quantity}{" "}
                          gr
                        </h1>
                        <h1 className="font-semibold text-right">
                          subtotal: Rp.{" "}
                          {item.Warehouse_stock?.Product?.price * item.quantity}
                        </h1>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className=" flex flex-col justify-start items-center ">
              <div className="shadow-card-1 p-4 space-y-4 flex flex-col justify-center items-center rounded-lg">
                <h1 className="text-sm font-semibold">upload payment proof</h1>
                <div className="md:w-96 lg:w-96">
                  <img
                    src={showImage ? showImage : `${emptyImage}`}
                    alt=""
                    className="object-cover w-full"
                  />
                </div>

                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="border-2 w-40 hidden"
                  ref={inputPhotoRef}
                />
                <div className="flex gap-4">
                  <Button
                    onClick={() => inputPhotoRef.current.click()}
                    buttonSize="small"
                    buttonText="Choose"
                    type="button"
                    bgColor="bg-green-400"
                    colorText="text-white"
                    fontWeight="font-semibold"
                  />
                  <Button
                    onClick={() => {
                      setShowImage(false);
                    }}
                    buttonSize="small"
                    buttonText="Cancel"
                    type="button"
                    bgColor="bg-red-400"
                    colorText="text-white"
                    fontWeight="font-semibold"
                  />
                </div>
                <button
                  className="w-full bg-blue3 p-2 font-semibold text-white rounded-md"
                  onClick={handleSubmit}
                  type="submit"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1>Order Status : {yourOrder.Order_status?.name}</h1>
            <h1>Invoice id : {invoiceId}</h1>
            <div className=" md:grid md:grid-cols-2 lg:grid lg:grid-cols-2 md:gap-8 lg:gap-8 space-y-4 md:space-y-0 lg:space-y-0">
              {yourOrder.Order_details?.map((item) => (
                <div
                  key={item.id}
                  className="shadow-card-1 rounded-lg md:col-span-1 lg:col-span-1 "
                >
                  <div className=" flex flex-col justify-center items-center">
                    <div className="w-52 md:w-80 lg:w-80">
                      <Carousel>
                        {item.Warehouse_stock?.Product?.Image_products?.map(
                          (image, idx) => (
                            <div key={idx} className=" ">
                              <img
                                src={`${process.env.REACT_APP_API_BASE_URL}${image.img_product}`}
                                alt=""
                                className=""
                              />
                            </div>
                          )
                        )}
                      </Carousel>
                    </div>
                  </div>
                  <div className="p-4 text-xs ">
                    <div className="flex gap-4 items-center">
                      <h1 className="font-bold md:text-base lg:text-base">
                        {item.Warehouse_stock?.Product?.name}
                      </h1>
                      <Badge color="purple" className="w-fit">
                        {item.Warehouse_stock?.Product?.category?.name}
                      </Badge>
                    </div>
                    <div className="mt-2">
                      <h1>
                        Rp. {item.Warehouse_stock?.Product?.price} x{" "}
                        {item.quantity} unit
                      </h1>
                      <h1>
                        {item.Warehouse_stock?.Product?.weight * item.quantity}{" "}
                        gr
                      </h1>
                      <h1 className="font-semibold text-right">
                        subtotal: Rp.{" "}
                        {item.Warehouse_stock?.Product?.price * item.quantity}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default PaymentFinalizing;
