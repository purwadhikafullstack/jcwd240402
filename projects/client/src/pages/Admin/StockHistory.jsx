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
  const [error, setError] = useState("");

  const monthOptions = [
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


  useEffect(() => {

    axios.get(`http://localhost:8000/api/warehouse/stock-history?page=${currentPage}&warehouseId=${warehouseId}&year=${year}&month=${month}`)
    .then((response) => {
      setStockHistoryList(response.data.history);
      setTotalPages(response.pagination.totalPages);
    })
    .catch((err) => {
      setError(err.response.message) 
    });

  }, [month, year, warehouseId, currentPage])

  const handleChange = (month) =>{
    setMonth(month.value)
  }

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center">
            <Select options={monthOptions} onChange={handleChange} />
        </div>
        <div className="py-4">
          <TableComponent
            headers={[
              "Warehouse Stock Id",
              "Warehouse Id",
              "Warehouse Admin Id",
              "Stock Before",
              "Stock After",
              "Increment/Decrement",
              "Quantity",
              "Journal",
              "Timestamp",
            ]}
            data={stockHistoryList.map((history) => ({
            "Warehouse Stock Id": history.warehouse_stock_id || "",
            "Warehouse Id": history.warehouse_id || "",
            "Warehouse Admin Id": history.admin_id || "",
            "Stock Before": history.stock_before_transfer || "",
            "Stock After": history.stock_after_transfer || "",
            "Increment/Decrement": history.increment_decrement || "",
            "Quantity": history.quantity || "",
            "Journal": history.journal || "",
            "Timestamp": history.timestamp || "",
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
