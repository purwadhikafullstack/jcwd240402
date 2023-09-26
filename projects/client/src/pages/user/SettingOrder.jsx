import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import NavigatorSetting from "../../components/user/navbar/NavigatorSetting";
import CardProfile from "../../components/user/card/CardProfile";
import axios from "../../api/axios";
import {
  getCookie,
  getLocalStorage,
  setCookie,
} from "../../utils/tokenSetterGetter";
import withAuthUser from "../../components/user/withAuthUser";

import { Badge } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import orderempty from "../../assets/images/emptyorder.png";
import InfiniteScroll from "react-infinite-scroll-component";
import loadingfurnifor from "../../assets/icons/iconfurnifor.png";
import { AiOutlineSearch } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import invoiceidnotfound from "../../assets/images/invoiceidnotfound.png";
import { rupiahFormat } from "../../utils/formatter";
import emptyImage from "../../assets/images/emptyImage.jpg";

const SettingOrder = () => {
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
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search");

  useEffect(() => {
    getList();
  }, [lastId, limit, keyword, searchQuery]);

  const getList = async () => {
    try {
      const response = await axios.get(
        `/user/order-scroll?${
          searchQuery && `search=${searchQuery}`
        }&lastId=${lastId}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      const newList = response.data.order;

      setList([...list, ...newList]);
      setTempId(response.data.lastId);
      setHasMore(response.data.hasMore);
    } catch (error) {
      setErrMsg(error.response.data.message);
    }
  };

  const fetchMore = () => {
    setTimeout(() => {
      setLastId(tempId);
    }, 1000);
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

  const searchData = (e) => {
    e.preventDefault();
    setLastId(0);
    setList([]);
    setKeyword(query);
    setSearchParams({ search: query });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  }

  /* 
1 = payment pending
2 = awaiting payment confirmation
3 = completed   
4 = In Process
5 = cancelled
6 = shipped
7 = order confirmed
*/

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
                <img src={orderempty} alt="order empty" className="w-72" />
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
                  <div className="animate-bounce flex gap-4 my-4 justify-center items-center">
                    <img src={loadingfurnifor} alt="loading" />
                  </div>
                }
                endMessage={
                  <div className="flex flex-col gap-4 my-4 justify-center items-center">
                    <img
                      src={loadingfurnifor}
                      alt="end scroll"
                      className="w-8"
                    />
                  </div>
                }
              >
                <div className="mx-6 md:mx-10 lg:md-10 mt-4 rounded-lg">
                  <form
                    action=""
                    onSubmit={searchData}
                    className="flex  w-full justify-between"
                  >
                    <input
                      type="text"
                      placeholder="Search Invoice ID"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                      }}
                      className=" border-gray-400 w-full rounded-l-lg text-inherit"
                    />
                    <button
                      type="submit"
                      className="bg-blue3 p-2 w-16 flex justify-center items-center  rounded-r-lg"
                    >
                      <AiOutlineSearch className="text-xl text-white font-bold" />
                    </button>
                  </form>
                </div>
                {list.length !== 0 ? (
                  <>
                    {list?.map((order, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between mt-4 mx-6 md:mx-10 lg:mx-10 px-4 py-1 rounded-t-md shadow-card-1 text-sm font-semibold">
                          <h4>
                            {dayjs(order.createdAt).format("D MMMM YYYY")}
                          </h4>
                          <h4>Invoice ID: {order?.no_invoice?.substr(-8)}</h4>
                        </div>
                        <div
                          key={order.id}
                          className="grid grid-cols-12 mx-6 md:mx-10 lg:mx-10 rounded-b-sm  lg p-2 shadow-card-1 border-2"
                        >
                          <div className="text-xs h-fit rounded-lg col-span-12 md:col-span-12 lg:col-span-12 ">
                            <div className="flex  flex-col-reverse flex-none md:flex-row-reverse lg:flex-row-reverse md:justify-between lg:justify-between">
                              <div>
                                <div>
                                  <h1>
                                    Order Total:{" "}
                                    {rupiahFormat(order.total_price)}
                                  </h1>
                                  <h1>
                                    Courier Used: {order.delivery_courier}
                                  </h1>
                                </div>
                                <div>
                                  <Badge
                                    color={
                                      order.Order_status?.id === 1
                                        ? "indigo"
                                        : order.Order_status?.id === 2
                                        ? "purple"
                                        : order.Order_status?.id === 3
                                        ? "warning"
                                        : order.Order_status?.id === 4
                                        ? "success"
                                        : order.Order_status?.id === 5
                                        ? "gray"
                                        : order.Order_status?.id === 6
                                        ? "info"
                                        : order.Order_status?.id === 7
                                        ? "failure"
                                        : "pink"
                                    }
                                    className="w-fit"
                                  >
                                    {order.Order_status?.name}
                                  </Badge>
                                </div>
                              </div>
                              <div className="">
                                {order.Order_details?.map((details) => (
                                  <div className="flex ml-4 mb-2 text-xs gap-2 h-fit rounded-lg">
                                    <img
                                      src={
                                        details.Warehouse_stock?.Product
                                          ?.Image_products[0]?.img_product
                                          ? `${process.env.REACT_APP_API_BASE_URL}${details.Warehouse_stock?.Product?.Image_products[0]?.img_product}`
                                          : emptyImage
                                      }
                                      alt="product"
                                      className="w-20 object-cover"
                                    />
                                    <div>
                                      <h1 className="font-bold">
                                        {details.Warehouse_stock?.Product?.name}
                                      </h1>
                                      <h1> {details.quantity} unit</h1>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {order.Order_status?.id === 1 ||
                            order.Order_status?.id === 7 ? (
                              <Link
                                to={`/order-confirm/${order?.no_invoice?.substr(
                                  -8
                                )}`}
                              >
                                <button className="w-full bg-blue3 p-2 mt-2 font-semibold text-white rounded-md">
                                  Order Confirmation
                                </button>
                              </Link>
                            ) : order.Order_status?.id === 6 ? (
                              <>
                                <div className="flex justify-end items-center">
                                  <TbTruckDelivery className="text-xl " />

                                  <h1 className="font-semibold">
                                    {dayjs(order.delivery_time).format(
                                      "D MMMM YYYY HH:mm:ss"
                                    )}
                                  </h1>
                                </div>

                                <Link
                                  to={`/order-confirm/${order?.no_invoice?.substr(
                                    -8
                                  )}`}
                                >
                                  <button className="w-full bg-green-400 p-2 mt-2 font-semibold text-white rounded-md">
                                    Confirm Order Completed
                                  </button>
                                </Link>
                              </>
                            ) : null}
                            {order.Order_status?.id === 2 ||
                            order.Order_status?.id === 3 ||
                            order.Order_status?.id === 4 ||
                            order.Order_status?.id === 5 ? (
                              <Link
                                to={`/order-confirm/${order?.no_invoice?.substr(
                                  -8
                                )}`}
                              >
                                <button
                                  className={`w-full ${
                                    order.Order_status?.id === 2
                                      ? "bg-purplebg text-purpleText"
                                      : order.Order_status?.id === 3
                                      ? "bg-warningbg text-warningText"
                                      : order.Order_status?.id === 4
                                      ? "bg-successbg text-successText"
                                      : order.Order_status?.id === 5
                                      ? "bg-gray-200 text-grayText"
                                      : order.Order_status?.id === 6
                                      ? "bg-infobg text-infoText"
                                      : "bg-defaultbg text-defaultText"
                                  } p-2 mt-2 font-semibold rounded-md`}
                                >
                                  See Details Product Order
                                </button>
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="p-4 w-full flex flex-col justify-center items-center">
                    <img
                      src={invoiceidnotfound}
                      alt="invoice not found"
                      className="w-72"
                    />
                    <h4 className="text-center text-xs text-grayText ">
                      The invoice ID you are looking for was not found
                    </h4>
                  </div>
                )}
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
