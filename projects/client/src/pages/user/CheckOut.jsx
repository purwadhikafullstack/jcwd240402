import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tiki from "../../assets/icons/tiki.png";
import jne from "../../assets/icons/jne.png";
import pos from "../../assets/icons/pos.png";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import { useDispatch, useSelector } from "react-redux";
import ModalSetPrimaryAddress from "../../components/user/modal/ModalSetPrimaryAddress";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { profileUser } from "../../features/userDataSlice";
import { addressUser } from "../../features/userAddressSlice";
import { cartsUser } from "../../features/cartSlice";
import Select from "react-select";
import toRupiah from "@develoka/angka-rupiah-js";

const CheckOut = () => {
  const userData = useSelector((state) => state.profiler.value);
  const cartData = useSelector((state) => state.carter.value);
  const addressData = useSelector((state) => state.addresser.value);
  const [closestWarehouse, setClosestWarehouse] = useState({});
  const [rajaOngkir, setRajaOngkir] = useState({});
  const [serviceOptions, setServiceOptions] = useState({});
  const [checkoutDetails, SetCheckoutDetails] = useState([]);
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

  useEffect(() => {
    if (!access_token && refresh_token) {
      axios
        .get("/user/auth/keep-login", {
          headers: { Authorization: `Bearer ${refresh_token}` },
        })
        .then((res) => {
          setNewAccessToken(res.data?.accessToken);
          setCookie("access_token", newAccessToken, 1);
        });
    }
  }, [access_token, newAccessToken, refresh_token]);

  useEffect(() => {
    axios
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(profileUser(res.data?.result))
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/profile/address", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(addressUser(res.data?.result));
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
        setTotalWeight(res.data?.total_weight);
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .post("/user/closest",{
        primary_address_id: userData.User_detail?.Address_user?.id
      }, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setClosestWarehouse(res.data?.closest_warehouse);
      })
      .catch((error) => console.log(error));
  }, [access_token, dispatch, userData]);

  const handleCourier = (courier) => {
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
        setChosenCourierEnum(courier.value)
        setServiceOptions(
          res.data?.result?.rajaongkir?.results[0]?.costs.map((service) => ({
            value: service.cost[0].value,
            label: service.description + ` (${service.service})` + `(${service.cost[0].etd} Hari)`,
          }))
        );
      });
  };

  const handlePaymentClick = () => {
    axios
      .post(
        "/user/check-out",
        {
          user_id: userData.id,
          total_price: totalPrice,
          delivery_price: chosenCourierPrice,
          delivery_courier: chosenCourierEnum,
          address_user_id: userData.User_detail?.Address_user?.id,
          warehouse_id: closestWarehouse.id
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res) => {
          axios
          .post(
            "/user/check-out-details",
            {
              order_id: res.data?.order?.id,
              cart_data: cartData
            },
            {
              headers: { Authorization: `Bearer ${access_token}` },
            }
          )
          .then((res) => {
          });
        }
      );
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
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <h1 className="text-xl font-bold">CheckOut</h1>
        <div>
          <h1 className="mb-4 font-bold">Shipping Address</h1>
          <div className="md:grid lg:grid md:grid-cols-3 lg:grid-cols-3 gap-4">
            <div className="md:col-span-2 lg:col-span-2 ">
              <div className="text-xs border-2 p-4 rounded-lg ">
                <h3 className="text-base font-bold ">
                  {userData.User_detail?.Address_user?.address_title}
                </h3>
                <h3>
                  <span className="font-semibold">{userData.username}</span> (
                  {userData.User_detail?.phone})
                </h3>
                <h3 className="text-justify">
                  {userData.User_detail?.Address_user?.address_details ? (
                    userData.User_detail?.Address_user?.address_details
                  ) : (
                    <h1>empty</h1>
                  )}
                </h3>
                <ModalSetPrimaryAddress />
              </div>
              <div className="md:grid md:grid-cols-4 lg:grid lg:grid-cols-4  my-4  text-xs border-2 p-4 rounded-lg">
                <div className=" flex col-span-3 ">
                  {cartData.map((item) => (
                    <>
                      <div className="w-20">
                        <img
                          src={item.Warehouse_stock.Product.Image_Products}
                          alt=""
                          className="w-20"
                        />
                      </div>
                      <div>
                        <h1 className="py-1">{item.Warehouse_stock.Product.name}</h1>
                        <h1 className="py-1">{item.Warehouse_stock.Product.category.name}</h1>
                        {item.Warehouse_stock.Product.description > 25 ? (
                          <h1 className="py-1">
                            {item.Warehouse_stock.Product.description.slice(
                              0,
                              25
                            )}
                            ...
                          </h1>
                        ) : (
                          <h1 className="py-1">{item.Warehouse_stock.Product.description}</h1>
                        )}

                        <h1 className="py-1">
                          {toRupiah(item.Warehouse_stock.Product.price)} x{" "}
                          {item.quantity} {item.quantity > 1 ? "units" : "unit"}
                        </h1>
                        <h1 className="py-1">
                          total:{" "}
                          {toRupiah(
                            item.Warehouse_stock.Product.price * item.quantity
                          )}
                        </h1>
                      </div>
                    </>
                  ))}
                </div>
                <div className="col-span-1 w-full text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
                  <h1>Choose Courier</h1>
                  <Select
                    options={courierOptions}
                    placeholder={<div>courier</div>}
                    onChange={handleCourier}
                  />
                  {chosenCourier && (
                    <Select
                      options={serviceOptions}
                      placeholder={<div>courier service</div>}
                      onChange={handleCourierService}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
              <h1 className="font-bold">purchase summary</h1>
              <h1 className="py-1">Subtotal price: {toRupiah(totalCart)} </h1>
              <h1 className="py-1">Shipping price: {toRupiah(chosenCourierPrice)}</h1>
              <h1 className="py-1">Courier : {chosenCourier}</h1>
              <h1 className="py-1">Service : {chosenCourierService}</h1>
              <hr className="border-2 " />
              <h1 className="py-1">Total Payment: {toRupiah(totalPrice)}</h1>
              <h1 className="py-1">delivering from: {closestWarehouse.warehouse_name}</h1>
              <button onClick={handlePaymentClick} className="w-full bg-blue3 p-2 font-semibold text-white rounded-md">
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default CheckOut;
