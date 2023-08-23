import React, { useState, useEffect } from "react";
import axios from "axios";
import TableComponent from "../../components/Table";
import DefaultPagination from "../../components/Pagination";
import AsyncSelect from "react-select/async";

const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchStocks();
  }, [selectedWarehouse, currentPage]);

  const fetchStocks = async () => {
    try {
      const warehouseName = selectedWarehouse ? selectedWarehouse.warehouse_name : null;
      const response = await axios.get(`http://localhost:8000/api/warehouse-stock`, {
        params: {
          warehouseName: warehouseName,
          page: currentPage,
        },
      });

      if (response.data && response.data.stocks) {
        const flattenedStocks = [];
        Object.keys(response.data.stocks).forEach((warehouse) => {
          response.data.stocks[warehouse].forEach((stock) => {
            flattenedStocks.push({
              "Warehouse Name": warehouse,
              "Product Name": stock.Product.name,
              Stock: stock.product_stock,
            });
          });
        });
        setStocks(flattenedStocks);
      }

      if (response.data && response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
      }

    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const loadWarehouses = async (inputValue, callback) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/warehouse/warehouse-list`, {
        params: {
          searchName: inputValue,
          cityId: "",
        },
      });

      if (response.data && response.data.warehouses) {
        const formattedWarehouses = response.data.warehouses.map(warehouse => ({
          value: warehouse.id,
          label: warehouse.warehouse_name,
          warehouse_name: warehouse.warehouse_name
        }));
        callback(formattedWarehouses);
      }

    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="pb-4">
        <AsyncSelect
          cacheOptions
          loadOptions={loadWarehouses}
          onChange={setSelectedWarehouse}
          placeholder="Select a warehouse"
        />
      </div>
      <div className="py-4">
        <TableComponent
          headers={["Warehouse Name", "Product Name", "Stock"]}
          data={stocks}
        />
      </div>
      <div className="flex justify-center items-center mt-4">
        <DefaultPagination
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default StockList;

