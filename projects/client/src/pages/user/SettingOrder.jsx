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
import withAuthUser from "../../components/user/withAuthUser";
import toRupiah from "@develoka/angka-rupiah-js";
import { Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";


const SettingOrder = () => {
  const userData = useSelector((state) => state.profiler.value);
  const [newAccessToken, setNewAccessToken] = useState("");
  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");
  const [userOrder, setUserOrder] = useState([])
  const [orderStatus, setOrderStatus] = useState([])
  const navigate = useNavigate();
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
      .get("/user/order", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => 
      setUserOrder(res.data.order)
      );
  }, []);

  const handleClickStatus = (id, status) => {
    axios
      .post(
        "/user/order-status",
        {
          id: id,
          statusId: status,
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      )
      .then((res) => {
        setOrderStatus(res.data.order)
        navigate(0);
        }
      );
  };

  const OrderButton = ({statusBefore, orderId}) => {

    if(statusBefore === 6){
      return (<button className="w-full bg-blue3 p-2 font-semibold text-white rounded-md" onClick={() => handleClickStatus(orderId, 3)}>Confirm</button>)
    }else if(statusBefore === 5){
      return (<button className="w-full bg-danger3 p-2 font-semibold text-white rounded-md" disabled={true}>Order Canceled</button>)
    }else{
      return <button className="w-full bg-danger1 p-2 font-semibold text-white rounded-md" onClick={() => handleClickStatus(orderId, 5)}>Cancel</button>
    }
    
  }

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mt-4 mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32 ">
        <div className="lg:grid lg:grid-cols-5 gap-4 mb-4 md:mb-0 lg:mb-0 ">
          <CardProfile />
          <div className="lg:col-span-4 w-full mt-4 md:mt-0 lg:mt-0 rounded-lg shadow-card-1">
            <NavigatorSetting />
            <>
                {userOrder.length === 0 ? (
                  <div className="p-4 w-full flex flex-col justify-center items-center">
                    <div className="text-center text-xs ">
                      <h4>
                        you have not made any order yet
                      </h4>
                    </div>
                  </div>
                ) : (
                  userOrder.map((order) => (
                    <div className="grid grid-cols-2 p-4">
                      <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">
                      <h1>{order.delivery_time}</h1>
                      {order.Order_details.map((details) => (
                    <div className="p-1">
                      <div className="text-xs border-2 p-4 h-fit rounded-lg md:col-span-1 md:sticky md:top-16 lg:col-span-1 lg:sticky lg:top-16">        
                          <h1 className="font-bold">{details.Warehouse_stock?.Product?.name}</h1>
                          <h1> {details.quantity} unit</h1>
                      </div>               
                    </div>
                    ))}
                    <h1>Order Total: {toRupiah(order.total_price)}</h1>
                    <h1>Courier Used: {order.delivery_courier}</h1>
                    <Badge color="green" className="w-fit">
                      {order.Order_status?.name}
                    </Badge>
                      </div>
                      
                    <OrderButton statusBefore={order.Order_status?.id} orderId={order.id} />

                    {/* {order.Order_status?.id === 6 ? (
                      <button className="w-full bg-blue3 p-2 font-semibold text-white rounded-md" onClick={() => handleClickStatus(order.id, 3)}>Confirm</button>
                    ) : (
                      <button className="w-full bg-danger1 p-2 font-semibold text-white rounded-md" onClick={() => handleClickStatus(order.id, 5)}>Cancel</button>
                    )} */}
                    </div>
                  ))
                )}
              </>
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default withAuthUser(SettingOrder);
