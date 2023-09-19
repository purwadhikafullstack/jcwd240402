import React, { useEffect, useState } from "react";
import welcomeadmin from "../../assets/images/welcomeadmin.png";
import whlogo from "../../assets/icons/whlogo.png";
import calendarlogo from "../../assets/icons/calendarlogo.png";
import dayjs from "dayjs";

const DashboardAdmin = ({ adminData }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      const time = now.format("HH:mm:ss");
      const date = now.locale("en").format("D MMMM YYYY");
      setCurrentTime(time);
      setCurrentDate(date);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="text-black grid grid-cols-12 grid-rows-6 h-full w-full">
      <div className="col-span-6 row-span-2 p-4">
        <div className="bg-white w-full h-full rounded-md grid grid-cols-12">
          <div className="col-span-7 p-4 flex flex-col justify-between">
            <div>
              <h1>
                Welcome,{" "}
                <span className="font-bold">
                  {adminData.first_name} {adminData.last_name}
                </span>{" "}
                !
              </h1>
              <div className="flex gap-2">
                <img src={whlogo} alt="" className="w-10" />
                <p className="text-sm">
                  Enjoy your work. you are the best part of{" "}
                  <span className="font-bold">
                    {adminData.warehouse?.warehouse_name}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <img src={calendarlogo} alt="" className="w-10" />
              <div className="font-semibold text-sm">
                <p>{currentTime}</p>
                <p>{currentDate}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-grayText">
                “You just have to keep driving down the road. It’s going to bend
                and curve and you’ll speed up and slow down, but the road keeps
                going."{" "}
                <span className="font-bold italic">- Ellen DeGeneres</span>
              </p>
            </div>
          </div>
          <div className="w-full h-full col-span-5 flex flex-col justify-end">
            <img src={welcomeadmin} alt="" className="object-cover w-full" />
          </div>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4">
        <div className="bg-white w-full h-full rounded-md">
          <h1>2. jumlah user</h1>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4">
        <div className="bg-white w-full h-full rounded-md">
          <h1>3. jumlah product</h1>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4">
        <div className="bg-white w-full h-full rounded-md">
          <h1>4. jumlah category</h1>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4">
        <div className="bg-white w-full h-full rounded-md">
          <h1>5. jumlah warehouse branch</h1>
        </div>
      </div>
      <div className="col-span-8 row-span-4 p-4">
        <div className="bg-white w-full h-full rounded-md">
          <h1>6. diagram/graphic</h1>
        </div>
      </div>
      <div className="col-span-4 row-span-2 p-4">
        <div className="bg-white w-full h-full rounded-md">
          <h1>7. pie chart</h1>
        </div>
      </div>
      <div className="col-span-4 row-span-2 p-4">
        <div className="bg-white w-full h-full rounded-md">
          <h1>8. pie chart</h1>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
