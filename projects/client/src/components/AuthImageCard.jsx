import React from "react";

const AuthImageCard = ({ imageSrc }) => {
  return (
    <div className="lg:col-span-1 lg:grid">
      <img
        src={imageSrc}
        alt="display login"
        className="hidden lg:block lg:w-1/2 lg:ml-52"
      />
      <div className="hidden lg:grid lg:justify-center ">
        <p className="text-center font-bold">Easy Buying at Warehouse</p>
        <p>Join and experience the convenience of transacting at Warehouse.</p>
      </div>
    </div>
  );
};

export default AuthImageCard;
