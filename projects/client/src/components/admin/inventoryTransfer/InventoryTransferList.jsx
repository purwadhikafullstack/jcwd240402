import React, { useState, useEffect } from "react";
import TableComponent from "../../Table";
import DefaultPagination from "../../Pagination";
import TransferStockModal from "../../modal/inventoryTransfer/TransferStockModal";
import ApproveRejectModal from "../../modal/inventoryTransfer/ApproveRejectModal";
import axios from "../../../api/axios";
import moment from "moment";

const InventoryTransferList = () => {
  const [transfers, setTransfers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);

  useEffect(() => {
    fetchTransfers();
  }, [currentPage]);

  useEffect(() => {
  }, [selectedTransfer]);

  const fetchTransfers = async () => {
    try {
      const response = await axios.get(`/admin/transfers`, {
        params: {
          page: currentPage,
        },
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
      <div className="py-4">
        <TableComponent
          headers={[
            "From Warehouse",
            "To Warehouse",
            "Product Name",
            "Quantity",
            "Status",
            "Request Date",
            "Response Date"
          ]}
          data={transfers.map((transfer) => ({
            "Transfer ID": transfer.id,
            "From Warehouse": transfer.FromWarehouse.fromWarehouseName,
            "To Warehouse": transfer.ToWarehouse.toWarehouseName,
            "Product Name": transfer.Warehouse_stock.Product.name,
            Quantity: transfer.quantity,
            "Request Date": moment(transfer.createdAt).format("DD/MM/YY HH:mm"),
            "Response Date": transfer.status !== "Pending" ? moment(transfer.updatedAt).format("DD/MM/YY HH:mm") : "-",
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
            console.log(row)
            setSelectedTransfer(row._original);
            console.log(selectedTransfer)
            setShowApproveRejectModal(true);
          }}
        />
      </div>
      <div className="flex justify-center items-center mt-4">
        <DefaultPagination
          totalPages={totalPages}
          onPageChange={setCurrentPage}
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






