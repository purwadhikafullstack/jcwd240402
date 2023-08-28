import React from "react";
import { useSelector } from "react-redux";
import { BiUser } from "react-icons/bi";

import coupon from "../../../assets/icons/coupon.png";
import BadgeTag from "../../BadgeTag";

const CardProfile = () => {
  const userData = useSelector((state) => state.profiler.value);
  return (
    <div className="md:col-span-1 lg:col-span-1 rounded-xl h-56 md:h-52 md:mb-4 items-center lg:h-fit shadow-card-1 ">
      <div className="flex items-center p-2 gap-5 border-b-2 border-gray-300  ">
        <img
          src={`${process.env.REACT_APP_API_BASE_URL}/${userData.User_detail?.img_profile}`}
          alt=""
          className="rounded-full w-16"
        />
        <div className="text-gray-600">
          <h3 className="flex items-center gap-x-2">
            <BiUser />
            <span className="font-bold">{userData.username}</span>
          </h3>
          <h3 className="text-sm mb-2">
            {userData.User_detail?.first_name} {userData.User_detail?.last_name}
          </h3>
          {userData.is_verify ? (
            <BadgeTag msg="verified" color="success" />
          ) : (
            <BadgeTag msg="unverified" color="failure" />
          )}
        </div>
      </div>
      <div className="border-2 m-4 flex flex-col gap-2 p-2 rounded-lg">
        <img src={coupon} alt="" className="w-20" />
        <h3 className="text-xs">
          <span className="font-semibold">Use Free Shipping more often!</span>{" "}
          Subscribe to{" "}
          <span className="font-semibold">
            FORNIFOR starting from Rp15k/month.
          </span>
        </h3>
      </div>
    </div>
  );
};

export default CardProfile;
