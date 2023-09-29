import React, { useEffect, useState } from "react";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import ShowCaseProduct from "../../components/user/ShowCaseProduct";
import axios from "../../api/axios";
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import CarouselBanner from "../../components/user/carousel/CarouselBanner";
import allproductbanner1 from "../../assets/images/allproductsbanner1.jpeg";
import allproductbanner2 from "../../assets/images/allproductsbanner2.jpeg";
import emptyImage from "../../assets/images/emptyImage.jpg";

const AllProducts = () => {
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    axios
      .get("/user/paranoid-category")
      .then((res) => setCategory(res.data.result));
    setLoading(false);
  }, []);

  const imageUrls = category.map((item) => {
    return item.category_img
      ? `${process.env.REACT_APP_API_BASE_URL}${item.category_img}`
      : emptyImage;
  });

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb crumbs={[{ title: ["Products"], link: "/all-products" }]} />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="flex flex-wrap md:flex-nowrap gap-4">
          <div className="">
            {category.length === 0 ? null : (
              <CarouselBanner imageUrls={imageUrls} carouselSize="products" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-base md:text-xl lg:text-xl ">
              Welcome to Our Product Gallery
            </h3>
            <div className="h-full">
              <p className="text-grayText text-justify text-sm">
                Experience the epitome of elegance and comfort with our
                exquisite line of furniture. Crafted with the utmost attention
                to detail. Indulge in the epitome of refined elegance and
                unparalleled comfort as you explore our expansive collection of
                meticulously crafted furniture. Each piece is imbued with a
                meticulous attention to detail, a testament to our unwavering
                commitment to delivering products of unrivaled quality that
                gracefully endure the test of time, both in terms of enduring
                style and exceptional durability. At the heart of our ethos is
                the belief that luxurious living should be within everyone's
                reach, and we're proud to offer you the pinnacle of excellence
                without burdening your budget. Elevate your living spaces with
                our affordable, yet truly top-tier furniture, where the perfect
                blend of quality and affordability converges seamlessly. Your
                contentment and comfort take precedence in every facet of our
                offerings, as we tirelessly endeavor to exceed your
                expectations.
              </p>
              <div className="grid grid-cols-2 mt-2">
                <img
                  src={allproductbanner1}
                  alt="product banner"
                  className="object-cover h-full"
                />
                <img
                  src={allproductbanner2}
                  alt="product banner"
                  className="object-cover h-full"
                />
              </div>
            </div>
          </div>
        </div>
        <ShowCaseProduct perPage={50} />
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default AllProducts;
