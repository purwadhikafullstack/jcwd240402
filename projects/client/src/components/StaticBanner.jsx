import React from "react";
import banner6 from "../assets/images/banner_6.png";
import banner7 from "../assets/images/banner_7.png";

const StaticBanner = () => {
  return (
    <div className="mt-4 mb-2 lg:my-8">
      <div className="flex justify-evenly">
        <div className="grid grid-cols-5 w-full gap-2 mx-2 md:mx-6">
          <div className=" col-span-3">
            <img src={banner6} alt="" className=" rounded-lg h-full" />
          </div>
          <div className=" col-span-2">
            <img src={banner7} alt="" className=" rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaticBanner;
