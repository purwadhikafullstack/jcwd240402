import React from "react";
import Tabs from "../../components/Tab/TabContainer";
import { Outlet } from "react-router-dom";
import SidebarAdminDesktop from "../../components/SidebarAdminDesktop"; 

const AdminStockPage = () => {
    const tabData = [
        {
          label: "Stock Overview", 
          isActive: window.location.pathname === "/admin/stock",
          to: "/admin/stock",
        },
        {
          label: "Manage Stock", 
          isActive: window.location.pathname === "/admin/stock/management",
          to: "/admin/stock/management",
        }
    ];
    

  return (
    <div className="h-screen lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start lg:h-screen">
        <SidebarAdminDesktop />
      </div>
      <div className="flex flex-col h-full">
        <div className="border-b p-4">
          <Tabs tabData={tabData} />
        </div>
        <div className="flex-1 overflow-auto px-8 pt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminStockPage;

