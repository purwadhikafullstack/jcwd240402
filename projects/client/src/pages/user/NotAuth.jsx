import React from "react";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import NotifRedirect from "../../components/user/notif/NotifRedirect";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import notAuth from "../../assets/images/NotAuth.png";

const NotAuth = () => {
  const msg = "You need to ";
  return (
    <div className="w-screen lg:w-full min-h-screen">
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen flex flex-col justify-center items-center">
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
