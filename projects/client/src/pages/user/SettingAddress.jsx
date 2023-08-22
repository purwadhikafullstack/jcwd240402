import React, { useEffect, useState } from "react";
import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import CardProfile from "../../components/CardProfile";
import NavigatorSetting from "../../components/NavigatorSetting";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import ModalAddAddress from "../../components/Modals/ModalAddAddress";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import CardAddress from "../../components/CardAddress";
import { useDispatch, useSelector } from "react-redux";
import { addressUser } from "../../features/userAddressSlice";
import { profileUser } from "../../features/userDataSlice";
import addressEmpty from "../../assets/images/addressEmpty.png";
import withAuthUser from "../../components/withAuthUser";

const SettingAddress = () => {
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const addressData = useSelector((state) => state.addresser.value);

  useEffect(() => {
    if (!access_token && refresh_token) {
      axios
        .get("/user/auth/keep-login", {
          headers: { Authorization: `Bearer ${refresh_token}` },
        })
        .then((res) => {
          setNewAccessToken(res.data?.accessToken);
          setCookie("access_token", newAccessToken, 1);
        });
    }
  }, [access_token, newAccessToken, refresh_token]);

  useEffect(() => {
    axios
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => dispatch(profileUser(res.data?.result)));
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/profile/address", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(addressUser(res.data?.result));
      });
  }, [access_token, dispatch]);

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
                {addressData.length === 0 ? (
                  <div className="p-4 w-full flex flex-col justify-center items-center">
                    <div>
                      <img src={addressEmpty} alt="" />
                    </div>
                    <div className="text-center text-xs ">
                      <h4>
                        Your address has not been registered yet. Please kindly
                        add your address by clicking the 'Add Address' button
                      </h4>
                    </div>
                  </div>
                ) : (
                  addressData.map((address) => (
                    <CardAddress
                      key={address.id}
                      address_title={address.address_title}
                      address_details={address.address_details}
                      city={address.City?.name}
                      id={address.id}
                    />
                  ))
                )}
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

export default withAuthUser(SettingAddress);
