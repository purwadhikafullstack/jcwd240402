import React from "react";
import SidebarAdmin from "../../components/SidebarAdminDesktop";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import { useSelector } from "react-redux";
import DashboardAdmin from "../../components/admin/DashboardAdmin";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";

const AdminHome = () => {
  const adminData = useSelector((state) => state.profilerAdmin.value);

  return (
    <div className="bg-white h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdmin adminData={adminData} />
      </div>
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />

        <div className="w-full h-full">
          <DashboardAdmin adminData={adminData} />
        </div>
      </div>
    </div>
  );
};

export default withAuthAdminWarehouse(AdminHome);
