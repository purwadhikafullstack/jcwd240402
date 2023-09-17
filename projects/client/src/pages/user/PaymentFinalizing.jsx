import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import BreadCrumb from "../../components/user/navbar/BreadCrumb";
import emptyImage from "../../assets/images/emptyImage.jpg";
import Button from "../../components/Button";
import Loading from "../../components/Loading";
import CarouselProductDetail from "../../components/user/carousel/CarouselProductDetail";

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
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [productReview, setProductReview] = useState([]);

  const inputPhotoRef = useRef();
  const location = useLocation();

  function handleChange(event) {
    const selectedImage = event.target.files[0];
    setShowImage(URL.createObjectURL(selectedImage));
    setFile(event.target.files[0]);
    setIsFilePicked(true);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .patch(`/user/payment-proof/${location.pathname.split("/").pop()}`, formData, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setPaymentProofData(res.data?.order);
        setLoading(false);
        setTimeout(() => {
          navigate(`/user/setting/order`);
        }, 3000);
      })
      .catch((error) => {
        setLoading(false);
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
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
        });
    }
  }, [access_token, newAccessToken, refresh_token]);

  useEffect(() => {
    axios
      .get("/user/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(profileUser(res.data?.result));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get("/user/profile/address", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(addressUser(res.data?.result));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [access_token, dispatch]);

  useEffect(() => {
    axios
      .get(`/user/order/${location.pathname.split("/").pop()}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        setYourOrder(res.data?.order);
        setProductReview(
          res.data?.order?.Order_details[0]?.Warehouse_stock?.Product
            ?.Image_products
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [access_token, dispatch]);

  const product = productReview.map((item) => {
    let image;
    image = {
      image: `${process.env.REACT_APP_API_BASE_URL}${item?.img_product}`,
    };
    return image;
  });

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
      <BreadCrumb
        crumbs={[
          { title: ["Profile"], link: "/user/setting" },
          { title: ["Order"], link: "/user/setting/order" },
          { title: ["Payment"], link: "/payment" },
        ]}
      />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-2 lg:space-y-2 lg:mx-32 mb-4">
        {/* decor aka */}
        <h1 className="font-bold text-xl">Payment</h1>
        <div className=" grid gap-4 grid-rows-2 md:grid lg:grid md:grid-cols-2 md:grid-rows-none lg:grid-cols-2 lg:grid-rows-none ">
          <div className="row-span-2 md:col-span-1 lg:col-span-1 grid justify-center items-center w-full h-full">
            <h1>{yourOrder?.delivery_time}</h1>
            {yourOrder?.Order_details?.map((details) => (
              <div className="p-1" key={details.id}>
                <div className="md:flex shadow-card-1 w-fit rounded-lg md:flex-col md:justify-center md:items-center ">
                  <div className="flex  w-full justify-evenly items-center font-bold text-sm text-grayText">
                    <h1 className="py-1">
                      Order Total: {toRupiah(yourOrder?.total_price)}
                    </h1>
                    <h1>|</h1>
                    <h1 className="py-1">
                      Courier Used: {yourOrder?.delivery_courier}
                    </h1>
                  </div>
                  <div className="text-xs shadow-card-1 p-4 h-fit rounded-lg  md:w-96 lg:w-96">
                    <div>
                      <div className="flex flex-col justify-center items-center">
                        {/* <CarouselProductDetail
                          data={product}
                          width="300px"
                          height="300px"
                        /> */}
                      </div>

                      <div className="flex items-center gap-4 mb-2">
                        <h1 className=" font-bold text-base">
                          {details?.Warehouse_stock?.Product?.name}
                        </h1>
                        <Badge color="purple" className="w-fit">
                          {details?.Warehouse_stock?.Product?.category?.name}
                        </Badge>
                      </div>
                      <h1>
                        {toRupiah(details?.Warehouse_stock?.Product?.price)} x{" "}
                        {details?.quantity} unit
                      </h1>
                      <h1 className="">
                        {details?.Warehouse_stock?.Product?.weight} gr
                      </h1>
                      <h1 className="">
                        {details?.Warehouse_stock?.Product?.description}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <div className=" flex flex-col justify-start items-center ">
              <div className="shadow-card-1 p-4 space-y-4 flex flex-col justify-center items-center rounded-lg">
                <h1 className="text-sm font-semibold">upload payment proof</h1>
                <div className="md:w-96 lg:w-96">
                  <img
                    src={showImage ? showImage : `${emptyImage}`}
                    alt=""
                    className="object-cover w-full"
                  />
                </div>

                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  className="border-2 w-40 hidden"
                  ref={inputPhotoRef}
                />
                <div className="flex gap-4">
                  <Button
                    onClick={() => inputPhotoRef.current.click()}
                    buttonSize="small"
                    buttonText="Choose"
                    type="button"
                    bgColor="bg-green-400"
                    colorText="text-white"
                    fontWeight="font-semibold"
                  />
                  <Button
                    onClick={() => {
                      setShowImage(false);
                    }}
                    buttonSize="small"
                    buttonText="Cancel"
                    type="button"
                    bgColor="bg-red-400"
                    colorText="text-white"
                    fontWeight="font-semibold"
                  />
                </div>
                <button
                  className="w-full bg-blue3 p-2 font-semibold text-white rounded-md"
                  onClick={handleSubmit}
                  type="submit"
                >
                  Upload
                </button>
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
