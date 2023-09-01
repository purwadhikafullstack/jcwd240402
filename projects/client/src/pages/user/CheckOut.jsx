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

const CheckOut = () => {
  const userData = useSelector((state) => state.profiler.value);
  const cartData = useSelector((state) => state.carter.value);
  const addressData = useSelector((state) => state.addresser.value);
  const [closestWarehouse, setClosestWarehouse] 
  = useState({latitude: 35.076944, longitude: -106.648628, warehouse_name: "Furnifor", city_id: 444});
  const [test1, settest1] = useState(0);
  const [test2, settest2] = useState(0);
  const [totalCart, setTotalCart] = useState(0);
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [itemWeight, setItemWeight] = useState("");
  const [chosenCourier, setChosenCourier] = useState("");
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

  const distanceKm = (lat1, lon1, lat2, lon2) => {
    const r = 6371; // km
    const p = Math.PI / 180;
  
    const a = 0.5 - Math.cos((lat2 - lat1) * p) / 2
                  + Math.cos(lat1 * p) * Math.cos(lat2 * p) *
                    (1 - Math.cos((lon2 - lon1) * p)) / 2;
  
    return 2 * r * Math.asin(Math.sqrt(a));
  }

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
        setDestinationId(addressData.city_id)
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
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios({
      method: "post",
      url: "https://api.rajaongkir.com/starter/cost",
      headers: { key: "438918ba05b00d968fd8e405ba7cc540",
        'content-type': 'application/x-www-form-urlencoded' },
      form: {origin: closestWarehouse.city_id, destination: addressData[0].city_id
        , weight: 1700, courier: 'jne'}
  });

},[]);

  useEffect(() => {

    for(let i = 0; i < cartData.length; i++){
      if(distanceKm(cartData[i].Warehouse_stock.Warehouse.latitude,
        cartData[i].Warehouse_stock.Warehouse.longitude,
        addressData[0].latitude, addressData[0].longitude) >= 
        distanceKm(closestWarehouse.latitude, closestWarehouse.longitude,
          addressData[0].latitude, addressData[0].longitude)){
            setClosestWarehouse(cartData[i].Warehouse_stock.Warehouse)
        }
    }
    
  },[]);


  

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
              <h1>Shipping price: </h1>
              <hr className="border-2 " />
              <h1>Total Payment: </h1>
              <h1>delivering from: {closestWarehouse.warehouse_name} </h1>
              <button className="w-full bg-blue3 p-2 font-semibold text-white rounded-md">
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
