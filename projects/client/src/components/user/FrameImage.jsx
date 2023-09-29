import React from "react";
import { Link } from "react-router-dom";

import banner8 from "../../assets/images/banner_8.png";
import banner9 from "../../assets/images/banner_9.png";
import banner10 from "../../assets/images/banner_10.png";
import banner11 from "../../assets/images/banner_11.png";
import banner12 from "../../assets/images/banner_12.png";

const FrameImage = () => {
  const fourSquare = [
    { to: "/all-warehouse", img: banner10, alt: "all warehouse" },
    {
      to: "https://api.whatsapp.com/send/?phone=6289652433206&text=Hi!+I+have+a+great+interior+design+idea+and+I'm+looking+for+an+expert+to+help+me+bring+it+to+life.%0AI'd+like+to+discuss+my+idea+of+(briefly+describe+your+idea+here).+Could+you+provide+me+with+some+insights+and+assistance%3F&type=phone_number&app_absent=0",
      img: banner9,
      alt: "consulting interior design",
    },
    {
      to: "https://api.whatsapp.com/send/?phone=6289652433206&text=Hi!+I+want+to+ask+about+products+at+your+store.%0AThe+product+I%27m+interested+in+is+(please+input+the+product+name+here)%21&type=phone_number&app_absent=0",
      img: banner11,
    },
    {
      to: "/product/product-category/Living%20Room",
      img: banner12,
      alt: "asking product",
    },
  ];
  return (
    <div className="grid gap-2  lg:gap-4 md:gap-4 grid-rows-2 lg:grid-rows-1 md:grid-rows-1 md:grid-cols-2 lg:grid-cols-2 ">
      <div className="row-span-1 md:col-span-1 lg:col-span-1 h-52 lg:h-96 md:h-96">
        <Link to="/product/product-category/Kitchen%20Room">
          <img src={banner8} alt="kitchen category" />
        </Link>
      </div>
      <div className="grid gap-2 lg:gap-4 md:gap-4 grid-cols-2 grid-rows-2  row-span-1 md:col-span-1 lg:col-span-1">
        {fourSquare.map((item, idx) => (
          <div className=" cols-span-1 row-span-1 " key={idx}>
            <Link to={item.to} className="cursor-pointer">
              <img src={item.img} alt={item.alt} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameImage;
