import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import NavigatorSetting from "../../components/user/navbar/NavigatorSetting";
import CardProfile from "../../components/user/card/CardProfile";
import { profileUser } from "../../features/userDataSlice";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import ModalEditUsername from "../../components/user/modal/ModalEditUsername";
import ModalEditFirstName from "../../components/user/modal/ModalEditFirstName";
import ModalEditLastName from "../../components/user/modal/ModalEditLastName";
import ModalEditPhone from "../../components/user/modal/ModalEditPhone";
import ModalEditPasswordUser from "../../components/user/modal/ModalEditPasswordUser";
import ModalUploadProfileImage from "../../components/user/modal/ModalUploadProfileImage";
import withAuthUser from "../../components/user/withAuthUser";
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import emptyImage from "../../assets/images/emptyImage.jpg";

const SettingProfile = () => {
  const userData = useSelector((state) => state.profiler.value);
  const [newAccessToken, setNewAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();

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
      .then((res) => {
        dispatch(profileUser(res.data.result));
        setLoading(false);
      });
  }, [access_token, dispatch]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb crumbs={[{ title: ["Profile"], link: "/user/setting" }]} />
      <div className="min-h-screen mt-4 mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32 ">
        <div className="lg:grid lg:grid-cols-5 gap-4 mb-4 md:mb-0 lg:mb-0 ">
          <CardProfile />
          <div className="lg:col-span-4 w-full mt-4 md:mt-0 lg:mt-0 rounded-lg shadow-card-1">
            <NavigatorSetting />
            <div className="pb-4 md:flex lg:flex">
              {/* CARD PHOTO */}
              <div className=" rounded-lg shadow-card-1 p-2 m-4 w-fit">
                <img
                  src={
                    userData?.User_detail?.img_profile
                      ? `${process.env.REACT_APP_API_BASE_URL}${userData?.User_detail?.img_profile}`
                      : emptyImage
                  }
                  alt="profile"
                  className="p-2 w-72"
                />

                <div className="mx-2">
                  <ModalUploadProfileImage />
                </div>
                <div className="w-72">
                  <h5 className="text-xs text-justify mt-2 mx-2">
                    File size: Limited to a maximum of 2 megabytes (MB). Maximum
                    file size: 2,000,000 bytes (2 megabytes). Allowed file
                    extensions: .JPG, .JPEG, .PNG.
                  </h5>
                </div>
              </div>
              {/* PROFILE DETAIL */}
              <div className="mx-4 text-gray-500 text-xs md:text-sm md:mt-4 lg:mt-4 lg:text-sm md:w-full lg:w-full">
                <div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr>
                        <td className="font-semibold text-gray-500 text-sm ">
                          Change Profile
                        </td>
                      </tr>
                      <tr className="h-10 ">
                        <td className="w-32">username</td>
                        <td>
                          {userData.username} <ModalEditUsername />
                        </td>
                      </tr>
                      <tr className="h-10">
                        <td>first name</td>
                        <td>
                          {userData.User_detail?.first_name}
                          <ModalEditFirstName />
                        </td>
                      </tr>
                      <tr className="h-10">
                        <td>last name</td>
                        <td>
                          {userData.User_detail?.last_name}
                          <ModalEditLastName />
                        </td>
                      </tr>
                      <tr>
                        <td className="font-semibold text-gray-500 text-sm ">
                          Change Contact
                        </td>
                      </tr>
                      <tr className="h-10">
                        <td>email</td>
                        <td>{userData.email}</td>
                        <td></td>
                      </tr>

                      <tr className="h-10">
                        <td>phone</td>

                        {userData.User_detail?.phone ? (
                          <td>
                            {userData.User_detail?.phone}
                            <ModalEditPhone />
                          </td>
                        ) : (
                          <td>
                            unregistered
                            <ModalEditPhone />
                          </td>
                        )}
                      </tr>
                      <tr className="h-10">
                        <td>address</td>
                        <td>
                          {userData?.User_detail?.Address_user
                            ?.address_details ? (
                            <span>
                              {userData?.User_detail?.Address_user?.address_details?.slice(
                                0,
                                60
                              )}
                              ...
                            </span>
                          ) : (
                            "unregistered"
                          )}
                          <button className="ml-4">
                            <Link
                              to="/user/setting/address"
                              className="underline decoration-solid text-right text-xs text-blue3"
                            >
                              Edit
                            </Link>
                          </button>
                        </td>
                      </tr>
                      {userData.by_form ? (
                        <>
                          <tr>
                            <td className="font-semibold text-gray-500 text-sm ">
                              Change Password
                            </td>
                          </tr>
                          <tr className="h-10">
                            <td>password</td>

                            <td>
                              •••••••••
                              <ModalEditPasswordUser />
                            </td>
                          </tr>
                        </>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default withAuthUser(SettingProfile);
