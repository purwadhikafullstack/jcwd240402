import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const UserAmountBasedOnLocation = () => {
  const [labelsChart, setLabelsChart] = useState([]);
  const [dataChart, setDataChart] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("/admin/statistic/pie-chart").then((res) => {
      setLabelsChart(res.data.labels);
      setDataChart(res.data.data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p></p>;
  }
  const data = {
    labels: labelsChart,
    datasets: [
      {
        label: "user amount",
        data: dataChart,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 0, 0, 0.2)",
          "rgba(0, 255, 0, 0.2)",
          "rgba(0, 0, 255, 0.2)",
          "rgba(255, 255, 0, 0.2)",
          "rgba(255, 0, 255, 0.2)",
          "rgba(0, 255, 255, 0.2)",
          "rgba(128, 0, 0, 0.2)",
          "rgba(0, 128, 0, 0.2)",
          "rgba(0, 0, 128, 0.2)",
          "rgba(128, 128, 0, 0.2)",
          "rgba(128, 0, 128, 0.2)",
          "rgba(0, 128, 128, 0.2)",
          "rgba(128, 64, 0, 0.2)",
          "rgba(64, 128, 0, 0.2)",
          "rgba(0, 128, 64, 0.2)",
          "rgba(64, 0, 128, 0.2)",
          "rgba(128, 0, 64, 0.2)",
          "rgba(64, 128, 128, 0.2)",
          "rgba(128, 128, 64, 0.2)",
          "rgba(64, 64, 128, 0.2)",
          "rgba(192, 64, 0, 0.2)",
          "rgba(0, 192, 64, 0.2)",
          "rgba(64, 0, 192, 0.2)",
          "rgba(192, 0, 64, 0.2)",
          "rgba(64, 192, 0, 0.2)",
          "rgba(0, 64, 192, 0.2)",
          "rgba(192, 192, 64, 0.2)",
          "rgba(64, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 0, 0, 1)",
          "rgba(0, 255, 0, 1)",
          "rgba(0, 0, 255, 1)",
          "rgba(255, 255, 0, 1)",
          "rgba(255, 0, 255, 1)",
          "rgba(0, 255, 255, 1)",
          "rgba(128, 0, 0, 1)",
          "rgba(0, 128, 0, 1)",
          "rgba(0, 0, 128, 1)",
          "rgba(128, 128, 0, 1)",
          "rgba(128, 0, 128, 1)",
          "rgba(0, 128, 128, 1)",
          "rgba(128, 64, 0, 1)",
          "rgba(64, 128, 0, 1)",
          "rgba(0, 128, 64, 1)",
          "rgba(64, 0, 128, 1)",
          "rgba(128, 0, 64, 1)",
          "rgba(64, 128, 128, 1)",
          "rgba(128, 128, 64, 1)",
          "rgba(64, 64, 128, 1)",
          "rgba(192, 64, 0, 1)",
          "rgba(0, 192, 64, 1)",
          "rgba(64, 0, 192, 1)",
          "rgba(192, 0, 64, 1)",
          "rgba(64, 192, 0, 1)",
          "rgba(0, 64, 192, 1)",
          "rgba(192, 192, 64, 1)",
          "rgba(64, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      tooltip: {
        titleFont: {
          size: 10,
        },
        bodyFont: {
          size: 8,
        },
      },
      legend: {
        display: true,
        responsive: true,
        position: "bottom",
        labels: {
          boxWidth: 10,
          padding: 2,
          font: {
            size: 8,
          },
        },
        align: "center",
      },
    },
  };
  return (
    <div className="bg-white w-full h-full p-4 flex flex-col justify-center items-center rounded-md shadow-card-1 ">
      <h1 className="text-xs font-bold mb-2">user amount per province</h1>
      {labelsChart.length !== 0 || dataChart.length !== 0 ? (
        <Doughnut data={data} options={options} />
      ) : null}
    </div>
  );
};

export default UserAmountBasedOnLocation;
