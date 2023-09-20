import axios from "axios";
import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import Sidebar from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";

const SalesReport = () => {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [productId, setProductId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderSalesList, setOrderSalesList] = useState([]);
  const [salesReport, setSalesReport] = useState("");
  const [salesReport2, setSalesReport2] = useState("");
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

  const warehouseOptions = [
    { value: "", label: "any warehouse" },
    { value: 1, label: "Furnifor BSD" },
    { value: 2, label: "Furnifor Surabaya" },
    { value: 3, label: "Furnifor Jakarta" },
    { value: 4, label: "Furnifor Malang" },
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
        setSalesReport2(response?.data?.sales_report2);
        setOrderSalesList(response?.data?.orders);
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
          {roleId == 1 ? (
            <Select
              options={warehouseOptions}
              placeholder={<div>Warehouse</div>}
              onChange={handleChangeWarehouseId}
            />
          ) : (
            <div></div>
          )}
          <div>Sales Report: {salesReport}</div>
          <div>Sales Report 2: {salesReport2}</div>
        </div>
        <div className="py-4">
          {orderSalesList.map((order) => (
            <TableComponent
              headers={["Month", "Category", "Product", "Sub Total"]}
              data={order?.Order_details.map((sales) => ({
                Month: order?.delivery_time?.split(" ")[1] || "",
                Category: sales?.Warehouse_stock?.Product?.category?.name || "",
                Product: sales?.Warehouse_stock?.Product?.name || "",
                "Sub Total":
                  sales?.Warehouse_stock?.Product?.price * sales?.quantity || 0,
              }))}
              showIcon={false}

              // "Month": sales?.delivery_time.split(' ')[1] || "",
              // "Category": sales?.Order_details?.Warehouse_stock?.Product?.category?.name || "",
              // "Product": sales?.Order_details?.Warehouse_stock?.Product?.name || "",
              // "Sub Total": sales?.Order_details?.Warehouse_stock?.Product?.price * sales?.Order_details?.quantity|| 0,
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesReport;
