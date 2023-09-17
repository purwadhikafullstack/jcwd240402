import axios from "axios";
import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import Button from "../../components/Button";
import DefaultPagination from "../../components/Pagination";
import { useSelector } from "react-redux";
import toRupiah from "@develoka/angka-rupiah-js";

const UserOrder = () => {

  const [userOrderList, setUserOrderList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [warehouseId, setWarehouseId] = useState("");
  const [orderStatusId, setOrderStatusId] = useState("");
  const [error, setError] = useState("");
  const [roleId, setRoleId] = useState("");
  

  const getCookieValue = (name) =>
    document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop() || "";

  const token = getCookieValue("access_token");

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

  const warehouseOptions = [
    { value: "", label: "any warehouse" },
    { value: 1, label: "Furnifor BSD" },
    { value: 2, label: "Furnifor Surabaya" },
    { value: 3, label: "Furnifor Jakarta" },
    { value: 4, label: "Furnifor Malang" },
  ];
  
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admin/checkrole`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setRoleId(response.data.role);
      })
      .catch((err) => {
        setError(err.response.message);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/admin/order-list?page=${currentPage}&orderStatusId=${orderStatusId}&warehouseId=${warehouseId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
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

  const handleChangeWarehouseId = (warehouseId) => {
    setWarehouseId(warehouseId.value);
  };

  const handleApprove = () => {
    
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="container mx-auto pt-1">
      <div className="flex items-center">
        <Select
            options={orderStatusOptions}
            placeholder={<div>Order Status</div>}
            onChange={handleChangeStatus}
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
      </div>
      <div className="py-4">
        <TableComponent
          headers={["Username", "Total Transaction", "Delivery Cost", "Payment Proof", "Status", "Delivering to", "Delivering From", "Delivery Time"]}
          data={userOrderList.map((order) => ({
            "Username": order?.User?.username || "",
            "Total Transaction": toRupiah(order?.total_price) || "",
            "Delivery Cost": toRupiah(order?.delivery_price) || "0",
            "Payment Proof": order?.img_payment || "",
            "Status": order?.Order_status?.name || "",
            "Delivering to": order?.Address_user?.address_details || "",
            "Delivering From": order?.Warehouse?.address_warehouse || "",
            "Delivery Time": order?.delivery_time || "not yet delivered",
          }))}
          showIcon = {false}
          showApprove = {true}
          showReject = {true}
          showSend = {true}
          showCancel = {true}
          // onApprove={}
          // onReject={}
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

export default UserOrder;
