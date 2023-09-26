import React from "react";
import {
  AiFillCloseCircle,
  AiFillPlusSquare,
  AiFillMinusSquare,
} from "react-icons/ai";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import { getCookie, getLocalStorage } from "../../utils/tokenSetterGetter";
import ModalLogin from "../../components/user/modal/ModalLogin";
import productNotFound from "../../assets/images/productNotFound.png";
import ShowCaseProduct from "../../components/user/ShowCaseProduct";
import AlertWithIcon from "../../components/AlertWithIcon";

const NotFoundProduct = () => {
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 mb-8 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
          <div className="md:flex md:items-center  lg:flex lg:flex-col lg:items-center lg:col-span-2 lg:w-full lg:h-full">
            <div className="w-full h-full mt-10 flex flex-col justify-center items-center ">
              <AlertWithIcon errMsg={`product not found`} />
              <img
                src={productNotFound}
                alt="product not found"
                className="w-1/2 lg:w-2/3"
              />
            </div>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-16 lg:h-fit p-4 lg:p-4 ">
            <hr />
            <div className="flex justify-between mt-4">
              <p>Amount:</p>
              <div className="flex justify-between items-center w-24  rounded-full px-1">
                <button className="px-1 cursor-not-allowed" disabled>
                  <AiFillMinusSquare className=" text-gray-400 text-2xl" />
                </button>
                <p>0</p>
                <button className="px-1 cursor-not-allowed" disabled>
                  <AiFillPlusSquare className="text-gray-400 text-2xl" />
                </button>
              </div>
            </div>
            <div className="my-4">
              {!refresh_token || !access_token ? (
                <h1 className="">
                  please log in to get add to cart access{" "}
                  <span>
                    <ModalLogin buttonText="click here" />
                  </span>
                </h1>
              ) : (
                <button
                  className="bg-gray-400 cursor-not-allowed
                   text-white w-full h-10 rounded-full"
                  disabled
                >
                  add to cart
                </button>
              )}

              <div className="flex justify-start items-center mt-2">
                <AiFillCloseCircle className="text-red-500" />
                <h1 className="text-xs ">This product is unavailable</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="relative z-0">
          <ShowCaseProduct perPage={10} />
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default NotFoundProduct;
