import React, { useEffect, useState } from "react";
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

const CheckOut = () => {
  const userData = useSelector((state) => state.profiler.value);
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();

  const imageData = {
    img: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/220/1022009_PE832399_S4.jpg",
    category: "Desk",
    description:
      "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus itaque sapiente aliquid excepturi at quis?",
    weight: "7000 gr",
    price: 100000,
    name: "Desk Premium",
  };
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
            <div className="md:col-span-2 lg:col-span-2">
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
              <div className="text-xs border-2 p-4 rounded-lg flex">
                <div>
                  <img src={imageData.img} alt="" className="w-20" />
                </div>
                <div>
                  <h1>{imageData.name}</h1>
                  <h1>{imageData.category}</h1>
                  {imageData.description.length > 25 ? (
                    <h1>{imageData.description.slice(0, 25)}...</h1>
                  ) : (
                    <h1>{imageData.description}</h1>
                  )}
                  <h1>{imageData.price}</h1>
                </div>
              </div>
            </div>
            {/* KANAN */}
            <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
              <h1 className="font-bold">purchase summary</h1>
              <h1>Shipping price: </h1>
              <h1>Total Payment: </h1>
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