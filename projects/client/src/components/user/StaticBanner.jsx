import React from "react";

import banner6 from "../../assets/images/banner_6.png";
import banner7 from "../../assets/images/banner_7.png";

const StaticBanner = () => {
  return (
    <div className="">
      <div className="flex flex-col gap-y-2 lg:grid lg:grid-cols-5 md:grid md:grid-cols-5  md:gap-x-4 lg:gap-x-4">
        <div className="col-span-3 relative">
          <img
            src={banner6}
            alt="static banner"
            className="relative object-cover rounded-lg"
          />
          <h1 className="absolute inset-0 lg:text-2xl md:text-lg text-xs p-4 text-white text-center font-semibold flex items-center justify-center">
            Find premium furnishings with quality and affordability at FURNIFOR
          </h1>
        </div>
        <div className="col-span-2 relative flex justify-center items-center">
          <img
            src={banner7}
            alt="static banner"
            className="object-cover h-full rounded-lg"
          />
          <h1 className="absolute inset-0 lg:text-2xl md:text-lg text-xs p-4 text-white text-center font-semibold flex items-center justify-center">
            Ready to adorn your living space with elegance.
          </h1>
        </div>
      </div>
    </div>
  );
};

export default StaticBanner;
