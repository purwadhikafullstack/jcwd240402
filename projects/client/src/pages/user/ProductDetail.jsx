import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import NavbarDesktop from "../../components/NavbarDesktop";
import NavbarMobile from "../../components/NavbarMobile";
import FooterDesktop from "../../components/FooterDesktop";
import NavigatorMobile from "../../components/NavigatorMobile";
import CarouselProductDetail from "../../components/CarouselProductDetail";
import AccordionProduct from "../../components/AccordionProduct";
import CarouselProduct from "../../components/CarouselProduct";
import axios from "../../api/axios";

const ProductDetail = () => {
  const { id } = useParams();
  const [detailProduct, setDetailProduct] = useState([]);
  const [dataImage, setDataImage] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    axios.get(`/user/product/${id}`).then((res) => {
      setDetailProduct(res.data?.result);
      setDataImage(res.data?.result?.Image_products);
    });
  }, [id]);
  console.log(detailProduct);
  console.log(dataImage);

  if (detailProduct.length === 0 || dataImage.length === 0) {
    return <p></p>;
  }

  const product = dataImage.map((item) => {
    let image;
    image = {
      image: `${process.env.REACT_APP_API_BASE_URL}${item?.img_product}`,
    };
    return image;
  });

  console.log(product);

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
            <CarouselProductDetail data={product} />
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
