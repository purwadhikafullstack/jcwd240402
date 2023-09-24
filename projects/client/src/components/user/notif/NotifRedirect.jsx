import React from "react";
import { Link } from "react-router-dom";

import ButtonLink from "../../ButtonLink";

const NotifRedirect = ({ imgSrc, to, msg, buttonText, toPage }) => {
  return (
    <div className="mb-24 flex flex-col justify-start items-center mx-10">
      <img src={imgSrc} alt="redirect" className="w-64 md:1/3 lg:w-1/3" />
      <h1 className="text-xs mb-3 font-semibold text-grayText text-center">
        {msg}
        <Link to={to}>
          <span className="font-bold text-blue3"> {toPage}</span>
        </Link>{" "}
      </h1>
      <ButtonLink
        buttonSize="small"
        buttonText={buttonText}
        bgColor="bg-blue3"
        colorText="text-white"
        fontWeight="font-bold"
        type="button"
        to={to}
      />
    </div>
  );
};

export default NotifRedirect;
