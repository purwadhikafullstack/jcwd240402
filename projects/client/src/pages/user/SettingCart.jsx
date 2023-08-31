import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import CardProfile from "../../components/user/card/CardProfile";
import NavigatorSetting from "../../components/user/navbar/NavigatorSetting";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import ModalAddAddress from "../../components/user/modal/ModalAddAddress";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import CardAddress from "../../components/user/card/CardAddress";
import { addressUser } from "../../features/userAddressSlice";
import { profileUser } from "../../features/userDataSlice";
import addressEmpty from "../../assets/images/addressEmpty.png";
import withAuthUser from "../../components/user/withAuthUser";
import Cart from "./Cart";

const SettingCart = () => {
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const addressData = useSelector((state) => state.addresser.value);

  useEffect(() => {
    axios
      .get("/user/auth/keep-login", {
        headers: { Authorization: `Bearer ${refresh_token}` },
      })
      .then((res) => {
        setNewAccessToken(res.data?.accessToken);
        setCookie("access_token", newAccessToken, 1);
      });
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
      <div className="min-h-screen mt-4 mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32 ">
        <div className=" lg:grid lg:grid-cols-5 gap-4 mb-4 lg:mb-0 ">
          <CardProfile />
          <div className=" lg:col-span-4 w-full mt-4 md:mt-0 lg:mt-0 rounded-lg shadow-card-1">
            <NavigatorSetting />
            <h1>CART</h1>
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default withAuthUser(SettingCart);