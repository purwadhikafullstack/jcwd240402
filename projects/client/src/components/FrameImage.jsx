import React from "react";
import banner8 from "../assets/images/banner_8.png";
import banner9 from "../assets/images/banner_9.png";
import banner10 from "../assets/images/banner_10.png";
import banner11 from "../assets/images/banner_11.png";
import banner12 from "../assets/images/banner_12.png";
import { Link } from "react-router-dom";

const FrameImage = () => {
  const fourSquare = [
    { to: "", img: banner10 },
    {
      to: "https://api.whatsapp.com/send/?phone=6289652433206&text=Hi!+I+have+a+great+interior+design+idea+and+I'm+looking+for+an+expert+to+help+me+bring+it+to+life.%0AI'd+like+to+discuss+my+idea+of+(briefly+describe+your+idea+here).+Could+you+provide+me+with+some+insights+and+assistance%3F&type=phone_number&app_absent=0",
      img: banner9,
    },
    {
      to: "https://api.whatsapp.com/send/?phone=6289652433206&text=Hi!+I+want+to+ask+about+products+at+your+store.%0AThe+product+I%27m+interested+in+is+(please+input+the+product+name+here)%21&type=phone_number&app_absent=0",
      img: banner11,
    },
    { to: "", img: banner12 },
  ];
  return (
    <div className="grid gap-2 mx-4 lg:gap-4 md:gap-4 grid-rows-2 lg:grid-rows-1 md:grid-rows-1 md:grid-cols-2 lg:grid-cols-2 ">
      <div className="row-span-1 md:col-span-1 lg:col-span-1 h-52 lg:h-96 md:h-96">
        <Link>
          <img src={banner8} alt="" />
        </Link>
      </div>
      <div className="grid gap-2 lg:gap-4 md:gap-4 grid-cols-2 grid-rows-2  row-span-1 md:col-span-1 lg:col-span-1">
        {fourSquare.map((item, idx) => (
          <div className=" cols-span-1 row-span-1" key={idx}>
            <Link to={item.to}>
              <img src={item.img} alt="" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameImage;
