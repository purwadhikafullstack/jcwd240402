import React from "react";

const StaticBanner = ({ banner6, banner7 }) => {
  return (
    <div className="my-8">
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
