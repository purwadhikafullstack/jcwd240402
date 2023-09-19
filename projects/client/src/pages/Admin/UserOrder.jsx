import axios from "axios";
import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import toRupiah from "@develoka/angka-rupiah-js";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";

const UserOrder = () => {
  const [userOrderList, setUserOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [warehouseId, setWarehouseId] = useState("");
  const [orderStatusId, setOrderStatusId] = useState("");
  const [error, setError] = useState("");
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const access_token = getCookie("access_token");
  const [selectedActions, setSelectedActions] = useState([]);

  const orderStatusOptions = [
    { value: "", label: "all status" },
    { value: 1, label: "Pending Payment" },
    { value: 2, label: "Awaiting Payment Confirmation" },
    { value: 3, label: "Completed" },
    { value: 4, label: "In Process" },
    { value: 5, label: "Cancelled" },
    { value: 6, label: "Shipped" },
    { value: 7, label: "Order Confirmed" },
  ];

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

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/admin/order-list?page=${currentPage}&orderStatusId=${orderStatusId}&warehouseId=${warehouseId}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then((response) => {
        setUserOrderList(response.data.orders);
        setTotalPages(response.pagination.totalPages);
      })
      .catch((err) => {
        setError(err.response.message);
      });
  }, [warehouseId, orderStatusId, currentPage]);

  const handleChangeStatus = (status) => {
    setOrderStatusId(status.value);
  };

  const handleChangeWarehouseId = (selectedWarehouse) => {
    setWarehouseId(selectedWarehouse.value);
  };

  // const handleApproveOrder = async (order) => {
  //   try {
  //     const response = await axios.patch(

  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.data.success) {
  //     } else {
  //       setError("Failed to approve the order.");
  //     }
  //   } catch (error) {
  //     setError(error.response?.message || "An error occurred.");
  //   }
  // };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="container mx-auto p-4">
        <div className="flex items-center">
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
          <Select
            options={orderStatusOptions}
            placeholder="Order Status"
            onChange={handleChangeStatus}
            className="flex-1 rounded text-base bg-white  shadow-sm"
          />
        </div>
        <div className="pt-4">
          <TableComponent
            headers={[
              "Username",
              "Total Transaction",
              "Delivery Cost",

              "Status",
              "Delivering to",
              "Delivering From",
              "Delivery Time",
            ]}
            data={userOrderList.map((order) => ({
              Username: order?.User?.username || "",
              "Total Transaction": toRupiah(order?.total_price) || "",
              "Delivery Cost": toRupiah(order?.delivery_price) || "0",
              Image: order?.img_payment || "",
              Status: order?.Order_status?.name || "",
              invoiceId: order?.no_invoice,
              "Delivering From": order?.Warehouse?.address_warehouse || "",
              "Delivering to": order?.Address_user?.address_details || "",
              "Delivery Time": order?.delivery_time || "not yet delivered",
            }))}
            showIcon={false}
            showApprove={true}
            showReject={true}
            showSend={true}
            showCancel={true}
            showAsyncAction={true}
            // onApprove={handleApproveOrder}
          />
        </div>
        <div className="flex justify-center items-center mt-4">
          <DefaultPagination
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuthAdminWarehouse(UserOrder);
