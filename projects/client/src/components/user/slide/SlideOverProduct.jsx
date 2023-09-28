import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  AiFillCloseCircle,
  AiFillCheckCircle,
  AiFillMinusSquare,
  AiFillPlusSquare,
} from "react-icons/ai";
import { FaCartArrowDown } from "react-icons/fa";

import { rupiahFormat } from "../../../utils/formatter";
import { weightFormat } from "../../../utils/formatter";
import axios from "../../../api/axios";
import CarouselProductDetail from "../carousel/CarouselProductDetail";
import AccordionProduct from "../accordion/AccordionProduct";
import logo from "../../../assets/images/furniforNav.png";
import { getCookie, getLocalStorage } from "../../../utils/tokenSetterGetter";
import ModalLogin from "../modal/ModalLogin";
import DismissableAlert from "../../DismissableAlert";
import { cartsUser } from "../../../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import ShareButton from "../ShareButton";
import Wishlist from "../Wishlist";
import emptyImage from "../../../assets/images/emptyImage.jpg";

export default function SlideOverProduct({ name }) {
  const access_token = getCookie("access_token");
  const refresh_token = getLocalStorage("refresh_token");

  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState(0);
  const [detailProduct, setDetailProduct] = useState([]);
  const [qty, setQty] = useState(0);
  const [dataImage, setDataImage] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const userData = useSelector((state) => state.profiler.value);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleAddProductToCart = async (name, qty) => {
    try {
      await axios
        .post(
          "/user/cart",
          { product_name: name, qty: qty },
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        )
        .then((res) => {
          setLoading(false);
          axios
            .get("/user/cart", {
              headers: { Authorization: `Bearer ${access_token}` },
            })
            .then((res) => {
              dispatch(cartsUser(res.data?.result));
              setLoading(false);
            });
          setQty(0);
          setSuccessMsg(res.data?.message);
          setOpenAlert(true);
        })
        .catch((error) => {
          setLoading(false);

          setErrMsg(error.response?.data?.message);
          setOpenAlert(true);
          setQty(0);
        });
    } catch (error) {
      if (!error.response) {
        setErrMsg("No Server Response");
      } else {
        setErrMsg(error.response?.data?.message);
        setOpenAlert(true);
        setQty(0);
      }
    }
  };

  useEffect(() => {
    axios
      .get(`/user/warehouse-stock/product/${name}`)
      .then((res) => {
        setDetailProduct(res.data?.result);
        setDataImage(res.data?.result.Image_products);

        setStock(res.data?.remainingStock);
        setLoading(false);
      })
      .then((error) => {
        setLoading(false);
      });
  }, [name]);

  if (loading) {
    return <p></p>;
  }

  const product = dataImage?.map((item) => {
    let image;
    image = {
      image: item?.img_product
        ? `${process.env.REACT_APP_API_BASE_URL}${item?.img_product}`
        : emptyImage,
    };
    return image;
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-blue3 flex justify-center items-center  w-7 h-7 rounded-full"
      >
        <FaCartArrowDown className="text-white" />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="absolute -inset-2.5" />
                          <span className="sr-only">Close panel</span>
                          <AiFillCloseCircle
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          <img
                            src={logo}
                            alt="logo"
                            className=" h-8 md:h-10 lg:h-8"
                          />
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-4 flex-1 px-4 sm:px-6">
                        {successMsg ? (
                          <div className="mx-4 md:mx-0 lg:mx-0 absolute left-0 right-0 flex justify-center items-start z-10">
                            <DismissableAlert
                              successMsg={successMsg}
                              openAlert={openAlert}
                              setOpenAlert={setOpenAlert}
                            />
                          </div>
                        ) : errMsg ? (
                          <div className="mx-4 md:mx-0 lg:mx-0  absolute left-0 right-0 flex justify-center items-start z-10">
                            <DismissableAlert
                              successMsg={errMsg}
                              openAlert={openAlert}
                              setOpenAlert={setOpenAlert}
                              color="failure"
                            />
                          </div>
                        ) : null}
                        <CarouselProductDetail data={product} />
                        <div>
                          <h1 className="font-bold text-xl md:text-3xl lg:text-2xl">
                            {detailProduct?.name}
                          </h1>
                          <h1 className="font-bold text-lg md:text-xl lg:text-xl">
                            {rupiahFormat(detailProduct?.price)}
                          </h1>
                        </div>
                        <div className="flex justify-between mt-4">
                          <p>amount:</p>
                          <div className="flex justify-between items-center w-20  rounded-full px-1">
                            <button
                              onClick={() => (qty <= 0 ? 0 : setQty(qty - 1))}
                              className="px-1"
                              disabled={qty <= 0}
                            >
                              <AiFillMinusSquare
                                className={`${
                                  qty <= 0 ? "text-gray-400" : "text-blue3"
                                } text-2xl`}
                              />
                            </button>
                            <p>{qty}</p>
                            <button
                              onClick={() => setQty(qty + 1)}
                              className="px-1"
                              disabled={qty === stock}
                            >
                              <AiFillPlusSquare
                                className={` ${
                                  qty === stock ? "text-gray-400" : "text-blue3"
                                } text-2xl`}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="my-4">
                          {!refresh_token && !access_token ? (
                            <h1 className="">
                              please log in to get add to cart access{" "}
                              <span>
                                <ModalLogin buttonText="click here" />
                              </span>
                            </h1>
                          ) : (
                            <button
                              onClick={() => handleAddProductToCart(name, qty)}
                              className={` ${
                                stock === 0 ||
                                qty === 0 ||
                                userData.role_id !== 3
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-blue3 cursor-pointer"
                              } text-white w-full h-10 rounded-full`}
                              disabled={
                                stock === 0 ||
                                qty === 0 ||
                                userData.role_id !== 3
                              }
                            >
                              add to cart
                            </button>
                          )}
                        </div>

                        <div className="flex justify-start items-center mt-2">
                          {stock === 0 ? (
                            <>
                              <AiFillCloseCircle className="text-red-500" />
                              <h1 className="text-xs ">
                                This product is unavailable
                              </h1>
                            </>
                          ) : (
                            <>
                              <AiFillCheckCircle className="text-green-400" />
                              <h1 className="text-xs ">
                                This product is still available in{" "}
                                <span className="font-bold">{stock}</span>
                              </h1>
                            </>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <ShareButton />
                          <Wishlist
                            product={name}
                            setErrMsg={setErrMsg}
                            setOpenAlert={setOpenAlert}
                            setSuccessMsg={setSuccessMsg}
                          />
                        </div>
                        <div className="mt-4">
                          <AccordionProduct
                            desc={detailProduct?.description}
                            name={detailProduct?.name}
                            price={detailProduct?.price}
                            weight={detailProduct?.weight}
                          />
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
