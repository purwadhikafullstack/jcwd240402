import React from "react";
import Tabs from "../../components/tab/TabContainer";
import { Outlet } from "react-router-dom";
import SidebarAdminDesktop from "../../components/SidebarAdminDesktop";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";

const AdminStockPage = () => {
  const tabData = [
    {
      label: "Stock Overview",
      isActive: window.location.pathname === "/admin/stock-list",
      to: "/admin/stock-list",
    },
    {
      label: "Manage Stock",
      isActive: window.location.pathname === "/admin/stock-list/management",
      to: "/admin/stock-list/management",
    },
    {
      label: "Inventory Transfer",
      isActive:
        window.location.pathname === "/admin/stock-list/inventory-transfers",
      to: "/admin/stock-list/inventory-transfers",
    },
  ];

  return (
    <div className="h-screen lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start lg:h-screen">
        <SidebarAdminDesktop />
      </div>
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="lg:flex lg:flex-col lg:h-full lg:w-full">
          <div className="border-b p-4">
            <Tabs tabData={tabData} />
          </div>
          <div className="flex-1 overflow-auto lg:px-8 lg:pt-8 p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdminWarehouse(AdminStockPage);
