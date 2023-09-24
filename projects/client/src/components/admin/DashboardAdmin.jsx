import React, { useEffect, useState } from "react";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { BsFillBox2HeartFill } from "react-icons/bs";
import { FaUsers, FaWarehouse } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import welcomeadmin from "../../assets/images/welcomeadmin.png";
import whlogo from "../../assets/icons/whlogo.png";
import calendarlogo from "../../assets/icons/calendarlogo.png";
import dayjs from "dayjs";
import axios from "../../api/axios";
ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardAdmin = ({ adminData }) => {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [loading, setLoading] = useState(true);

  const [errMsg, setErrMsg] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalWarehouse, setTotalWarehouse] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [labelsChart, setLabelsChart] = useState([]);
  const [dataChart, setDataChart] = useState([]);

  useEffect(() => {
    axios.get("/admin/statistic").then((res) => {
      console.log(res.data);
      setTotalUser(res.data.totalUser);
      setTotalProduct(res.data.totalProduct);
      setTotalWarehouse(res.data.totalWarehouse);
      setTotalCategory(res.data.totalCategory);
    });
  }, []);

  useEffect(() => {
    axios.get("/admin/statistic/pie-chart").then((res) => {
      console.log(res);
      setLabelsChart(res.data.labels);
      setDataChart(res.data.data);
      setLoading(false);
    });
  }, []);
  console.log(labelsChart);
  console.log(dataChart);
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

  if (loading) {
    return <p></p>;
  }
  console.log(labelsChart);
  console.log(dataChart);
  // const data = {
  //   labels: labelsChart,
  //   datasets: [
  //     {
  //       label: "user amount",
  //       data: dataChart,
  //       backgroundColor: [
  //         "rgba(255, 99, 132, 0.2)",
  //         "rgba(54, 162, 235, 0.2)",
  //         "rgba(255, 206, 86, 0.2)",
  //         "rgba(75, 192, 192, 0.2)",
  //         "rgba(153, 102, 255, 0.2)",
  //         "rgba(255, 159, 64, 0.2)",
  //       ],
  //       borderColor: [
  //         "rgba(255, 99, 132, 1)",
  //         "rgba(54, 162, 235, 1)",
  //         "rgba(255, 206, 86, 1)",
  //         "rgba(75, 192, 192, 1)",
  //         "rgba(153, 102, 255, 1)",
  //         "rgba(255, 159, 64, 1)",
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  return (
    <div className="text-black lg:grid lg:grid-cols-12 lg:grid-rows-6 h-full w-full">
      <div className="col-span-6 row-span-2 p-4">
        <div className="bg-white w-full h-full rounded-md grid grid-cols-12 shadow-card-1">
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
                <img src={whlogo} alt="" className="w-10 h-10 md:w-10" />
                <p className="text-sm">
                  Enjoy your work. you are the best part of{" "}
                  <span className="font-bold">
                    {adminData.warehouse?.warehouse_name}
                  </span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
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
          <div className="w-full h-full col-span-5 flex flex-col justify-end">
            <img src={welcomeadmin} alt="" className="object-cover w-full" />
          </div>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4 ">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <FaUsers className="font-bold text-4xl" />
          <h1>Total User {totalUser}</h1>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <BsFillBox2HeartFill className="font-bold text-4xl" />
          <h1>Total Product {totalProduct}</h1>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <BiSolidCategoryAlt className="font-bold text-4xl" />
          <h1>Total Category {totalCategory}</h1>
        </div>
      </div>
      <div className="col-span-3 row-span-1 p-4">
        <div className="bg-white w-full h-full rounded-md flex justify-evenly items-center shadow-card-1">
          <FaWarehouse className="font-bold text-4xl" />
          <h1>Total Warehouse {totalWarehouse}</h1>
        </div>
      </div>
      <div className="col-span-8 row-span-4 p-4">
        <div className="bg-white w-full h-full rounded-md shadow-card-1">
          <h1>graphic income</h1>
        </div>
      </div>
      <div className="col-span-4 row-span-2 p-4 flex flex-col justify-center items-center border-2">
        <div className="bg-white w-full h-full flex flex-col justify-center items-center rounded-md shadow-card-1 ">
          <h1 className="font-bold">user most location</h1>

          {/* <Doughnut data={data} /> */}
        </div>
      </div>
      <div className="col-span-4 row-span-2 p-4">
        <div className="bg-white w-full h-full rounded-md shadow-card-1">
          <h1>8. pie chart</h1>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
