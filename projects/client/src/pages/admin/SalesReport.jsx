import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import Sidebar from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import AsyncSelect from "react-select/async";
import dayjs from "dayjs";
import { rupiahFormat } from "../../utils/formatter";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";
import axios from "../../api/axios";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";


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

  const token = getCookie("access_token");

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
        const categories = await loadCategoryOptions("");
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
        const products = await loadProductOptions("");
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
        const year = await loadYearOptions("");
        setDefaultYear(year);
      } catch (error) {
        console.error("Error fetching default year:", error);
      }
    };
    fetchDefaultYear();
  }, []);

  useEffect(() => {
    if (adminData.role_id === 2) {
      setWarehouseId(adminData?.warehouse_id);
    }

    axios
      .get(
        `/admin/sales-report?page=${currentPage}&warehouseId=${warehouseId}&year=${year}&month=${month}&categoryId=${selectedCategory}&productId=${selectedProduct}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSalesReport(response?.data?.sales_report);
        setOrderSalesList(response?.data?.order_details);
        setTotalPages(response?.data?.pagination?.totalPages);
      })
      .catch((err) => {
        setError(err.response.message);
      });
  }, [
    month,
    year,
    warehouseId,
    selectedProduct,
    selectedCategory,
    currentPage,
  ]);

  const loadCategoryOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/categories`,
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
      return categoryOptions;
    } catch (error) {
      console.error("Error loading categories:", error);
      return [];
    }
  };

  const loadProductOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/products`,
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
      return productOptions;
    } catch (error) {
      console.error("Error loading products:", error);
      return [];
    }
  };

  const loadYearOptions = async (inputValue) => {
    try {
      const response = await axios.get(`/admin/year?db=order`, {
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
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="lg:px-8 lg:pt-8 lg:w-full p-4">
          <div className="flex items-center gap-4">
            <Select
              options={monthOptions}
              placeholder={<div>select month</div>}
              onChange={handleChangeMonth}
              className="relative z-50"
            />

            <AsyncSelect
              cacheOptions
              defaultOptions={defaultYear}
              loadOptions={loadYearOptions}
              value={year || null}
              onChange={handleChangeYear}
              placeholder="Select year"
              className="relative z-50"
            />
            <AsyncSelect
              cacheOptions
              defaultOptions={defaultCategories}
              loadOptions={loadCategoryOptions}
              value={selectedCategory || null}
              onChange={handleCategoryChange}
              placeholder="Select a category"
              className="relative z-50"
            />
            <AsyncSelect
              cacheOptions
              defaultOptions={defaultProducts}
              loadOptions={loadProductOptions}
              value={selectedProduct || null}
              onChange={handleProductChange}
              placeholder="Select a product"
              className="relative z-50"
            />
            {adminData.role_id == 1 && (
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadWarehouseOptions}
                onChange={handleChangeWarehouseId}
                placeholder="All Warehouses"
                className="flex-1  rounded text-base bg-white  shadow-sm pr-4 relative z-50 "
              />
            )}
          </div>
          <div className="py-4">
            <TableComponent
              headers={[
                "Month",
                "Year",
                "Warehouse",
                "Category",
                "Product",
                "Price",
                "Quantity",
                "Sub Total",
              ]}
              data={orderSalesList.map((sales) => ({
                Month: dayjs(sales?.Order?.delivery_time).format("MMMM") || "",
                Year: dayjs(sales?.Order?.delivery_time).format("YYYY") || "",
                Warehouse: sales?.Order?.Warehouse?.warehouse_name || "",
                Category: sales?.Warehouse_stock?.Product?.category?.name || "",
                Product: sales?.Warehouse_stock?.Product?.name || "",
                Price:
                  rupiahFormat(sales?.Warehouse_stock?.Product?.price) || "",
                Quantity: sales?.quantity || "",
                "Sub Total":
                  rupiahFormat(
                    sales?.Warehouse_stock?.Product?.price * sales?.quantity
                  ) || 0,
              }))}
              showIcon={false}
            />
            <div className="p-4 font-bold">
              Total: {rupiahFormat(salesReport)}
            </div>
          </div>
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

export default withAuthAdminWarehouse(SalesReport);
