import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "flowbite-react";
import Select from "react-select";

import { useDispatch, useSelector } from "react-redux";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import ModalSetPrimaryAddress from "../../components/user/modal/ModalSetPrimaryAddress";
import axios from "../../api/axios";
import { getCookie, getLocalStorage } from "../../utils/tokenSetterGetter";
import { profileUser } from "../../features/userDataSlice";
import { addressUser } from "../../features/userAddressSlice";
import { cartsUser } from "../../features/cartSlice";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import emptycheckout from "../../assets/images/emptycheckout.png";
import { rupiahFormat } from "../../utils/formatter";
import emptyImage from "../../assets/images/emptyImage.jpg";
import withAuthUser from "../../components/user/withAuthUser";

const CheckOut = () => {
  const userData = useSelector((state) => state.profiler.value);
  const cartData = useSelector((state) => state.carter.value);
  const [closestWarehouse, setClosestWarehouse] = useState({});
  const [rajaOngkir, setRajaOngkir] = useState({});
  const [serviceOptions, setServiceOptions] = useState({});
  const [totalCart, setTotalCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWeight, setTotalWeight] = useState("");
  const [chosenCourier, setChosenCourier] = useState("");
  const [chosenCourierEnum, setChosenCourierEnum] = useState("");
  const [chosenCourierService, setChosenCourierService] = useState("");
  const [chosenCourierPrice, setChosenCourierPrice] = useState("");
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [invoiceUniqCode, setInvoiceUniqCode] = useState("");

  useEffect(() => {
    axios
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(profileUser(res.data?.result));
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    if (!access_token && !refresh_token && userData.role_id !== 3) {
      return;
    }
    axios
      .get("/user/profile/address", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(addressUser(res.data?.result));
      });
  }, [access_token, dispatch, refresh_token, userData.role_id]);

  useEffect(() => {
    if (!access_token && !refresh_token && userData.role_id !== 3) {
      return;
    }
    axios
      .get("/user/cart", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(cartsUser(res.data?.result));
        setTotalCart(res.data?.total);
        setTotalWeight(res.data?.total_weight);
      });
  }, [access_token, dispatch, refresh_token, userData.role_id]);

  useEffect(() => {
    if (!access_token && !refresh_token && userData.role_id !== 3) {
      return;
    }
    axios
      .post(
        "/user/closest",
        {
          primary_address_id: userData.User_detail?.Address_user?.id,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res) => {
        setClosestWarehouse(res.data?.closest_warehouse);
      })
      .catch((error) => setErrMsg(error));
  }, [access_token, dispatch, refresh_token, userData]);

  const handleCourier = (courier) => {
    if (!access_token && !refresh_token && userData.role_id !== 3) {
      return;
    }
    axios
      .post(
        "/user/rajaongkir/cost",
        {
          origin: closestWarehouse.city_id,
          destination: userData.User_detail?.Address_user?.city_id,
          weight: totalWeight,
          courier: courier.value,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res) => {
        setRajaOngkir(res.data.result);
        setChosenCourier(res.data?.result?.rajaongkir?.results[0]?.name);
        setChosenCourierEnum(courier.value);
        setServiceOptions(
          res.data?.result?.rajaongkir?.results[0]?.costs.map((service) => ({
            value: service.cost[0].value,
            label:
              service.description +
              ` (${service.service})` +
              `(${service.cost[0].etd} Hari)`,
          }))
        );
      });
  };

  const handlePaymentClick = () => {
    if (!access_token && !refresh_token && userData.role_id !== 3) {
      return;
    }
    axios
      .post(
        "/user/check-out",
        {
          user_id: userData.id,
          total_price: totalPrice,
          delivery_price: chosenCourierPrice,
          delivery_courier: chosenCourierEnum,
          address_user_id: userData.User_detail?.Address_user?.id,
          warehouse_id: closestWarehouse.id,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res) => {
        setInvoiceUniqCode(
          (res.data?.order?.no_invoice).slice(
            res.data?.order?.no_invoice.length - 8
          )
        );
        axios
          .post(
            "/user/check-out-details",
            {
              order_id: res.data?.order?.id,
              warehouse_id: closestWarehouse.id,
              cart_data: cartData,
            },
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          )
          .then((res) => {
            setSuccessMsg(res?.data?.message);
          })
          .catch((error) => {
            setErrMsg(error.response?.data?.message);
          });
        axios
          .delete("/user/cart-order", {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
            data: {
              cart_data: cartData,
            },
          })
          .then((res) => {
            setSuccessMsg(res?.data?.message);
          })
          .catch((error) => {
            setErrMsg(error.response?.data?.message);
          });

        navigate(`/payment/${res.data?.order?.no_invoice.substr(-8)}`);
      });
  };

  const handleCourierService = (courier) => {
    setChosenCourierService(courier.label);
    setChosenCourierPrice(courier.value);
    setTotalPrice(courier.value + totalCart);
  };

  const courierOptions = [
    { value: "jne", label: "JNE" },
    { value: "pos", label: "POS Indonesia" },
    { value: "tiki", label: "TIKI" },
  ];

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb
        crumbs={[
          { title: ["Cart"], link: "/cart" },
          { title: ["Checkout"], link: "/checkout" },
        ]}
      />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div>
          {cartData.length === 0 ? (
            <div className="w-full h-screen text-xs text-grayText space-y-2 flex flex-col justify-center items-center">
              <img
                src={emptycheckout}
                alt="empty checkout"
                className="w-1/2 md:w-1/2 lg:w-1/3"
              />
              <p className="font-semibold">
                You have not added any products to your cart
              </p>
              <p>Please add some product to the cart to checkout</p>
              <Link
                to="/all-products"
                className="py-1 text-base font-semibold text-white px-4 bg-blue3 rounded-md"
              >
                see all our products
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-2 text-xl font-bold">CheckOut</h1>
              <h1 className="mb-2 font-bold">Shipping Address</h1>
              <div className="md:grid lg:grid md:grid-cols-3 lg:grid-cols-3 gap-4">
                <div className="md:col-span-2 lg:col-span-2 ">
                  <div className="text-xs border-2 p-4 rounded-lg ">
                    <h3 className="text-base font-bold ">
                      {userData.User_detail?.Address_user?.address_title}
                    </h3>
                    <h3>
                      <span className="font-semibold">{userData.username}</span>{" "}
                      ({userData.User_detail?.phone})
                    </h3>
                    <h3 className="text-justify">
                      {userData.User_detail?.Address_user?.address_details ? (
                        userData.User_detail?.Address_user?.address_details
                      ) : (
                        <h1>address still empty</h1>
                      )}
                    </h3>
                    <ModalSetPrimaryAddress />
                  </div>
                  <h1 className="mt-4 font-bold">Product Checkout List</h1>
                  <div className="md:grid md:grid-cols-4 lg:grid lg:grid-cols-4  my-1 text-xs border-2 p-4 rounded-lg">
                    <div className="col-span-3 grid gap-4 mb-4 lg:mb-0 md:mb-0 lg:mr-4 md:mr-4">
                      {cartData.map((item) => (
                        <div
                          key={item.id}
                          className=" grid grid-cols-12 rounded-lg shadow-card-1"
                        >
                          <div className="col-span-4 md:col-span-2 lg:col-span-2 w-full  flex flex-col justify-center items-center">
                            <img
                              src={
                                item?.Warehouse_stock?.Product
                                  ?.Image_products[0]?.img_product
                                  ? `${process.env.REACT_APP_API_BASE_URL}${item?.Warehouse_stock?.Product?.Image_products[0]?.img_product}`
                                  : emptyImage
                              }
                              alt="product"
                              className="w-full"
                            />
                          </div>
                          <div className="col-span-8 md:col-span-10 lg:col-span-10 w-full  p-4">
                            <div className="flex gap-2 justify-start items-center">
                              <h1 className="font-bold">
                                {item.Warehouse_stock?.Product?.name}
                              </h1>
                              <Badge color="purple" className="w-fit">
                                {item.Warehouse_stock?.Product?.category?.name}
                              </Badge>
                            </div>

                            {item.Warehouse_stock?.Product?.description
                              ?.length > 100 ? (
                              <h1 className="">
                                {item.Warehouse_stock?.Product?.description.slice(
                                  0,
                                  100
                                )}
                                ...
                              </h1>
                            ) : (
                              <h1 className="">
                                {item.Warehouse_stock?.Product?.description}
                              </h1>
                            )}

                            <h1 className="">
                              {rupiahFormat(
                                item.Warehouse_stock?.Product?.price
                              )}{" "}
                              x {item.quantity}{" "}
                              {item.quantity > 1 ? "units" : "unit"}
                            </h1>
                            <h1 className="font-bold text-right">
                              total:{" "}
                              {rupiahFormat(
                                item.Warehouse_stock?.Product?.price *
                                  item.quantity
                              )}
                            </h1>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-span-1 w-full text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16 flex flex-col gap-4">
                      {userData.User_detail?.Address_user?.id ? (
                        <div className=" flex flex-col gap-4">
                          <h1 className="font-semibold">Choose Courier</h1>
                          <Select
                            options={courierOptions}
                            placeholder={<div>courier</div>}
                            onChange={handleCourier}
                            className="pb-3"
                          />
                          {chosenCourier && (
                            <Select
                              options={serviceOptions}
                              placeholder={<div>courier service</div>}
                              onChange={handleCourierService}
                            />
                          )}
                        </div>
                      ) : (
                        <h1 className="text-center text-gray-400 font-semibold">
                          Address still empty! Please set your delivery address
                          first
                        </h1>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16 space-y-2">
                  <h1 className="font-bold">purchase summary</h1>
                  <h1 className="">
                    Subtotal price: {rupiahFormat(totalCart)}{" "}
                  </h1>
                  <h1 className="">
                    Shipping price: {rupiahFormat(chosenCourierPrice)}
                  </h1>
                  <h1 className="">Courier : {chosenCourier}</h1>
                  <h1 className="">Service : {chosenCourierService}</h1>
                  <hr className="border-2 " />
                  <h1 className="">
                    delivering from: {closestWarehouse.warehouse_name}
                  </h1>
                  <h1 className="font-bold text-base">
                    Total Payment: {rupiahFormat(totalPrice)}
                  </h1>
                  {chosenCourierService ? (
                    <button
                      onClick={handlePaymentClick}
                      className="w-full bg-blue3 p-2 font-semibold text-white rounded-md"
                    >
                      Proceed to Payment
                    </button>
                  ) : (
                    <button
                      onClick={handlePaymentClick}
                      className="w-full bg-danger3 p-2 font-semibold text-white rounded-md"
                      disabled="true"
                    >
                      Proceed to Payment
                    </button>
                  )}
                </div>
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

export default withAuthUser(CheckOut);
