import React from "react";
import Tabs from "../../components/Tab/TabContainer";
import { Outlet } from "react-router-dom";
import SidebarAdminDesktop from "../../components/SidebarAdminDesktop"; 

const StockPage = () => {
  const tabData = [
    {
      label: "Product List",
      isActive: window.location.pathname === "/admin/products",
      to: "/admin/products",
    },
    {
      label: "Create Product",
      isActive: window.location.pathname === "/admin/products/create",
      to: "/admin/products/create",
    }
  ];

  return (
    <div className="h-screen lg:grid lg:grid-cols-[auto,1f]">
      <div className="lg:flex lg:flex-col lg:justify-start lg:h-screen">
        <SidebarAdminDesktop />
      </div>
      <div className="flex flex-col h-full">
        <div className="border-b p-4">
          <Tabs tabData={tabData} />
        </div>
        <div className="flex-1 px-8 pt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StockPage;