import React, { useEffect, useState } from "react";

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
import Select from 'react-select'

const CheckOut = () => {
  const userData = useSelector((state) => state.profiler.value);
  const cartData = useSelector((state) => state.carter.value);
  const addressData = useSelector((state) => state.addresser.value);
  const [closestWarehouse, setClosestWarehouse] = useState({});
  const [rajaOngkir, setRajaOngkir] = useState({});
  const [totalCart, setTotalCart] = useState(0);
  const [originId, setOriginId] = useState("");
  const [totalWeight, setTotalWeight] = useState("");
  const [chosenCourier, setChosenCourier] = useState("");
  const [chosenCourierService, setChosenCourierService] = useState("");
  const [chosenCourierPrice, setChosenCourierPrice] = useState("");
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();

  const imageData = [
    {
      img: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/220/1022009_PE832399_S4.jpg",
      category: "Desk",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus itaque sapiente aliquid excepturi at quis?",
      weight: "7000 gr",
      price: 100000,
      name: "Desk Premium",
    },
  ];

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
      .then((res) => dispatch(profileUser(res.data?.result)));
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
        setTotalCart(res.data.total)
        setTotalWeight(res.data.total_weight)
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/closest", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setClosestWarehouse(res.data.closest_warehouse)
        setOriginId(res.data.closest_warehouse.city_id)
      });
  }, [access_token, dispatch]);

  const handleCourier = (courier) => {
    axios
      .post("/user/rajaongkir/cost", 
      {
        "origin": originId,
        "destination": userData.User_detail?.Address_user?.city_id,
        "weight": totalWeight,
        "courier": courier.value
      },
      {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setRajaOngkir(res.data.result)
        setChosenCourierPrice(res.data.result.rajaongkir.results[0].costs[0].cost.value)
        setChosenCourier(res.data.result.rajaongkir.results[0].name)
        setChosenCourierService(res.data.result.rajaongkir.results[0].costs[0].description)
      });
  };

  const courierOptions = [
    { value: 'jne', label: 'JNE' },
    { value: 'pos', label: 'POS Indonesia' },
    { value: 'tiki', label: 'TIKI' }
  ]
  

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <h1 className="text-xl font-bold">CheckOut</h1>

        {/* <div className="grid grid-cols-3 border-2">
          <div className="col-span-2 border-2">
            <h1>Shipping Address</h1>
            <h1>kiri</h1>
          </div>
          <div className="col-span-1 border-2">
            <h1>kanan</h1>
          </div>
        </div> */}
        <div>
          <h1 className="mb-4 font-bold">Shipping Address</h1>
          <div className="md:grid lg:grid md:grid-cols-3 lg:grid-cols-3 gap-4">
            {/* KIRI */}
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
                        <img src={item.Warehouse_stock.Product.Image_Products} alt="" className="w-20" />
                      </div>
                      <div>
                        <h1>{item.Warehouse_stock.Product.name}</h1>
                        <h1>{item.Warehouse_stock.Product.category.name}</h1>
                        {item.Warehouse_stock.Product.description > 25 ? (
                          <h1>{item.Warehouse_stock.Product.description.slice(0, 25)}...</h1>
                        ) : (
                          <h1>{item.Warehouse_stock.Product.description}</h1>
                        )}

                        <h1>{item.Warehouse_stock.Product.price} x {item.quantity}</h1>
                        <h1>{item.Warehouse_stock.Product.price * item.quantity}</h1>

                      </div>
                    </>
                  ))}
                </div>
                <div className="col-span-1">
                  <button className="bg-blue3 w-full font-semibold text-white p-2 rounded-md">
                    Delivery Option
                  </button>
                </div>
              </div>
            </div>
            {/* KANAN */}
            <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
              <h1 className="font-bold">purchase summary</h1>
              <h1>subtotal price: {totalCart} </h1>
              <h1>Shipping price: {chosenCourierPrice}</h1>
              <h1>Courier : {chosenCourier}</h1>
              <h1>Service : {chosenCourierService}</h1>
              <hr className="border-2 " />
              <h1>Total Payment: </h1>
              <h1>delivering from: {closestWarehouse.warehouse_name}</h1>
              <button className="w-full bg-blue3 p-2 font-semibold text-white rounded-md">
                Proceed to Payment
              </button>
            </div>
            <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
              <h1>Choose Courier</h1>
              <Select
                options={courierOptions}
                placeholder={<div>courier</div>}
                onChange={handleCourier}
              />
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
