import axios from "axios";
import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import Sidebar from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import toRupiah from "@develoka/angka-rupiah-js";
import AsyncSelect from "react-select/async";

const SalesReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderSalesList, setOrderSalesList] = useState([]);
  const [salesTableData, setsalesTableData] = useState([]);
  const [salesReport, setSalesReport] = useState("");
  const [error, setError] = useState("");
  const access_token = getCookie("access_token");
  const adminData = useSelector((state) => state.profilerAdmin.value);

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

  const yearOptions = [
    { value: "", label: "any year" },
    { value: 2020, label: "2020" },
    { value: 2021, label: "2021" },
    { value: 2022, label: "2022" },
    { value: 2023, label: "2023" },
  ];
  
  const productOptions = [
    { value: "", label: "any product" },
    { value: 1, label: "ANTILOP" },
    { value: 2, label: "BUSUNGE" },
    { value: 3, label: "FLISAT" },
    { value: 4, label: "INGOLF" },
    { value: 4, label: "LATTJO" },
  ];

  const categoryOptions = [
    { value: "", label: "any category" },
    { value: 1, label: "Baby Room" },
    { value: 2, label: "Bed Room" },
    { value: 3, label: "Kitchen" },
    { value: 4, label: "Lamp and Electronic" },
    { value: 5, label: "Living Room" },
    { value: 6, label: "Outdoor Space" },
    { value: 7, label: "Toilet" },
    { value: 8, label: "Working Room" },
    { value: 9, label: "Uncategorized" },
  ];

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/admin/sales-report?warehouseId=${warehouseId}&year=${year}&month=${month}&categoryId=${categoryId}&productId=${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSalesReport(response?.data?.sales_report);
        setOrderSalesList(response?.data?.order_details);
      })
      .catch((err) => {
        setError(err.response.message);
      });
  }, [month, year, warehouseId, productId, categoryId, currentPage]);

  const handleChangeMonth = (month) => {
    setMonth(month.value);
  };
  const handleChangeProduct = (product) => {
    setProductId(product.value);
  };
  const handleChangeCategory = (category) => {
    setCategoryId(category.value);
  };
  const handleChangeYear = (year) => {
    setYear(year.value);
  };
  const handleChangeWarehouseId = (warehouseId) => {
    setWarehouseId(warehouseId.value);
  };

  const loadWarehouseOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/warehouse/warehouse-list?searchName=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const warehouseOptions = [
        { value: "", label: "All Warehouses" },
        ...response.data.warehouses.map((warehouse) => ({
          value: warehouse.id,
          label: warehouse.warehouse_name,
        })),
      ];
      return warehouseOptions;
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center gap-4">
          <Select
            options={monthOptions}
            placeholder={<div>month</div>}
            onChange={handleChangeMonth}
          />
          <Select
            options={yearOptions}
            placeholder={<div>year</div>}
            onChange={handleChangeYear}
          />
          <Select
            options={categoryOptions}
            placeholder={<div>category</div>}
            onChange={handleChangeCategory}
          />
          <Select
            options={productOptions}
            placeholder={<div>product</div>}
            onChange={handleChangeProduct}
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
        </div>
        <div className="py-4">
          <TableComponent
            headers={[
              "Month",
              "Category",
              "Product",
              "Price",
              "Quantity",
              "Sub Total",
            ]}
            data={orderSalesList.map((sales) => ({
              Month: sales.Order?.delivery_time || "",
              Category: sales?.Warehouse_stock?.Product?.category?.name || "",
              Product: sales?.Warehouse_stock?.Product?.name || "",
              Price: sales?.Warehouse_stock?.Product?.price || "",
              Quantity: sales?.quantity || "",
              "Sub Total":
                sales?.Warehouse_stock?.Product?.price * sales?.quantity || 0,
            }))}
            showIcon={false}
          />
          <div>Total: {salesReport}</div>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
