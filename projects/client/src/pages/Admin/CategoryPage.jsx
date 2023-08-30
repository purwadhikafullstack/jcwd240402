import React from "react";
import Tabs from "../../components/Tab/TabContainer";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/SidebarAdminDesktop"; 
import withAuthAdmin from '../../components/admin/withAuthAdmin';


const CategoryPage = () => {
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
    <div className="h-screen lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start lg:h-screen">
        <Sidebar/>
      </div>
      <div className="flex flex-col h-full">
        <div className="border-b p-4">
          <Tabs tabData={tabData}/>
        </div>
        <div className="flex-1 overflow-auto px-8 pt-8">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdmin(CategoryPage);