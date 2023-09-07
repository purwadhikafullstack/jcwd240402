import React, { useEffect, useState } from "react";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";

import ShowCaseProduct from "../../components/user/ShowCaseProduct";
import axios from "../../api/axios";
import Loading from "../../components/Loading";

const AllProducts = () => {
  const [loading, setLoading] = useState(true);
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    axios.get("/user/products/category").then((res) => {
      setLoading(false);
      setDisplay(res.data?.data);
    });
  }, []);

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
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <ShowCaseProduct perPage={50} />
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default AllProducts;
