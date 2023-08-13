import React from "react";
import notFound from "../../assets/images/notFound.png";
import { Link } from "react-router-dom";
import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import ButtonLink from "../../components/ButtonLink";

const NotFound = () => {
  return (
    <div className="w-screen lg:w-full h-screen">
      <NavbarDesktop />
      <NavbarMobile />
      <div>
        <div className="mb-24 flex flex-col justify-start items-center mx-10">
          <img src={notFound} alt="" className="w-64 md:1/3 lg:w-1/3" />
          <h1 className="text-xs mb-3 lg:text-base text-center">
            No worries! Just head back to the{" "}
            <Link to="/">
              <span className="font-bold text-blue3">home page</span>
            </Link>{" "}
            to get back on track.{" "}
          </h1>
          <ButtonLink
            buttonSize="small"
            buttonText="Go Home"
            bgColor="bg-blue3"
            colorText="text-white"
            fontWeight="font-bold"
            type="button"
            to="/"
          />
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default NotFound;
