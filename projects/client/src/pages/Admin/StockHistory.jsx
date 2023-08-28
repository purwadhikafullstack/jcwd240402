import axios from 'axios'
import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from 'react-select'
import Sidebar from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";

const StockHistory = () => {

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stockHistoryList, setStockHistoryList] = useState([]);
  const [totalLastStock, setTotalLastStock] = useState("");
  const [totalIncrement, setTotalIncrement] = useState("");
  const [totalDecrement, setTotalDecrement] = useState("");
  const [error, setError] = useState("");

  const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
  )

  const token = getCookieValue("access_token")

  const monthOptions = [
    { value: "", label: 'any month' },

    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ]

  const yearOptions = [
    { value: "", label: 'any year' },
    { value: 2020, label: "2020" },
    { value: 2021, label: "2021" },
    { value: 2022, label: "2022" },
    { value: 2023, label: "2023" },
  ]


  useEffect(() => {

    axios.get(`http://localhost:8000/api/warehouse/stock-history?page=${currentPage}&warehouseId=${warehouseId}&year=${year}&month=${month}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    )
    .then((response) => {
      setStockHistoryList(response.data.history);
      setTotalLastStock(response.data.total_last_stock);
      setTotalIncrement(response.data.total_increment);
      setTotalDecrement(response.data.total_decrement)
      setTotalPages(response.pagination.totalPages);
    })
    .catch((err) => {
      setError(err.response.message) 
    });

  }, [month, year, warehouseId, currentPage])

  const handleChangeMonth = (month) =>{
    setMonth(month.value)
  }
  const handleChangeYear = (year) =>{
    setYear(year.value)
  }

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
            <div className="flex items-center gap-4">
            <Select options={monthOptions} placeholder={<div>month</div>} onChange={handleChangeMonth} />
            <Select options={yearOptions} placeholder={<div>year</div>} onChange={handleChangeYear} />
            <div>Last Stock: {totalLastStock}</div>
            <div>Total Increment: {totalIncrement}</div>
            <div>Total Decrement: {totalDecrement}</div>
        </div>
        <div className="py-4">
          <TableComponent
            headers={[
                "Product",
              "Admin Username",
              "Stock Before",
              "Stock After",
              "Increment/Decrement",
              "Quantity",
              "Journal",
              "Timestamp",
            ]}
            data={stockHistoryList.map((history) => ({
                "Product": history.Warehouse_stock.Product.name || "",
            "Admin Username": history.Admin.username || "",
            "Stock Before": history.stock_before_transfer || "",
            "Stock After": history.stock_after_transfer || "",
            "Increment/Decrement": history.increment_decrement || "",
            "Quantity": history.quantity || "",
            "Journal": history.journal || "",
            "Timestamp": history.timestamp.slice(0, 10) || "",
            }))}
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default StockHistory;
