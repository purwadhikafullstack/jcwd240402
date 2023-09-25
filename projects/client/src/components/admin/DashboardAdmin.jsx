import React, { useEffect, useState } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { BsFillBox2HeartFill } from "react-icons/bs";
import { FaUsers, FaWarehouse } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import BarChart from "./Top10Products";

import welcomeadmin from "../../assets/images/welcomeadmin.png";
import whlogo from "../../assets/icons/whlogo.png";
import calendarlogo from "../../assets/icons/calendarlogo.png";
import dayjs from "dayjs";
import axios from "../../api/axios";
import UserAmountBasedOnLocation from "./UserAmountBasedOnLocation";
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardAdmin = ({ adminData }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const [totalUser, setTotalUser] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalWarehouse, setTotalWarehouse] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);

  useEffect(() => {
    axios.get("/admin/statistic").then((res) => {
      setTotalUser(res.data.totalUser);
      setTotalProduct(res.data.totalProduct);
      setTotalWarehouse(res.data.totalWarehouse);
      setTotalCategory(res.data.totalCategory);
    });
  }, []);

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
    <div className="text-black lg:grid lg:grid-cols-12 lg:grid-rows-6 h-full w-full">
      <div className="col-span-6 h-full row-span-2 p-4">
        <div className="bg-white w-full h-full rounded-md lg:grid grid-cols-12 shadow-card-1">
          <div className="col-span-7 p-4 flex flex-col gap-4 justify-between">
            <div>
              <h1>
                Welcome,{" "}
                <span className="font-bold">
                  {adminData.first_name} {adminData.last_name}
                </span>{" "}
                !
              </h1>
              <div className="flex gap-2">
                <img src={whlogo} alt="" className="w-10 h-10 md:w-10" />
                <p className="text-sm">
                  Enjoy your work. you are the best part of{" "}
                  <span className="font-bold">
                    {adminData.warehouse?.warehouse_name}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex h-full gap-2">
              <img src={calendarlogo} alt="" className="w-10 h-10 md:w-10" />
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
          <div className="w-full h-full col-span-5 flex flex-col justify-end items-center">
            <img
              src={welcomeadmin}
              alt=""
              className="object-cover w-full md:w-1/2 lg:w-full"
            />
          </div>
        </div>
      </div>
      <div className="h-32 col-span-3 lg:h-full lg:row-span-1 p-4 ">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <FaUsers className="font-bold text-4xl" />
          <h1>Total User {totalUser}</h1>
        </div>
      </div>
      <div className="h-32 col-span-3 lg:h-full lg:row-span-1 p-4 ">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <BsFillBox2HeartFill className="font-bold text-4xl" />
          <h1>Total Product {totalProduct}</h1>
        </div>
      </div>
      <div className="h-32 col-span-3 lg:h-full lg:row-span-1 p-4 ">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <BiSolidCategoryAlt className="font-bold text-4xl" />
          <h1>Total Category {totalCategory}</h1>
        </div>
      </div>
      <div className="h-32 col-span-3 lg:h-full lg:row-span-1 p-4 ">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <FaWarehouse className="font-bold text-4xl" />
          <h1>Total Warehouse {totalWarehouse}</h1>
        </div>
      </div>
      <div className="col-span-8 h-full row-span-4 p-4">
        <div className="bg-white w-full h-full rounded-md shadow-card-1">
          <h1>graphic income</h1>
        </div>
      </div>
      <div className="col-span-4 row-span-2 w-full h-60 p-4 flex flex-col justify-center items-center ">
        <h1 className="text-xs font-bold mb-2">user amount per province</h1>
        <UserAmountBasedOnLocation />
      </div>
      <div className="col-span-4 row-span-2 p-4">
        <div className="bg-white w-full h-full rounded-md shadow-card-1">
          <BarChart />
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
