import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import { getCookie } from "../../utils/tokenSetterGetter";
import { useSelector } from "react-redux";
import axios from "../../api/axios";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";
import { rupiahFormat } from "../../utils/formatter";
import dayjs from "dayjs";

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
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [openAlert, setOpenAlert] = useState(false);

  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const [defaultYear, setDefaultYear] = useState([]);

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

  const loadYearOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/year?db=order&timeColumn=created`,
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
      return yearOptions;
    } catch (error) {
      console.error("Error loading year:", error);
      return [];
    }
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

  useEffect(() => {
    if (adminData.role_id === 2) {
      setWarehouseId(adminData?.warehouse_id);
    }

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
        setUserOrderList(response?.data?.orders);
        setTotalPages(response?.pagination?.totalPages);
      })
      .catch((err) => {
        setError(err.response);
      });
  }, [warehouseId, orderStatusId, currentPage, month, year, adminData]);

  const handleChangeStatus = (status) => {
    setOrderStatusId(status.value);
  };

  const handleChangeWarehouseId = (selectedWarehouse) => {
    setWarehouseId(selectedWarehouse.value);
  };

  const refetch = async () => {
    await axios
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

      if (response.data.ok) {
        refetch();
        setErrMsg("");
        setSuccessMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setSuccessMsg("");
        }, 4000);
      } else {
        setSuccessMsg("");
        setError("Failed to cancel the order.");
        setErrMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      }
    } catch (error) {
      setSuccessMsg("");
      setError(error.response?.message || "An error occurred.");
      setErrMsg(error.response?.data?.message);
      setOpenAlert(true);
      setTimeout(() => {
        setErrMsg("");
      }, 4000);
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
      console.log("accept", response.data);
      if (response.data.ok) {
        refetch();
        setErrMsg("");
        setSuccessMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setSuccessMsg("");
        }, 4000);
      } else {
        setSuccessMsg("");
        setError("Failed to cancel the order.");
        setErrMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      }
    } catch (error) {
      setSuccessMsg("");
      setError(error.response?.message || "An error occurred.");
      setErrMsg(error.response?.data?.message);
      setOpenAlert(true);
      setTimeout(() => {
        setErrMsg("");
      }, 4000);
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
        setErrMsg("");
        setSuccessMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setSuccessMsg("");
        }, 4000);
      } else {
        setSuccessMsg("");
        setError("Failed to cancel the order.");
        setErrMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      }
    } catch (error) {
      setSuccessMsg("");
      setError(error.response?.message || "An error occurred.");
      setErrMsg(error.response?.data?.message);
      setOpenAlert(true);
      setTimeout(() => {
        setErrMsg("");
      }, 4000);
    }
  };

  const handleSendOrder = async (id) => {
    console.log(id);
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
        setErrMsg("");
        setSuccessMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setSuccessMsg("");
        }, 4000);
      } else {
        setSuccessMsg("");
        setError("Failed to cancel the order.");
        setErrMsg(response.data.message);
        setOpenAlert(true);
        setTimeout(() => {
          setErrMsg("");
        }, 4000);
      }
    } catch (error) {
      setSuccessMsg("");
      setError(error.response?.message || "An error occurred.");
      setErrMsg(error.response?.data?.message);
      setOpenAlert(true);
      setTimeout(() => {
        setErrMsg("");
      }, 4000);
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
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="lg:container lg:mx-auto lg:p-4 lg:w-full p-4">
          <div className="flex items-center">
            {adminData.role_id == 1 && (
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={loadWarehouseOptions}
                onChange={handleChangeWarehouseId}
                placeholder="All Warehouses"
                className="flex-1  rounded text-base bg-white  shadow-sm pr-4 relative z-50"
              />
            )}
            <Select
              options={orderStatusOptions}
              placeholder="Order Status"
              onChange={handleChangeStatus}
              className="flex-1 rounded text-base bg-white  shadow-sm relative z-50"
            />
            <Select
              options={monthOptions}
              placeholder={<div>select a month</div>}
              onChange={handleChangeMonth}
              className="flex-1  rounded text-base bg-white  shadow-sm pl-4 pr-2 relative z-50"
            />
            <AsyncSelect
              cacheOptions
              defaultOptions={defaultYear}
              loadOptions={loadYearOptions}
              value={year || null}
              onChange={handleChangeYear}
              placeholder="Select year"
              className="flex-1  rounded text-base bg-white  shadow-sm pr-4 relative z-50"
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
                "Order Date",
              ]}
              data={userOrderList.map((order) => ({
                id: order?.id || "",
                Username: order?.User?.username || "",
                "Total Transaction": rupiahFormat(order?.total_price) || "",
                "Delivery Cost": rupiahFormat(order?.delivery_price) || "0",
                Image: order?.img_payment || "",
                Status: order?.Order_status?.name || "",
                invoiceId: order?.no_invoice,
                "Delivering From": order?.Warehouse?.warehouse_name || "",
                "Delivering to": order?.Address_user?.address_details || "",
                "Delivery Time": order?.delivery_time
                  ? dayjs(order?.delivery_time).format("D MMMM YYYY HH:mm:ss")
                  : "not yet delivered",
                order_status_id: order?.order_status_id,
                Order_details: order?.Order_details,
                "Order Date": dayjs(order?.createdAt).format(
                  "D MMMM YYYY hh:mm:ss"
                ),
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
              successMsg={successMsg}
              errMsg={errMsg}
              openAlert={openAlert}
              setOpenAlert={setOpenAlert}
              color="failure"
            />
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

export default withAuthAdminWarehouse(UserOrder);