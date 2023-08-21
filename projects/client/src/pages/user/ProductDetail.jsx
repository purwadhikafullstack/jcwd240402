import React, { useState } from "react";
import { useParams } from "react-router-dom";

import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import CarouselProductDetail from "../../components/CarouselProductDetail";
import AccordionProduct from "../../components/AccordionProduct";
import CarouselProduct from "../../components/CarouselProduct";

const ProductDetail = () => {
  const { id } = useParams();
  const [count, setCount] = useState(0);

  const data = [
    {
      image:
        "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
    },
    {
      image:
        "https://cdn.britannica.com/s:800x450,c:crop/35/204435-138-2F2B745A/Time-lapse-hyper-lapse-Isle-Skye-Scotland.jpg",
    },
    {
      image:
        "https://static2.tripoto.com/media/filter/tst/img/735873/TripDocument/1537686560_1537686557954.jpg",
    },
    {
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Palace_of_Fine_Arts_%2816794p%29.jpg/1200px-Palace_of_Fine_Arts_%2816794p%29.jpg",
    },
    {
      image:
        "https://i.natgeofe.com/n/f7732389-a045-402c-bf39-cb4eda39e786/scotland_travel_4x3.jpg",
    },
    {
      image:
        "https://www.tusktravel.com/blog/wp-content/uploads/2020/07/Best-Time-to-Visit-Darjeeling-for-Honeymoon.jpg",
    },
    {
      image:
        "https://www.omm.com/~/media/images/site/locations/san_francisco_780x520px.ashx",
    },
    {
      image:
        "https://images.ctfassets.net/bth3mlrehms2/6Ypj2Qd3m3jQk6ygmpsNAM/61d2f8cb9f939beed918971b9bc59bcd/Scotland.jpg?w=750&h=422&fl=progressive&q=50&fm=jpg",
    },
    {
      image:
        "https://www.oyorooms.com/travel-guide/wp-content/uploads/2019/02/summer-7.jpg",
    },
  ];

  const detailProduct = {
    name: "desk",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam porro necessitatibus voluptatem similique magni ut dolor vel ex ipsa consequuntur.",
    price: 2000000,
    weight: "700gr",
  };

  const productsData = [
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
    {
      src: "https://d2xjmi1k71iy2m.cloudfront.net/dairyfarm/id/images/359/0735981_PE740299_S4.jpg",
      category: "desk",
      name: "ADILS/LINNMON",
      desc: "meja, efek kayu oak diwarnai putih/putih, 100x60 cm",
      price: 579000,
    },
  ];

  const listCategory = [
    { id: 1, name: "Table" },
    { id: 2, name: "Kitchen" },
    { id: 3, name: "Sofa" },
    { id: 4, name: "Chair" },
  ];

  return (
    <div>
      <NavbarDesktop />
      <NavbarMobile />
      <div className="min-h-screen mx-6 mb-8 space-y-4 md:space-y-8 lg:space-y-8 lg:mx-32">
        <div className="lg:grid lg:grid-cols-3 gap-4 flex flex-col">
          <div className="md:flex md:items-center  lg:flex lg:flex-col lg:items-center lg:col-span-2 lg:w-full lg:h-full">
            <CarouselProductDetail data={data} />
            <div className="hidden lg:block md:hidden w-full">
              <AccordionProduct
                desc={detailProduct.description}
                name={detailProduct.name}
                price={detailProduct.price}
                weight={detailProduct.weight}
              />
            </div>
          </div>

          <div className="lg:col-span-1 lg:sticky lg:top-16 lg:h-fit p-4 lg:p-4 ">
            <h1 className="font-bold lg:text-4xl">{detailProduct.name}</h1>

            <h1 className="font-bold text-xl">
              <sup>Rp</sup>
              {detailProduct.price}
            </h1>

            <hr />

            <div className="flex justify-between mt-4">
              <p>amount:</p>
              <div className="flex justify-between items-center w-20  rounded-full px-1">
                <button
                  onClick={() => (count <= 0 ? 0 : setCount(count - 1))}
                  className="px-1"
                >
                  -
                </button>
                <p>{count}</p>
                <button onClick={() => setCount(count + 1)} className="px-1">
                  +
                </button>
              </div>
            </div>
            <div className="my-4">
              <button className="bg-blue3 text-white w-full h-10 rounded-full">
                add to cart
              </button>
            </div>
            <div className="lg:hidden">
              <AccordionProduct
                desc={detailProduct.description}
                name={detailProduct.name}
                price={detailProduct.price}
                weight={detailProduct.weight}
              />
            </div>
          </div>
        </div>
        <div className="relative z-0">
          {listCategory.map((item) => (
            <div key={item.id}>
              <h1 className="font-bold mx-3 lg:text-3xl">{item.name}</h1>
              <CarouselProduct productsData={productsData} />
            </div>
          ))}
        </div>
      </div>
      <FooterDesktop />
      <NavigatorMobile />
    </div>
  );
};

export default ProductDetail;
