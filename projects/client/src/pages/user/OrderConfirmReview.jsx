import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Badge } from "flowbite-react";

import { getCookie, getLocalStorage } from "../../utils/tokenSetterGetter";
import axios from "../../api/axios";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import Loading from "../../components/Loading";
import tiki from "../../assets/icons/tiki.png";
import pos from "../../assets/icons/pos.png";
import jne from "../../assets/icons/jne.png";
import { OrderButton } from "../../components/user/OrderButton";

const OrderConfirmReview = () => {
  const { invoiceId } = useParams();
  const location = useLocation();
  console.log(invoiceId);

  const [yourOrder, setYourOrder] = useState([]);
  const [orderProduct, setOrderProduct] = useState([]);
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const userData = useSelector((state) => state.profiler.value);

  const [orderStatus, setOrderStatus] = useState([]);

  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setLoadingOrder(true);
    setTimeout(() => {
      axios
        .get(`/user/order/${invoiceId}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          console.log(res.data);
          setYourOrder(res.data?.order);
          setLoadingOrder(false);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          setLoadingOrder(false);
        });
    }, 1000);
  }, [access_token, invoiceId]);

  console.log("your order", yourOrder);

  /* 
1 = payment pending
2 = awaiting payment confirmation
3 = completed   
4 = In Process
5 = cancelled
6 = shipped
7 = order confirmed
*/

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
        ]}
      />
      <div>
        <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32 mb-10">
          {yourOrder.order_status_id === 1 ||
          yourOrder.order_status_id === 2 ? (
            <>
              <div className="flex justify-between font-semibold text-sm mt-4">
                <h1>{yourOrder.Order_status?.name}</h1>
                <h1>invoice id: {invoiceId}</h1>
              </div>
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
              <div>
                <h4 className="font-bold text-sm">
                  delivery price: {yourOrder.delivery_price}
                </h4>
                <h4 className="font-bold text-sm">
                  total price: Rp.{yourOrder.total_price}
                </h4>
                {yourOrder.delivery_courier === "jne" ? (
                  <div className="font-bold text-sm">
                    <h4>Courier:</h4>
                    <img src={jne} alt="" className="w-52" />
                  </div>
                ) : yourOrder.delivery_courier === "pos" ? (
                  <div className="font-bold text-sm">
                    <h4>Courier:</h4>
                    <img src={pos} alt="" className="w-52" />
                  </div>
                ) : yourOrder.delivery_courier === "tiki" ? (
                  <div className="font-bold text-sm">
                    <h4>Courier:</h4>
                    <img src={tiki} alt="" className="w-52" />
                  </div>
                ) : (
                  <div className="font-bold text-sm">
                    <h4>courier: {yourOrder.delivery_courier}</h4>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-3 w-full md:items-center lg:items-center">
                <div className="md:w-96 lg:w-96 flex flex-col gap-3">
                  <h1 className="text-center font-semibold text-grayText">
                    Are you sure wanna proceed the payment?
                  </h1>
                  <OrderButton
                    statusBefore={yourOrder.order_status_id}
                    orderId={yourOrder.id}
                  />
                  <Link to={`/payment/${invoiceId}`}>
                    <button className="w-full bg-blue3 p-2 font-semibold text-white rounded-md text-xs">
                      Yes
                    </button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h1>Order Status : {yourOrder.Order_status?.name}</h1>
                <h1>Invoice id : {invoiceId}</h1>
              </div>
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
            </>
          )}
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default OrderConfirmReview;