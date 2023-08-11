import React from "react";
import CarouselBanner from "../components/CarouselBanner";
import NavbarDesktop from "../components/NavbarDesktop";
import NavbarMobile from "../components/NavbarMobile";
import FooterDesktop from "../components/FooterDesktop";
import NavigatorMobile from "../components/NavigatorMobile";
import CarouselProduct from "../components/CarouselProduct";
import banner1 from "../assets/images/banner_1.png";
import banner2 from "../assets/images/banner_2.png";
import banner3 from "../assets/images/banner_3.png";
import banner4 from "../assets/images/banner_4.png";
import banner5 from "../assets/images/banner_5.png";

const Home = () => {
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
  const imageUrls = [banner1, banner2, banner3, banner4, banner5];
  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen lg:mx-32">
        <div className="flex justify-center">
          <CarouselBanner imageUrls={imageUrls} />
        </div>
        <div className="">
          <CarouselProduct productsData={productsData} />
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default Home;
