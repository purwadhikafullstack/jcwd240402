import React from "react";
import SidebarAdmin from "../../components/SidebarAdminDesktop";
import AdminCardProduct from "../../components/AdminCardProduct";

const AdminHome = () => {
  return (
    <div className="bg-blue1 h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdmin />
        <AdminCardProduct/>
      </div>
    </div>
  );
};

export default AdminHome;
