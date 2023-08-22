import React from "react";

import notFound from "../../assets/images/notFound.png";
import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import NotifRedirect from "../../components/NotifRedirect";

const NotFound = () => {
  const msg = "No worries! Just head back to the";
  return (
    <div className="w-screen lg:w-full h-screen">
      <NavbarDesktop />
      <NavbarMobile />
      <div>
        <NotifRedirect
          imgSrc={notFound}
          to="/"
          msg={msg}
          buttonText="Go Home"
          toPage="Home Page"
        />
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default NotFound;
