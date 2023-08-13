import React, { useEffect, useState } from "react";
import CarouselBanner from "../../components/CarouselBanner";
import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import CarouselProduct from "../../components/CarouselProduct";
import banner1 from "../../assets/images/banner_1.png";
import banner2 from "../../assets/images/banner_2.png";
import banner3 from "../../assets/images/banner_3.png";
import banner4 from "../../assets/images/banner_4.png";
import banner5 from "../../assets/images/banner_5.png";
import StaticBanner from "../../components/StaticBanner";
import { FaShippingFast, FaTruckPickup, FaReceipt } from "react-icons/fa";
import { MdDraw } from "react-icons/md";
import { BsFillTelephoneFill, BsWrenchAdjustable } from "react-icons/bs";
import ServiceCard from "../../components/ServiceCard";
import FrameImage from "../../components/FrameImage";
import SelectionCategory from "../../components/SelectionCategory";
import { getCookie, setCookie } from "../../utils";
import axios from "../../api/axios";

const Home = () => {
  const [newAccessToken, setNewAccessToken] = useState("");
  const refresh_token = localStorage.getItem("refresh_token");
  const access_token = getCookie("access_token");

  useEffect(() => {
    if (!access_token) {
      axios
        .get("/auth/keep-login", {
          headers: { Authorization: `Bearer ${refresh_token}` },
        })
        .then((res) => {
          setNewAccessToken(res.data?.accessToken);
          setCookie("access_token", newAccessToken, 1);
        });
    }
  }, [access_token, newAccessToken, refresh_token]);
  const productsData = [
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
  ];
  const listCategory = [
    { id: 1, name: "Table" },
    { id: 2, name: "Kitchen" },
    { id: 3, name: "Sofa" },
    { id: 4, name: "Chair" },
  ];
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
      <div className="min-h-screen  lg:mx-32">
        <div className="flex justify-center">
          <CarouselBanner imageUrls={imageUrls} />
        </div>
        <StaticBanner />
        <div className="">
          <SelectionCategory />
        </div>
        <div className="relative z-0">
          {listCategory.map((item) => (
            <div key={item.id}>
              <h1 className="font-bold mx-3 lg:text-3xl">{item.name}</h1>
              <CarouselProduct productsData={productsData} />
            </div>
          ))}
        </div>
        <div>
          <FrameImage />
        </div>
        <div className="my-4">
          <ServiceCard services={services} />
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default Home;
