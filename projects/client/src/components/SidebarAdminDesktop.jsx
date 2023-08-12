import React from "react";
import { Link } from "react-router-dom";
import { Sidebar } from "flowbite-react";
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineShop,
  AiOutlineOrderedList,
  AiOutlineBarChart,
} from "react-icons/ai";

export default function MultiLevelDropdown() {
  const adminRoutes = [
    { to: "/admin", label: "Admin", icon: AiOutlineUser },
    { to: "/warehouse", label: "Warehouse", icon: AiOutlineShop },
    { to: "/order", label: "Order", icon: AiOutlineOrderedList },
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
    <Sidebar className="bg-blue1 text-base_grey font-poppins">
      <Sidebar.Logo
        href="#"
        img="https://fiverr-res.cloudinary.com/t_main1,q_auto,f_auto/gigs/294518105/original/9ccc25635f75ef3a4d8f2fc33b9e81d12c98b72d.jpg"
        imgAlt="Your Logo Description"
        className="text-blue1"
      >
        Blues
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/admin-dashboard" className="flowbite-sidebar-link text-base_grey hover:text-blue4 text-center">
            <Sidebar.Item className="hover:text-blue1 hover:border-base_black bg-blue5">Dashboard</Sidebar.Item>
          </Link>
          {adminRoutes.map((route, idx) => (
            route.subRoutes ? (
              <Sidebar.Collapse key={idx} icon={route.icon} label={route.label} className="hover:text-blue1 hover:border-b-4 hover:border-base_black">
                {route.subRoutes.map((subItem, subIdx) => (
                  <Link
                    key={subIdx}
                    to={subItem.to}
                    className="flowbite-sidebar-link text-base_grey hover:text-blue4"
                  >
                    <Sidebar.Item>{subItem.label}</Sidebar.Item>
                  </Link>
                ))}
              </Sidebar.Collapse>
            ) : (
              <Link key={idx} to={route.to} className="flowbite-sidebar-link text-base_grey hover:text-blue4 hover:border-b-4 hover:border-base_black">
                <Sidebar.Item icon={route.icon}>{route.label}</Sidebar.Item>
              </Link>
            )
          ))}
          <Sidebar.Item icon={AiOutlineLogout} className="hover:text-blue1 hover:border-b-4 hover:border-base_black">
            <p>Logout</p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
