import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import { profileUser } from "../../features/userDataSlice";
import { addressUser } from "../../features/userAddressSlice";
import { cartsUser } from "../../features/cartSlice";
import toRupiah from "@develoka/angka-rupiah-js";
import { Badge } from "flowbite-react";

const PaymentFinalizing = () => {
  const [totalCart, setTotalCart] = useState(0);
  const [paymentProofData, setPaymentProofData] = useState("");
  const [yourOrder, setYourOrder] = useState({});
  const refresh_token = getLocalStorage("refresh_token");
  const [newAccessToken, setNewAccessToken] = useState("");
  const access_token = getCookie("access_token");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [file, setFile] = useState({});
  const [isFilePicked, setIsFilePicked] = useState(false);

  function handleChange(event) {
    setFile(event.target.files[0]);
    setIsFilePicked(true);
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', file.name);

  const handleSubmit = (event) => {
    event.preventDefault()
      axios
        .patch("/user/payment-proof", formData, {
          headers: { Authorization: `Bearer ${access_token}` },
        })
        .then((res) => {
          setPaymentProofData(res.data?.order)
          setTimeout(() => {
            navigate(`/user/setting/order`);
          }, 3000);
        });
    };

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
        dispatch(profileUser(res.data?.result))
      });
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

  useEffect(() => {
    axios
      .get("/user/cart", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(cartsUser(res.data?.result));
        setTotalCart(res.data?.total);
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/current-order", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setYourOrder(res.data?.order);
      });
  }, [access_token, dispatch]);

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <h1 className="text-xl font-bold">Payment</h1>
        <div className="p-4">
              <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
                    <div className="p-4">
                      <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
                      <h1>{yourOrder?.delivery_time}</h1>
                      {yourOrder?.Order_details?.map((details) => (
                    <div className="p-1">
                      <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">        
                          <h1 className="font-bold">{details?.Warehouse_stock?.Product?.name}</h1>
                          <h1> {details?.quantity} unit</h1>
                      </div>               
                    </div>
                  ))}
                  <h1>Order Total: {yourOrder?.total_price}</h1>
                  <h1>Courier Used: {yourOrder?.delivery_courier}</h1>
                  <form>
                    <h1>Upload Payment Proof</h1>
                    <input type="file" name="file" onChange={handleChange}/>
                    {isFilePicked ? (
                      <div>
                        <p>Filename: {file.name}</p>
                        <p>Filetype: {file.type}</p>
                        <p>Size in bytes: {file.size}</p>
                        <p>
                          lastModifiedDate:{' '}
                          {file.lastModifiedDate.toLocaleDateString()}
                        </p>
                      </div>
                    ) : (
                      <p>Select a file to show details</p>
                    )}
                    <button onClick={handleSubmit} type="submit">Upload</button>
                  </form>
                  <Badge color="green" className="w-fit">
                      {yourOrder?.Order_status?.name}
                    </Badge>
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

export default PaymentFinalizing;
