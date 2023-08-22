import React, { useState } from "react";
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
          {productData.map((item) => (
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
          ))}
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default Cart;
