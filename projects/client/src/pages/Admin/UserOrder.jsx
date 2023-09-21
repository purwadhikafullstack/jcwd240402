import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import toRupiah from "@develoka/angka-rupiah-js";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import axios from "../../api/axios";

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
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  
  const orderStatusOptions = [
    { value: "", label: "all status" },
    { value: 1, label: "Pending Payment" },
    { value: 2, label: "Awaiting Payment Confirmation" },
    { value: 3, label: "Completed" },
    { value: 4, label: "In Process" },
    { value: 5, label: "Cancelled" },
    { value: 6, label: "Shipped" },
    { value: 7, label: "Rejected" },
  ];

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

  useEffect(() => {
    axios
      .get(
        `/admin/order-list?page=${currentPage}&orderStatusId=${orderStatusId}&warehouseId=${warehouseId}&month=${month}&year=${year}`,
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
        setError(err.response);
      });
  }, [warehouseId, orderStatusId, currentPage, month, year]);

  const handleChangeStatus = (status) => {
    setOrderStatusId(status.value);
  };

  const handleChangeWarehouseId = (selectedWarehouse) => {
    setWarehouseId(selectedWarehouse.value);
  };

  const refetch = async () => {
    await axios
      .get(
        `http://localhost:8000/api/admin/order-list?page=${currentPage}&orderStatusId=${orderStatusId}&warehouseId=${warehouseId}&month=${month}&year=${year}`,
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
        setError(err.response);
      });
  };

  const handleCancelOrder = async (id) => {
    try {
      const response = await axios.patch(
        `/admin/cancel-order/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.ok) {
        refetch();
      } else {
        setError("Failed to cancel the order.");
      }
    } catch (error) {
      setError(error.response?.message || "An error occurred.");
    }
  };

  const handleAcceptPayment = async (id) => {
    try {
      const response = await axios.patch(
        `/admin/accept-user-payment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.ok) {
        refetch();
      } else {
        setError("Failed to accept payment.");
      }
    } catch (error) {
      setError(error.response?.message || "An error occurred.");
    }
  };

  const handleRejectPayment = async (id) => {
    try {
      const response = await axios.patch(
        `/admin/reject-user-payment/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.data.ok) {
        refetch();
      } else {
        setError("Failed to reject payment.");
      }
    } catch (error) {
      setError(error.response?.message || "An error occurred.");
    }
  };

  const handleSendOrder = async (id) => {
    try {
      const response = await axios.patch(
        `/admin/send-order/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      if (response.data.ok) {
        refetch();
      } else {
        setError("Failed to send the order.");
      }
    } catch (error) {
      setError(error.response?.message || "An error occurred.");
    }
  };

  const handleChangeMonth = (month) => {
    setMonth(month.value);
  };

  const handleChangeYear = (year) => {
    setYear(year.value);
  };

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
              id: order?.id || "",
              Username: order?.User?.username || "",
              "Total Transaction": toRupiah(order?.total_price) || "",
              "Delivery Cost": toRupiah(order?.delivery_price) || "0",
              Image: order?.img_payment || "",
              Status: order?.Order_status?.name || "",
              invoiceId: order?.no_invoice,
              "Delivering From": order?.Warehouse?.address_warehouse || "",
              "Delivering to": order?.Address_user?.address_details || "",
              "Delivery Time": order?.delivery_time || "not yet delivered",
              order_status_id: order.order_status_id,
              Order_details: order?.Order_details,
            }))}
            showIcon={false}
            showApprove={true}
            showReject={true}
            showSend={true}
            showCancel={true}
            showAsyncAction={true}
            onCancel={(row) => handleCancelOrder(row)}
            onApprove={(row) => handleAcceptPayment(row)}
            onReject={(row) => handleRejectPayment(row)}
            onSend={(row) => handleSendOrder(row)}
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
