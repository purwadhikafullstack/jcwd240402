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
import { cartsUser } from "../../features/cartSlice";
import Select from "react-select";
import toRupiah from "@develoka/angka-rupiah-js";

const PaymentFinalizing = () => {
  const userData = useSelector((state) => state.profiler.value);
  const cartData = useSelector((state) => state.carter.value);
  const addressData = useSelector((state) => state.addresser.value);
  const [totalCart, setTotalCart] = useState(0);
  const [yourOrder, setYourOrder] = useState(0);
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();

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
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/order", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setYourOrder(res.data?.order);
      });
  }, [access_token, dispatch]);

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <h1 className="text-xl font-bold">Payment</h1>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default PaymentFinalizing;
