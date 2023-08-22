import React from "react";

import notFound from "../../assets/images/notFound.png";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import NotifRedirect from "../../components/user/notif/NotifRedirect";

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
