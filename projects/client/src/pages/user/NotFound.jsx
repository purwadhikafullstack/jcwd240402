import React from "react";

import notFound from "../../assets/images/notFound.png";

import NotifRedirect from "../../components/user/notif/NotifRedirect";

const NotFound = ({ to, buttonText, toPage }) => {
  const msg = "No worries! Just head back to the";
  return (
    <div className="w-full lg:w-full h-screen">
      <div className="min-h-screen flex flex-col justify-center items-center">
        <NotifRedirect
          imgSrc={notFound}
          to={to}
          msg={msg}
          buttonText={buttonText}
          toPage={toPage}
        />
      </div>
    </div>
  );
};

export default NotFound;
