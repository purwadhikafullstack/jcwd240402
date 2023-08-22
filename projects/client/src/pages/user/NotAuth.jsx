import React from "react";

import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import NotifRedirect from "../../components/NotifRedirect";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import notAuth from "../../assets/images/NotAuth.png";

const NotAuth = () => {
  const msg = "You need to ";
  return (
    <div className="w-screen lg:w-full h-screen">
      <NavbarDesktop />
      <NavbarMobile />
      <div>
        <NotifRedirect
          imgSrc={notAuth}
          to="/log-in"
          msg={msg}
          buttonText="Go In"
          toPage="Loged in"
        />
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default NotAuth;
