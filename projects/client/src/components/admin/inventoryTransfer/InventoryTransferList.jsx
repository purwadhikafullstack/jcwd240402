import React, { useState, useEffect } from "react";
import TableComponent from "../../Table";
import DefaultPagination from "../../Pagination";
import TransferStockModal from "../../modal/inventoryTransfer/TransferStockModal";
import ApproveRejectModal from "../../modal/inventoryTransfer/ApproveRejectModal";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import { useWarehouseOptions } from "../../../utils/loadWarehouseOptions";
import useURLParams from "../../../utils/useUrlParams";
import moment from "moment";

const InventoryTransferList = () => {
  const { syncStateWithParams, setParam } = useURLParams();
  const [selectedWarehouse, setSelectedWarehouse] = useState(
    syncStateWithParams("warehouse", "")
  );
  const [selectedStatus, setSelectedStatus] = useState(
    syncStateWithParams("status", "")
  );
  const [searchProductName, setSearchProductName] = useState(
    syncStateWithParams("productName", "")
  );
  const [currentPage, setCurrentPage] = useState(
    syncStateWithParams("page", 1)
  );
  const [selectedYear, setSelectedYear] = useState(
    syncStateWithParams("year", new Date().getFullYear())
  );
  const [selectedMonth, setSelectedMonth] = useState(
    syncStateWithParams("month", new Date().getMonth() + 1)
  );
  const [transfers, setTransfers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const access_token = getCookie("access_token");
  const loadWarehouses = useWarehouseOptions();

  useEffect(() => {
    setParam("warehouse", selectedWarehouse ? selectedWarehouse.value : "");
    setParam("status", selectedStatus ? selectedStatus.value : "");
    setParam("productName", searchProductName);
    setParam("page", currentPage);
    setParam("year", selectedYear);
    setParam("month", selectedMonth);
  }, [
    selectedWarehouse,
    selectedStatus,
    searchProductName,
    currentPage,
    selectedYear,
    selectedMonth,
  ]);

  useEffect(() => {
    fetchTransfers();
  }, [
    selectedWarehouse,
    selectedStatus,
    searchProductName,
    currentPage,
    selectedYear,
    selectedMonth,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedWarehouse,
    selectedStatus,
    searchProductName,
    selectedYear,
    selectedMonth,
  ]);

  const loadStatusOptions = async () => {
    return [
      { value: "", label: "All Status" },
      { value: "approve", label: "Approved" },
      { value: "reject", label: "Rejected" },
      { value: "pending", label: "Pending" },
    ];
  };

  const fetchTransfers = async () => {
    try {
      const status = selectedStatus.value;
      const warehouseId = selectedWarehouse ? selectedWarehouse.value : "";
      const response = await axios.get(
        `/admin/transfers?page=${currentPage}&status=${status}&warehouseId=${warehouseId}&productName=${searchProductName}&year=${selectedYear}&month=${selectedMonth}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      if (response.data && response.data.transfers) {
        setTransfers(response.data.transfers);
      }
      if (response.data && response.data.pagination) {
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching transfers:", error);
    }
  };

  return (
    <div className="container mx-auto pt-1">
      <div className="flex items-center">
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadWarehouses}
          onChange={setSelectedWarehouse}
          placeholder="Select a warehouse"
          className={`flex-1 ${
            adminData.role_id !== 1 ? "hidden" : ""
          } relative z-50`}
        />
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadStatusOptions}
          onChange={setSelectedStatus}
          value={selectedStatus}
          placeholder="Select a status"
          className={`flex-1 ${
            adminData.role_id === 1 ? "ml-4" : ""
          } relative z-50`}
          isSearchable={false}
        />
        <input
          type="text"
          placeholder="Search Product "
          value={searchProductName}
          onChange={(e) => setSearchProductName(e.target.value)}
          className="flex-1 border rounded text-base bg-white border-gray-300 shadow-sm ml-4"
        />
        <div className="ml-4 flex items-center">
          <label className="mr-2">Year:</label>
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border rounded px-2 py-1 w-20 text-base bg-white border-gray-300 shadow-sm ml-4"
          />
        </div>
        <div className="ml-4 flex items-center">
          <label className="mr-2">Month:</label>
          <input
            type="number"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="flex-1 border px-2 py-1 w-20 rounded text-base bg-white border-gray-300 shadow-sm ml-4"
            min="1"
            max="12"
          />
        </div>
      </div>
      <div className="py-4">
        <TableComponent
          headers={[
            "From Warehouse",
            "To Warehouse",
            "Product Name",
            "Quantity",
            "Status",
            "Request Date",
            "Response Date",
          ]}
          data={transfers.map((transfer) => {
            const shouldShow =
              transfer.status === "Pending" &&
              (adminData.role_id === 1 ||
                (adminData.role_id === 2 &&
                  transfer.to_warehouse_id === adminData?.warehouse_id));
            return {
              "Transfer ID": transfer.id,
              "From Warehouse": transfer.FromWarehouse.fromWarehouseName,
              "To Warehouse": transfer.ToWarehouse.toWarehouseName,
              "Product Name": transfer.Warehouse_stock.Product.name,
              Quantity: transfer.quantity,
              "Request Date": moment(transfer.createdAt).format(
                "DD/MM/YY HH:mm"
              ),
              "Response Date":
                transfer.status !== "Pending"
                  ? moment(transfer.updatedAt).format("DD/MM/YY HH:mm")
                  : "-",
              Status: transfer.status,
              shouldShowApproveReject: shouldShow,
              _original: transfer,
            };
          })}
          onTransferDetails={(row) => {
            setSelectedTransfer(row._original);
            setShowTransferModal(true);
          }}
          showIcon={false}
          showApproveReject={true}
          onApproveReject={(row) => {
            setSelectedTransfer(row._original);
            setShowApproveRejectModal(true);
          }}
        />
      </div>
      <div className="flex justify-center items-center mt-4">
        <DefaultPagination
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
      <TransferStockModal
        show={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        transferDetails={selectedTransfer}
        fetchTransfers={fetchTransfers}
      />
      <ApproveRejectModal
        show={showApproveRejectModal}
        onClose={() => setShowApproveRejectModal(false)}
        transfer={selectedTransfer}
        onSuccessfulAction={fetchTransfers}
      />
    </div>
  );
};

export default InventoryTransferList;
