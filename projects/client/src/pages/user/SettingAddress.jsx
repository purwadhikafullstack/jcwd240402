import React, { useEffect, useState } from "react";
import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import CardProfile from "../../components/CardProfile";
import NavigatorSetting from "../../components/NavigatorSetting";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import ModalAddAddress from "../../components/Modals/ModalAddAddress";
import axios from "../../api/axios";
import { getCookie } from "../../utils/tokenSetterGetter";
import CardAddress from "../../components/CardAddress";

const SettingAddress = () => {
  const access_token = getCookie("access_token");
  const [userAddress, setUserAddress] = useState([]);

  useEffect(() => {
    axios
      .get("/user/profile/address", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => setUserAddress(res.data?.result))
      .catch((err) => console.log(err));
  }, [access_token]);

  console.log(userAddress);
  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mt-4 mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32 ">
        <div className=" lg:grid lg:grid-cols-5 gap-4 mb-4 lg:mb-0 ">
          <CardProfile />
          <div className=" lg:col-span-4 w-full mt-4 md:mt-0 lg:mt-0 rounded-lg shadow-card-1">
            <NavigatorSetting />
            <div className="m-4">
              {/* BUTTON ADD ADDRESS */}
              <div className=" mb-4 flex justify-end">
                <ModalAddAddress />
              </div>
              <>
                {userAddress.map((address) => (
                  <CardAddress
                    key={address.id}
                    address_title={address.address_title}
                    address_details={address.address_details}
                    city={address.City?.name}
                    id={address.id}
                  />
                ))}
              </>
            </div>
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default SettingAddress;
