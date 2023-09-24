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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [orderSalesList, setOrderSalesList] = useState([]);
  const [salesTableData, setsalesTableData] = useState([]);
  const [salesReport, setSalesReport] = useState("");
  const [error, setError] = useState("");
  const access_token = getCookie("access_token");
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [defaultCategories, setDefaultCategories] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState([]);
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
    const fetchDefaultCategories = async () => {
      try {
        const categories = await loadCategoryOptions('');
        setDefaultCategories(categories);
      } catch (error) {
        console.error("Error fetching default categories:", error);
      }
    };
    fetchDefaultCategories();
  }, []);

  useEffect(() => {
    const fetchDefaultProducts = async () => {
      try {
        const products = await loadProductOptions('');
        setDefaultProducts(products);
      } catch (error) {
        console.error("Error fetching default products:", error);
      }
    };
    fetchDefaultProducts();
  }, []);

  useEffect(() => {
    const fetchDefaultYear = async () => {
      try {
        const year = await loadYearOptions('');
        setDefaultYear(year);
      } catch (error) {
        console.error("Error fetching default year:", error);
      }
    };
    fetchDefaultYear();
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/admin/sales-report?warehouseId=${warehouseId}&year=${year}&month=${month}&categoryId=${selectedCategory}&productId=${selectedProduct}`,
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
  }, [month, year, warehouseId, selectedProduct, selectedCategory, currentPage]);

  const loadCategoryOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/categories`,
        {
          params: { name: inputValue },
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const categoryOptions = [
        { value: "", label: "All Category" },
        ...response.data.data.map((category) => ({
          value: category.id,
          label: category.name,
        })),
      ];
      return categoryOptions
    } catch (error) {
      console.error("Error loading categories:", error);
      return [];
    }
  };

  const loadProductOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/products`,
        {
          params: { name: inputValue },
        },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const productOptions = [
        { value: "", label: "All Product" },
        ...response.data.data.map((product) => ({
          value: product.id,
          label: product.name,
        })),
      ];
      return productOptions
    } catch (error) {
      console.error("Error loading products:", error);
      return [];
    }
  };

  const loadYearOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/year?db=order`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      const yearOptions = [
        { value: "", label: "All Year" },
        ...response.data.year.map((year) => ({
          value: year,
          label: year,
        })),
      ];
      return yearOptions
    } catch (error) {
      console.error("Error loading year:", error);
      return [];
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category.value);
  };

  const handleProductChange = (product) => {
    setSelectedProduct(product.value);
  };

  const handleChangeYear = (year) => {
    setYear(year.value);
  };

  const handleChangeMonth = (month) => {
    setMonth(month.value);
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
            placeholder={<div>select month</div>}
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
          <AsyncSelect
          cacheOptions
          defaultOptions={defaultCategories}
          loadOptions={loadCategoryOptions}
          value={selectedCategory || null}
          onChange={handleCategoryChange}
          placeholder="Select a category"
        />
          <AsyncSelect
          cacheOptions
          defaultOptions={defaultProducts}
          loadOptions={loadProductOptions}
          value={selectedProduct || null}
          onChange={handleProductChange}
          placeholder="Select a product"
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
              Month: sales?.Order?.delivery_time || "",
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
