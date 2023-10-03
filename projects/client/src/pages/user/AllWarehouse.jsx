import React, { useEffect, useState } from "react";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import { Link } from "react-router-dom";
import axios from "../../api/axios";
import Maps from "../../components/user/Maps";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import addressEmpty from "../../assets/images/addressEmpty.png";
import Loading from "../../components/Loading";
import emptyImage from "../../assets/images/emptyImage.jpg";

const AllWarehouse = () => {
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");
  const userData = useSelector((state) => state.profiler.value);

  const [warehouseList, setWarehouseList] = useState([]);
  const [closestWarehouse, setClosestWarehouse] = useState({});
  const [currentPrimaryAddress, setCurrentPrimaryAddress] = useState({});
  const [newAccessToken, setNewAccessToken] = useState("");
  const [loading, setLoading] = useState(true);

  const primaryAddress = userData.User_detail?.address_user_id;

  useEffect(() => {
    if (!access_token || !refresh_token || userData.role_id !== 3) {
      return;
    }
    axios
      .post(
        "/user/warehouse-closest",
        {
          primary_address_id: primaryAddress,
        },
        { headers: { Authorization: `Bearer ${access_token}` } }
      )
      .then((res) => {
        setClosestWarehouse(res.data?.closest_warehouse);
        setCurrentPrimaryAddress(res.data?.address?.Address_user);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (
          error.response?.data?.message === "Invalid token" &&
          error.response?.data?.error?.name === "TokenExpiredError"
        ) {
          axios
            .get("/user/auth/keep-login", {
              headers: { Authorization: `Bearer ${refresh_token}` },
            })
            .then((res) => {
              setNewAccessToken(res.data?.accessToken);
              setCookie("access_token", newAccessToken, 1);
            });
        }
      });
  }, [
    access_token,
    newAccessToken,
    primaryAddress,
    refresh_token,
    userData.role_id,
  ]);

  useEffect(() => {
    axios.get("/user/all-warehouse").then((res) => {
      setWarehouseList(res.data?.result);
      setLoading(false);
    });
  }, []);

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
      <div className="min-h-screen mx-6 space-y-4 md:space-y-4 lg:space-y-4 lg:mx-32">
        {/* CARD CLOSEST WAREHOUSE */}
        <div className="min-h-screen mx-6 space-y-4 md:space-y-4 lg:space-y-4 lg:mx-32">
          {primaryAddress ? (
            <div>
              <h1 className="font-bold lg:text-xl mb-2">
                Closest Warehouse From Your Address
              </h1>
              <div className="grid md:grid-cols-12 lg:grid-cols-12">
                <div className="md:col-span-8 lg:col-span-8 h-80 w-full">
                  <img
                    src={
                      closestWarehouse.warehouse_img
                        ? `${process.env.REACT_APP_API_BASE_URL}${closestWarehouse.warehouse_img}`
                        : emptyImage
                    }
                    alt="warehouse"
                    className="object-cover h-full w-full"
                  />
                </div>
                <div className="md:col-span-4 space-y-2 w-full lg:col-span-4 text-white bg-blue2 text-xs p-4 md:p-8 lg:p-8">
                  <h1 className="font-bold md:text-base lg:text-xl">
                    {closestWarehouse.warehouse_name}
                  </h1>
                  <h1 className="font-bold md:text-base lg:text-xl">
                    {closestWarehouse.City?.name},{" "}
                    {closestWarehouse.City?.Province?.name}
                  </h1>
                  <h1>{closestWarehouse.address_warehouse}</h1>
                  <h1 className="text-justify">
                    Our warehouse is the perfect place to discover the finest
                    furniture at affordable prices. With top-notch quality, our
                    collection will make your home feel more comfortable and
                    beautiful.
                  </h1>
                </div>
              </div>
              <div className="grid md:grid-cols-12 lg:grid-cols-12 w-full h-full">
                <div className="md:col-span-4 lg:col-span-4 text-white bg-blue2 text-xs p-4 md:p-8 lg:p-8 space-y-4">
                  <div>
                    <p className="text-sm">Your Address : </p>
                    <p className="font-bold md:text-base lg:text-xl-bold">
                      {currentPrimaryAddress.address_title}
                    </p>
                    <p className="font-bold md:text-base lg:text-xl">
                      {currentPrimaryAddress.City?.Province?.name},{" "}
                      {currentPrimaryAddress.City?.name}
                    </p>
                  </div>
                  <p>{currentPrimaryAddress.address_details}</p>
                </div>
                <div className="md:col-span-8 lg:col-span-8  h-80">
                  <Maps address={closestWarehouse.address_warehouse} />
                </div>
              </div>
            </div>
          ) : access_token ? (
            <div>
              <div className="grid md:grid-cols-12 lg:grid-cols-12">
                <div className="md:col-span-8 lg:col-span-8 flex justify-center mt-4">
                  <img src={addressEmpty} alt="address empty" />
                </div>
                <div className="md:col-span-4 space-y-2 lg:col-span-4 text-white bg-blue2 text-xs p-4 md:p-8 lg:p-8">
                  <p>
                    Register your address to know the closest warehouse from
                    your location
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* CARD LIST WAREHOUSE */}
          <div className="w-full flex justify-center items-center">
            <h1 className="font-bold lg:text-xl">Furnifor Branch</h1>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 h-full">
            {warehouseList.length === 0 ? (
              <p>we will be there soon</p>
            ) : (
              warehouseList.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="col-span-1 mb-4 h-full bg-blue2 "
                >
                  <div className="h-40">
                    <Link to={``}>
                      <img
                        src={
                          warehouse.warehouse_img
                            ? `${process.env.REACT_APP_API_BASE_URL}${warehouse.warehouse_img}`
                            : emptyImage
                        }
                        alt="warehouse"
                        className="w-full h-full object-cover"
                      />
                    </Link>
                  </div>
                  <div className="text-white space-y-2 text-xs p-4 ">
                    <h1 className=" font-bold text-xl md:text-lg lg:text-lg">
                      {warehouse.warehouse_name}
                    </h1>
                    <p className="font-semibold">
                      {warehouse.City?.name}, {warehouse.City?.Province?.name}
                    </p>
                    <p className="text-justify">
                      {warehouse.address_warehouse}
                    </p>
                    <p>{warehouse.warehouse_contact}</p>
                    <p>Monday - Sunday : 10.00 - 22.00 WIB</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default AllWarehouse;
