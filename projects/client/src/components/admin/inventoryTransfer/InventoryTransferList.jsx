import React, { useState, useEffect } from "react";
import TableComponent from "../../Table";
import DefaultPagination from "../../Pagination";
import TransferStockModal from "../../modal/inventoryTransfer/TransferStockModal";
import ApproveRejectModal from "../../modal/inventoryTransfer/ApproveRejectModal";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import { getCookie } from "../../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import moment from "moment";

const InventoryTransferList = () => {
  const [transfers, setTransfers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({
    value: "",
    label: "All Status",
  });
  const [searchProductName, setSearchProductName] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const access_token = getCookie("access_token");

  useEffect(() => {
    fetchTransfers();
  }, [
    currentPage,
    selectedWarehouse,
    selectedStatus,
    searchProductName,
    sortOrder,
  ]);

  useEffect(() => {}, [selectedTransfer]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedWarehouse]);

  const loadWarehouses = async (inputValue) => {
    try {
      const response = await axios.get(`/warehouse/warehouse-list`, {
        params: {
          searchName: inputValue,
        },
      });
      const warehouseOptions = [
        { value: "", label: "All Warehouses" },
        ...response.data.warehouses.map((warehouse) => ({
          value: warehouse.id,
          label: warehouse.warehouse_name,
        })),
      ];
      return warehouseOptions;
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      return [];
    }
  };

  const loadStatusOptions = async () => {
    return [
      { value: "", label: "All Status" },
      { value: "approve", label: "Approved" },
      { value: "reject", label: "Rejected" },
      { value: "pending", label: "Pending" },
    ];
  };

  const loadSortOrderOptions = async () => {
    return [
      { value: "latest", label: "Latest" },
      { value: "oldest", label: "Oldest" },
    ];
  };

  const fetchTransfers = async () => {
    try {
      const warehouseId = selectedWarehouse ? selectedWarehouse.value : null;
      const response = await axios.get(`/admin/transfers`, {
        params: {
          warehouseId: warehouseId,
          status: selectedStatus ? selectedStatus.value : "",
          productName: searchProductName,
          sort: sortOrder === "latest" ? "desc" : "asc",
          page: currentPage,
        },
        headers: { Authorization: `Bearer ${access_token}` },
      });
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
          className={`flex-1 ${adminData.role_id !== 1 ? 'hidden' : ''}`}
        />
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadStatusOptions}
          onChange={(option) => setSelectedStatus(option)}
          value={selectedStatus}
          placeholder="Select a status"
          className={`flex-1 ${adminData.role_id === 1 ? 'ml-4' : ''}`}
          isSearchable={false}
        />
        <input
          type="text"
          placeholder="Search Product "
          value={searchProductName}
          onChange={(e) => setSearchProductName(e.target.value)}
          className="flex-1 border rounded text-base bg-white border-gray-300 shadow-sm ml-4"
        />
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={loadSortOrderOptions}
          onChange={(option) => setSortOrder(option.value)}
          value={{
            value: sortOrder,
            label: sortOrder === "latest" ? "Latest" : "Oldest",
          }}
          className="flex-1 ml-4"
          isSearchable={false}
        />
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
          data={transfers.map((transfer) => ({
            "Transfer ID": transfer.id,
            "From Warehouse": transfer.FromWarehouse.fromWarehouseName,
            "To Warehouse": transfer.ToWarehouse.toWarehouseName,
            "Product Name": transfer.Warehouse_stock.Product.name,
            Quantity: transfer.quantity,
            "Request Date": moment(transfer.createdAt).format("DD/MM/YY HH:mm"),
            "Response Date":
              transfer.status !== "Pending"
                ? moment(transfer.updatedAt).format("DD/MM/YY HH:mm")
                : "-",
            Status: transfer.status,
            _original: transfer,
          }))}
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
