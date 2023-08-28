import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import login from "../assets/images/furnifor.png";
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineShop,
  AiOutlineOrderedList,
  AiOutlineBarChart,
  AiOutlineAppstoreAdd,
  AiOutlineShopping,
  AiFillDatabase,
} from "react-icons/ai";

export default function SidebarAdminDesktop() {
  const adminRoutes = [
    { to: "/admin", label: "Admin", icon: AiOutlineUser },
    { to: "/warehouse", label: "Warehouse", icon: AiOutlineShop },
    { to: "/admin/products", label: "Product", icon: AiOutlineShopping },
    { to: "/category", label: "Category", icon: AiOutlineAppstoreAdd },
    { to: "/order", label: "Order", icon: AiOutlineOrderedList },
    { to: "/admin/stock", label: "Stock Management", icon: AiFillDatabase },
    {
      label: "Report",
      icon: AiOutlineBarChart,
      subRoutes: [
        { to: "/sales-report", label: "Sales Report" },
        { to: "/stock-history", label: "Stock History" },
      ],
    },
  ];

  return (
    <Sidebar className="text-base_grey font-poppins">
      <Sidebar.Logo
        href="#"
        img={login}
        imgAlt="Your Logo Description"
        className="text-blue1"
      >
        Furnifor
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/admin-dashboard" className="flowbite-sidebar-link text-base_grey hover:text-blue4 text-center">
            <Sidebar.Item className=" hover:border hover-bg-blue3 hover:border-black hover:text-blue1 bg-blue2 text-white">Dashboard</Sidebar.Item>
          </Link>
          {adminRoutes.map((route, idx) => (
            <div key={idx} className=" hover:border hover:border-black  rounded-md">
              {route.subRoutes ? (
                <Sidebar.Collapse icon={route.icon} label={route.label}>
                  {route.subRoutes.map((subItem, subIdx) => (
                    <Link
                      key={subIdx}
                      to={subItem.to}
                      className="flowbite-sidebar-link text-base_grey hover:border hover:border-black   hover:text-black"
                    >
                      <Sidebar.Item>{subItem.label}</Sidebar.Item>
                    </Link>
                  ))}
                </Sidebar.Collapse>
              ) : (
                <Link to={route.to} className="flowbite-sidebar-link text-base_grey">
                  <Sidebar.Item icon={route.icon}>{route.label}</Sidebar.Item>
                </Link>
              )}
            </div>
          ))}
          <Sidebar.Item icon={AiOutlineLogout} className=" hover:border hover:border-black ">
            <p>Logout</p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
