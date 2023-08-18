import React from "react";
import { useSelector } from "react-redux";
import ModalChangeAddress from "./Modals/ModalChangeAddress";

const CardAddress = ({ address_title, address_details, city, id }) => {
  const userData = useSelector((state) => state.profiler.value);
  return (
    <div className="w-full pb-4">
      <div className="text-xs bg-blue5 rounded-lg  p-4">
        <h4 className="font-bold text-sm md:text-xl lg:text-base">
          {address_title}
        </h4>
        <h4>{city}</h4>
        <h4>{userData.username}</h4>
        <h4>{userData.User_detail?.phone}</h4>
        <h4>{address_details}</h4>
        <div className="flex justify-evenly md:justify-start lg:justify-start gap-5 text-[10px] md:text-xs mt-3">
          {/* <button>change address</button> */}
          <ModalChangeAddress id={id} />
          <button>Set as Primary Address</button>
          <button>delete address</button>
        </div>
      </div>
    </div>
  );
};

export default CardAddress;
