import React, { useState } from "react";

import addtocart from "../../assets/images/addtocart.png";
import NavbarDesktop from "../../components/user/navbar/NavbarDesktop";
import NavbarMobile from "../../components/user/navbar/NavbarMobile";
import FooterDesktop from "../../components/user/footer/FooterDesktop";
import NavigatorMobile from "../../components/user/footer/NavigatorMobile";
import TableCart from "../../components/user/TableCart";

const Cart = () => {
  const [count, setCount] = useState(1);
  const [valueCount, setValueCount] = useState(0);

  const productData = [
    {
      id: 1,
      img: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/577/1057770_PE848964_S5.jpg",
      name: "SÖDERHAMN",
      price: 10995000,
      weight: 1000,
    },
    {
      id: 2,
      img: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/288/0728848_PE736539_S4.jpg",
      name: "SÖDERHAMN",
      price: 10995000,
      weight: 1000,
    },
  ];

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <h1 className="text-xl font-bold md:text-2xl lg:text-3xl">
          Your Shopping Cart
        </h1>
        {/* PHONE CART */}
        <div className="p-4 w-full border-b-2 h-20 flex justify-between items-center sticky top-14 md:hidden lg:hidden bg-white rounded-lg">
          <h1 className="text-xs">{productData.length} products: </h1>
          <button className="w-36 h-12 text-sm rounded-full font-bold text-white bg-blue3">
            Checkout
          </button>
        </div>
        {/* TAB AND DESKTOP */}
        <div className="h-full py-4 border-b-2">
          <div className="w-full  grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 ">
            <div className="col-span-2 md:col-span-3 lg:col-span-3 border-b-2 font-bold">
              <h1>Product item</h1>
            </div>
            <div className="col-span-2 md:col-span-1 lg:col-span-1 border-b-2 font-bold grid justify-center">
              <h1>Amount</h1>
            </div>
            <div className="hidden md:lg:col-span-1 lg:col-span-1 border-b-2 font-bold md:grid lg:grid justify-center">
              <h1>Subtotal</h1>
            </div>
            {productData.length === 0 ? (
              <div className="flex flex-col justify-center items-center w-[21rem] md:w-[47rem] lg:w-[79rem]">
                <img src={addtocart} alt="" className="w-56 md:w-96" />
                <h1 className="text-gray-400 text-center text-xs md:text-sm lg:text-sm mt-2">
                  Your Shopping Cart is empty. You do not have any products in
                  your shopping list
                </h1>
              </div>
            ) : (
              productData.map((item) => (
                <TableCart
                  key={item.id}
                  img={item.img}
                  name={item.name}
                  price={item.price}
                  weight={item.weight}
                  count={count}
                  setCount={setCount}
                  setValueCount={setValueCount}
                />
              ))
            )}
          </div>
        </div>
        <div>
          <div className="hidden md:flex lg:flex justify-between items-center">
            <h1>Total Amount</h1>
            <button className="bg-blue3 text-white w-96 h-10 rounded-full">
              check out
            </button>
          </div>
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default Cart;
