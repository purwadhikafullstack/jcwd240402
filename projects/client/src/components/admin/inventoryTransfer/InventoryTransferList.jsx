import React, { useState, useEffect } from "react";
import TableComponent from "../../Table";
import DefaultPagination from "../../Pagination";
import TransferStockModal from "../../modal/inventoryTransfer/TransferStockModal";
import axios from "../../../api/axios";

const InventoryTransferList = () => {
  const [transfers, setTransfers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);

  useEffect(() => {
    fetchTransfers();
  }, [currentPage]);

  const fetchTransfers = async () => {
    try {
      const response = await axios.get(`/admin/transfers`, {
        params: {
          page: currentPage,
        },
      });
      console.log(response);

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

  const handleTransferDetails = (transfer) => {
    setSelectedTransfer(transfer);
    setShowTransferModal(true);
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
          ]}
          data={transfers.map((transfer) => ({
            "Transfer ID": transfer.id,
            "From Warehouse": transfer.FromWarehouse.fromWarehouseName,
            "To Warehouse": transfer.ToWarehouse.toWarehouseName,
            "Product Name":transfer.Warehouse_stock.Product.name,
            "Quantity": transfer.quantity,
            "Status": transfer.status,
          }))}
          onTransferDetails={handleTransferDetails}
          showIcon = {false}
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
    </div>
  );
};

export default InventoryTransferList;
