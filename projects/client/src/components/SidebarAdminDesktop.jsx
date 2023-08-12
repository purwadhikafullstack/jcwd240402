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
    {
      label: "Admin",
      icon: AiOutlineUser,
      subRoutes: [
        { to: "/register-admin", label: "Register Admin" },
        { to: "/manage-users", label: "User List" },
        { to: "/manage-users", label: "Admin List" },
        { to: "/assign-admin", label: "Assign Admin" },
      ],
    },
    {
      label: "Warehouse",
      icon: AiOutlineShop,
      subRoutes: [
        { to: "/manage-warehouse", label: "Warehouse" },
        { to: "/manage-product-category", label: "Product Category" },
        { to: "/manage-product", label: "Product Data" },
      ],
    },
    {
      label: "Order",
      icon: AiOutlineOrderedList,
      subRoutes: [
        { to: "/user-orders", label: "Orders List" },
      ],
    },
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
    <Sidebar aria-label="Sidebar with multi-level dropdown example" className="bg-blue1 text-base_grey font-poppins">
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
          {adminRoutes.map(({ label, icon, subRoutes }, idx) => (
            <React.Fragment key={idx}>
              <Sidebar.Collapse icon={icon} label={label} className="hover:text-blue1 hover:border-b-4 hover:border-base_black">
                {subRoutes.map((subItem, subIdx) => (
                  <Link
                    key={subIdx}
                    to={subItem.to}
                    className="flowbite-sidebar-link text-base_grey hover:text-blue4"
                  >
                    <Sidebar.Item>{subItem.label}</Sidebar.Item>
                  </Link>
                ))}
              </Sidebar.Collapse>
            </React.Fragment>
          ))}
          <Sidebar.Item icon={AiOutlineLogout} className="hover:text-blue1 hover:border-b-4 hover:border-base_black">
            <p>Logout</p>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
