import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import Sidebar from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import AsyncSelect from "react-select/async";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";
import dayjs from "dayjs";
import axios from "../../api/axios";

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
  const access_token = getCookie("access_token");
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const [defaultYear, setDefaultYear] = useState([]);

  const getCookieValue = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

  const token = getCookieValue("access_token");

  const monthOptions = [
    { value: "", label: "any month" },
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  useEffect(() => {
    const fetchDefaultYear = async () => {
      try {
        const year = await loadYearOptions("");
        setDefaultYear(year);
      } catch (error) {
        console.error("Error fetching default year:", error);
      }
    };
    fetchDefaultYear();
  }, []);

  const loadWarehouseOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const warehouseOptions = [
        { value: "", label: "All Warehouses" },
        ...response.data.warehouses.map((warehouse) => ({
          value: warehouse?.id,
          label: warehouse?.warehouse_name,
        })),
      ];
      return warehouseOptions;
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  const loadYearOptions = async (inputValue) => {
    try {
      const response = await axios.get(`/admin/year?db=history`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const yearOptions = [
        { value: "", label: "All Year" },
        ...response.data.year.map((year) => ({
          value: year,
          label: year,
        })),
      ];
      return yearOptions;
    } catch (error) {
      console.error("Error loading year:", error);
      return [];
    }
  };

  useEffect(() => {
    if (adminData.role_id === 2) {
      setWarehouseId(adminData?.warehouse_id);
    }

    axios
      .get(
        `/warehouse/stock-history?page=${currentPage}&warehouseId=${warehouseId}&year=${year}&month=${month}`,
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
        setTotalDecrement(response.data.total_decrement);
        setTotalPages(response.pagination.totalPages);
      })
      .catch((err) => {
        setError(err.response.message);
      });
  }, [month, year, warehouseId, currentPage]);

  const handleChangeMonth = (month) => {
    setMonth(month.value);
  };
  const handleChangeYear = (year) => {
    setYear(year.value);
  };
  const handleChangeWarehouseId = (warehouseId) => {
    setWarehouseId(warehouseId.value);
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="lg:px-8 lg:pt-8 lg:w-full p-4">
          <div className="flex items-center gap-4">
            <Select
              options={monthOptions}
              placeholder={<div>month</div>}
              onChange={handleChangeMonth}
            />
            <AsyncSelect
              cacheOptions
              defaultOptions={defaultYear}
              loadOptions={loadYearOptions}
              value={year || null}
              onChange={handleChangeYear}
              placeholder="Select year"
            />
            {adminData.role_id == 1 && (
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadWarehouseOptions}
                onChange={handleChangeWarehouseId}
                placeholder="All Warehouses"
                className="flex-1  rounded text-base bg-white  shadow-sm pr-4"
              />
            )}
            <div>Last Stock: {totalLastStock}</div>
            <div>Total Increment: {totalIncrement}</div>
            <div>Total Decrement: {totalDecrement}</div>
          </div>
          <div className="py-4">
            <TableComponent
              headers={[
                "Product",
                "Admin Username",
                "Warehouse",
                "Stock Before",
                "Stock After",
                "Increment/Decrement",
                "Quantity",
                "Journal",
                "Timestamp",
              ]}
              data={stockHistoryList.map((history) => ({
                Product: history?.Warehouse_stock?.Product?.name || "",
                "Admin Username": history?.Admin?.username || "",
                Warehouse: history?.Warehouse?.warehouse_name || "",
                "Stock Before": history?.stock_before_transfer || "0",
                "Stock After": history?.stock_after_transfer || "",
                "Increment/Decrement": history?.increment_decrement || "",
                Quantity: history?.quantity || "",
                Journal: history?.journal || "",
                Timestamp:
                  history?.timestamp.slice(0, 10) +
                    ", " +
                    history?.timestamp.slice(11, 19) || "",
              }))}
              showIcon={false}
            />
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              // navigateWithParams({ page });
            }}
          />
        </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdminWarehouse(StockHistory);
