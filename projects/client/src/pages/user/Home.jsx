import React, { useEffect, useState } from "react";
import { FaShippingFast, FaTruckPickup, FaReceipt } from "react-icons/fa";
import { BsFillTelephoneFill, BsWrenchAdjustable } from "react-icons/bs";
import { MdDraw } from "react-icons/md";
import { useDispatch } from "react-redux";

import CarouselBanner from "../../components/user/carousel/CarouselBanner";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import CarouselProduct from "../../components/user/carousel/CarouselProduct";
import banner1 from "../../assets/images/banner_1.png";
import banner2 from "../../assets/images/banner_2.png";
import banner3 from "../../assets/images/banner_3.png";
import banner4 from "../../assets/images/banner_4.png";
import banner5 from "../../assets/images/banner_5.png";
import StaticBanner from "../../components/user/StaticBanner";
import ServiceCard from "../../components/user/ServiceCard";
import FrameImage from "../../components/user/FrameImage";
import SelectionCategory from "../../components/user/SelectionCategory";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import axios from "../../api/axios";
import { profileUser } from "../../features/userDataSlice";

import ShowCaseProduct from "../../components/user/ShowCaseProduct";

const Home = () => {
  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");

  const dispatch = useDispatch();

  const [newAccessToken, setNewAccessToken] = useState("");
  const [category, setCategory] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    axios.get(`/user/category`).then((res) => setCategory(res.data.result));
  }, []);

  useEffect(() => {
    axios.get(`/user/products-per-category`).then((res) => {
      setProductData(res.data?.result);
    });
  }, []);

  useEffect(() => {
    if (access_token && refresh_token) {
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
    }
  }, [access_token, dispatch, newAccessToken, refresh_token]);

  const imageUrls = [banner1, banner2, banner3, banner4, banner5];

  const services = [
    {
      component: FaShippingFast,
      title: "Delivery",
      text: "We help deliver your purchases to your home or office.",
    },
    {
      component: BsWrenchAdjustable,
      title: "Assembling",
      text: "We can assemble individual furniture items up to the PAX wardrobe system.",
    },
    {
      component: MdDraw,
      title: "Interior design",
      text: "Obtain space solutions from our expert interior designers.",
    },
    {
      component: FaReceipt,
      title: "Track my order",
      text: "Verify your delivery date and details here.",
    },
    {
      component: BsFillTelephoneFill,
      title: "Click and collect",
      text: "Collect your online purchases at an IKEA Pick-up Point or your nearest IKEA store.",
    },
    {
      component: FaTruckPickup,
      title: "Contact us",
      text: "Feel free to ask us, we're here to assist you.",
    },
  ];

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="flex justify-center">
          <CarouselBanner imageUrls={imageUrls} />
        </div>
        <StaticBanner />
        <div className="">
          <SelectionCategory category={category} />
        </div>
        <div className="relative z-0">
          {productData.map((item) => (
            <div key={item.id}>
              <h1 className="font-bold mx-3 lg:text-xl">{item.category}</h1>
              <CarouselProduct products={item.products} />
            </div>
          ))}
        </div>

        <div>
          <FrameImage />
        </div>
        <div className="h-fit">
          <ShowCaseProduct />
        </div>
        <div className="">
          <ServiceCard services={services} />
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default Home;
