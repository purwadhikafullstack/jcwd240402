import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FaCartArrowDown } from "react-icons/fa";
import toRupiah from "@develoka/angka-rupiah-js";

import axios from "../../api/axios";
import CarouselProductDetail from "../user/carousel/CarouselProductDetail";
import AccordionProduct from "./AccordionProduct";
import logo from "../../assets/images/furniforNav.png";

export default function SlideOverProduct({ name }) {
  const [open, setOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState([]);
  const [dataImage, setDataImage] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get(`/user/product/${name}`).then((res) => {
      setDetailProduct(res.data?.result);
      setDataImage(res.data?.result?.Image_products);
    });
  }, [name]);

  if (detailProduct?.length === 0 && dataImage?.length === 0) {
    return <p></p>;
  }

  const product = dataImage?.map((item) => {
    let image;
    image = {
      image: `${process.env.REACT_APP_API_BASE_URL}${item?.img_product}`,
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
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                            alt=""
                            className=" h-8 md:h-10 lg:h-8"
                          />
                        </Dialog.Title>
                      </div>
                      <div className="relative mt-4 flex-1 px-4 sm:px-6">
                        <CarouselProductDetail data={product} />
                        <div>
                          <h1 className="font-bold text-xl md:text-3xl lg:text-2xl">
                            {detailProduct?.name}
                          </h1>
                          <h1 className="font-bold text-lg md:text-xl lg:text-xl">
                            {detailProduct?.price}
                          </h1>
                        </div>
                        <div className="flex justify-between mt-4">
                          <p>amount:</p>
                          <div className="flex justify-between items-center w-20  rounded-full px-1">
                            <button
                              onClick={() =>
                                count <= 0 ? 0 : setCount(count - 1)
                              }
                              className="px-1"
                            >
                              -
                            </button>
                            <p>{count}</p>
                            <button
                              onClick={() => setCount(count + 1)}
                              className="px-1"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="my-4">
                          <button className="bg-blue3 text-white w-full h-10 rounded-full">
                            add to cart
                          </button>
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
