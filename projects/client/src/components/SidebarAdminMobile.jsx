import React from "react";
import {
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineLogout,
  AiOutlineShop,
  AiOutlineOrderedList,
  AiOutlineBarChart,
  AiOutlineAppstoreAdd,
  AiOutlineShopping,
  AiFillDatabase,
} from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../utils/tokenSetterGetter";
import logo from "../assets/images/furniforLogo.webp";
import { useSelector } from "react-redux";

const SidebarAdminMobile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const adminRoutes = [
    {
      to: "/admin/admin-list",
      label: "Admin",
      icon: AiOutlineUser,
      roles: [1],
    },
    { to: "/admin/user-list", label: "Users", icon: AiOutlineTeam, roles: [1] },
    {
      to: "/admin/warehouses",
      label: "Warehouse",
      icon: AiOutlineShop,
      roles: [1],
    },
    {
      to: "/admin/products",
      label: "Product",
      icon: AiOutlineShopping,
    },
    {
      to: "/admin/categories",
      label: "Category",
      icon: AiOutlineAppstoreAdd,
    },
    { to: "/admin/order-list", label: "Order", icon: AiOutlineOrderedList },
    { to: "/admin/stock-list", label: "Stock", icon: AiFillDatabase },
    {
      label: "Sales Report",
      icon: BsGraphUpArrow,
      to: "/admin/sales-report",
    },
    {
      label: "Stock History",
      icon: AiOutlineBarChart,
      to: "/admin/stock-history",
    },
  ];

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="w-16 h-screen sticky z-30 top-0 lg:hidden bg-blue3 shadow-card-1">
      <div className="h-full w-full p-2 flex flex-col justify-evenly">
        {/* 
        
         location.pathname === "/admin/admin-dashboard"
              ? "bg-yellow2"
              : "bg-gray-200 "
          } rounded-lg p-1`}
        >
          <Link to="/admin/admin-dashboard">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        {adminRoutes.map((item, idx) => (
          <Link
            to={item.to}
            className={`text-[9px] ${
              location.pathname.includes(item.to)
                ? "bg-yellow2"
                : "bg-gray-200 "
            } rounded-lg p-2`}
            key={idx}
          >
            <div
        */}
        <div
          className={`flex flex-col justify-center items-center ${
            location.pathname === "/admin/admin-dashboard"
              ? "bg-yellow2"
              : "bg-gray-200 "
          } rounded-lg p-1`}
        >
          <Link to="/admin/admin-dashboard">
            <img src={logo} alt="" />
          </Link>
        </div>
        {adminRoutes.map((item, idx) => {
          if (item.roles && !item.roles.includes(adminData?.role_id)) {
            return null;
          }

          return (
            <Link
              key={idx}
              to={item.to}
              className={`text-[9px] ${
                location.pathname.includes(item.to)
                  ? "bg-yellow2"
                  : "bg-gray-200 "
              } rounded-lg p-2`}
            >
              <div className="text-center flex flex-col justify-center items-center">
                <item.icon className="text-2xl" />
                {item.label}
              </div>
            </Link>
          );
        })}
        <div className="flex flex-col justify-center items-center">
          <button onClick={handleLogout}>
            <AiOutlineLogout className="text-4xl text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdminMobile;
