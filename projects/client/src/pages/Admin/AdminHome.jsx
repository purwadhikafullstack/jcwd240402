import React from "react";
import SidebarAdmin from "../../components/SidebarAdminDesktop";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import { useSelector} from "react-redux";


const AdminHome = () => {
  const adminData = useSelector((state) => state.profilerAdmin.value);
  
  return (
    <div className="bg-blue1 h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <SidebarAdmin adminData={adminData} />
      </div>
    </div>
  );
};


export default withAuthAdminWarehouse(AdminHome);
