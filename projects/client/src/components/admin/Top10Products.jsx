import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = (totalSold) => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      display: false,
    },
    title: {
      display: true,
      text: 'Top Products Sold This Month',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: totalSold, 
    }
  },
  tooltips: {
    callbacks: {
       label: function(tooltipItem) {
              return tooltipItem.yLabel;
       }
    }
}
});

export function BarChart() {
  const [chartData, setChartData] = useState(null);
  const [totalSold, setTotalSold] = useState(null);

  const randomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };

  useEffect(() => {
    axios.get("/admin/statistic/top-ten-product").then((response) => {
      const apiData = response.data.products;
      setTotalSold(response.data.totalSold); 
      const labels = apiData.map(item => item.name);
      const data = apiData.map(item => parseInt(item.total_quantity, 10));
      const backgroundColors = apiData.map(() => randomColor()); 

      setChartData({
        labels,
        datasets: [
          {
            label: '',
            data,
            backgroundColor: backgroundColors, 
          },
        ],
      });
    });
  }, []);

  return chartData ? <Bar options={options(totalSold)} data={chartData} /> : null;
}

export default BarChart;
