import React from "react";
import DefaultPagination from "../../components/Pagination";

const AdminProductDetail = () => {
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-gray-100">
      <section className="text-gray-700 body-font overflow-hidden bg-white">
        <div className=" mx-auto p-5">
          <div className="flex flex-col lg:flex-row justify-center lg:space-x-10">
            {/* Main Product Image */}
            <div className="lg:w-1/2 w-full">
              <img
                alt="ecommerce"
                className="w-full object-cover object-center rounded border border-gray-200"
                src="https://www.whitmorerarebooks.com/pictures/medium/2465.jpg"
              />
            </div>
            {/* Product Details */}
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 className="text-sm text-gray-500 tracking-widest">
                BRAND NAME
              </h2>
              <h1 className="text-gray-900 text-3xl font-medium mb-1">
                The Catcher in the Rye
              </h1>
              <div className="flex mb-2">
                <h2 className="text-sm text-gray-500 tracking-widest">
                  Description
                </h2>
              </div>
              <div className="description-box h-40">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. {/* ... (Your description here) */}
              </div>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex">
                  <span className="mr-3">Weight</span>
                </div>
                <div className="flex ml-6 items-center">
                  <span className="mr-3">Category</span>
                  <div className="relative">
                    <select className="rounded border appearance-none border-gray-400 py-2 focus:outline-none focus:border-red-500 text-base pl-3 pr-10">
                      <option>chair</option>
                      <option>table</option>
                      <option>cabinet</option>
                      <option>racks</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex">
                <span className="text-2xl font-medium text-gray-900">
                  $58.00
                </span>
                <button className="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">
                  Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminProductDetail;
