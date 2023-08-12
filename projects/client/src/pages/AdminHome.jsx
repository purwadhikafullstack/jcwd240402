import React from "react";
import SidebarAdmin from "../components/SidebarAdminDesktop";

const AdminHome = () => {
  return (
    <div className="bg-blue1 h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdmin />
      </div>
    </div>
  );
};

export default AdminHome;
