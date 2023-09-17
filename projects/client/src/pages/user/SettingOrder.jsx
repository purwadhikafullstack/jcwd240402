import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

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
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import orderempty from "../../assets/images/emptyorder.png";
import InfiniteScroll from "react-infinite-scroll-component";
import loadingfurnifor from "../../assets/icons/iconfurnifor.png";

const SettingOrder = () => {
  const userData = useSelector((state) => state.profiler.value);
  const [newAccessToken, setNewAccessToken] = useState("");
  const refresh_token = getLocalStorage("refresh_token");
  const access_token = getCookie("access_token");
  const [userOrder, setUserOrder] = useState([]);

  const [orderStatus, setOrderStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [list, setList] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const [limit, setLimit] = useState(3);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    getList();
  }, [lastId, limit]);

  const getList = async () => {
    try {
      const response = await axios.get(
        `/user/order-scroll?lastId=${lastId}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      console.log(response.data.order);
      const newList = response.data.order;
      setList([...list, ...newList]);
      setTempId(response.data.lastId);
      setHasMore(response.data.hasMore);
    } catch (error) {
      setErrMsg(error.response.data.message);
      console.log(error.response.data);
    }
  };

  const fetchMore = () => {
    setTimeout(() => {
      setLastId(tempId);
    }, 3000);
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
      .get("/user/order", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setLoading(false);
        setUserOrder(res.data?.order);
      })
      .catch((error) => {
        setLoading(false);
        setErrMsg(error.response?.data?.message);
      });
  }, [access_token]);

  const handleClickStatus = (id, status) => {
    console.log(id);
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
        setLoading(false);
        setOrderStatus(res.data?.order);

        axios
          .get("/user/order", {
            headers: { Authorization: `Bearer ${access_token}` },
          })
          .then((res) => setUserOrder(res.data?.order));
      })
      .catch((error) => {
        setLoading(false);
        setErrMsg(error.response?.data?.message);
      });
  };

  const handleDeleteReserved = (orderId) => {
    console.log(orderId);
    axios
      .delete(`/user/reserved-order/${orderId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => setSuccessMsg(res.data?.message))
      .catch((error) => setErrMsg(error.response?.data?.message));
  };

  const OrderButton = ({ statusBefore, orderId }) => {
    if (statusBefore === 6) {
      return (
        <button
          className="w-full bg-blue3 p-2 font-semibold text-white rounded-md text-xs"
          onClick={() => handleClickStatus(orderId, 3)}
        >
          Confirm
        </button>
      );
    } else if (statusBefore === 5) {
      return (
        <button
          className="w-full bg-danger3 p-2 font-semibold text-white rounded-md text-xs"
          disabled={true}
        >
          Order Canceled
        </button>
      );
    } else {
      return (
        <button
          className="w-full bg-danger1 p-2 font-semibold text-white rounded-md text-xs"
          onClick={() => {
            handleDeleteReserved(orderId);
            handleClickStatus(orderId, 5);
          }}
        >
          Cancel
        </button>
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  console.log(list);

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <BreadCrumb
        crumbs={[
          { title: ["Profile"], link: "/user/setting" },
          { title: ["Order"], link: "/user/setting/order" },
        ]}
      />
      <div className="min-h-screen mt-4 mb-4 mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32 ">
        <div className="lg:grid lg:grid-cols-5 gap-4 mb-4 md:mb-0 lg:mb-0 ">
          <CardProfile />
          <div className="lg:col-span-4 w-full mt-4 md:mt-0 lg:mt-0 rounded-lg shadow-card-1 ">
            <NavigatorSetting />
            {userOrder.length === 0 ? (
              <div className="p-4 w-full flex flex-col justify-center items-center">
                <img src={orderempty} alt="" className="w-72" />
                <h4 className="text-center text-xs text-grayText ">
                  you have not made any order yet
                </h4>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={list.length}
                next={fetchMore}
                hasMore={hasMore}
                loader={
                  <div className="animate-bounce flex gap-4 mb-4 justify-center items-center">
                    <img src={loadingfurnifor} alt="" />
                  </div>
                }
                endMessage={
                  <div className="flex flex-col gap-4 mb-4 justify-center items-center">
                    <img src={loadingfurnifor} alt="" className="w-8" />
                  </div>
                }
              >
                {list?.map((order) => (
                  <>
                    <div className="mt-4 mx-10 px-4 py-1 rounded-t-md shadow-card-1">
                      <h4 className="text-sm font-semibold">
                        {dayjs(order.createdAt).format("D MMMM YYYY")}
                      </h4>
                    </div>
                    <div
                      key={order.id}
                      className="grid grid-cols-12 mx-10 rounded-lg p-2 shadow-card-1 border-2"
                    >
                      <div className="text-xs h-fit rounded-lg col-span-9 md:col-span-9 lg:col-span-9 ">
                        <h1>{order.delivery_time}</h1>
                        {order.Order_details?.map((details) => (
                          <div className="flex ml-4 mb-2 text-xs gap-2 h-fit rounded-lg">
                            <img
                              src={`${process.env.REACT_APP_API_BASE_URL}${details.Warehouse_stock?.Product?.Image_products[0]?.img_product}`}
                              alt=""
                              className="w-20 object-cover"
                            />
                            <div>
                              <h1 className="font-bold">
                                {details.Warehouse_stock?.Product?.name}
                              </h1>
                              <h1> {details.quantity} unit</h1>

                              <h1>
                                Order Total: {toRupiah(order.total_price)}
                              </h1>
                              <h1>Courier Used: {order.delivery_courier}</h1>
                              <Badge color="green" className="w-fit">
                                {order.Order_status?.name}
                              </Badge>
                            </div>
                          </div>
                        ))}

                        {order.Order_status?.id == 1 ? (
                          <Link
                            to={"/payment/" + order?.no_invoice?.substr(-8)}
                          >
                            <button className="w-full bg-blue3 p-2 mt-2 font-semibold text-white rounded-md">
                              Finish Payment
                            </button>
                          </Link>
                        ) : null}
                      </div>

                      <div className="col-span-3 grid justify-center items-center text-xs md:col-span-3 lg:col-span-3">
                        <OrderButton
                          statusBefore={order.Order_status?.id}
                          orderId={order.id}
                        />
                      </div>
                    </div>
                  </>
                ))}
              </InfiniteScroll>
            )}
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default withAuthUser(SettingOrder);
