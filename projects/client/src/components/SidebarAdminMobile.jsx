import React from 'react';
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
} from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import logo from '../assets/images/furniforLogo.webp';
import { logout } from '../utils/tokenSetterGetter';
import { BsGraphUpArrow } from "react-icons/bs";

const SidebarAdminMobile = () => {
  const location = useLocation();
  const adminData = useSelector((state) => state.profilerAdmin.value);
  const adminRoutes = [
    { to: '/admin', label: 'Admin', icon: AiOutlineUser, roles: [1] },
    { to: '/admin/users', label: 'Users', icon: AiOutlineTeam, roles: [1] },
    {
      to: '/admin/warehouses',
      label: 'Warehouse',
      icon: AiOutlineShop,
      roles: [1],
    },
    {
      to: '/admin/products',
      label: 'Product',
      icon: AiOutlineShopping,
    },
    {
      to: '/admin/categories',
      label: 'Category',
      icon: AiOutlineAppstoreAdd,
    },
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
    { to: '/admin/order', label: 'Order', icon: AiOutlineOrderedList },
    { to: '/admin/stock', label: 'Stock', icon: AiFillDatabase },
  ];

  function handleLogout() {
    logout();
  }

  return (
    <div className='w-16 h-screen sticky z-30 top-0 lg:hidden bg-blue3 shadow-card-1'>
      <div className='h-full w-full p-2 flex flex-col justify-evenly'>
        <div
          className={`flex flex-col justify-center items-center ${
            location.pathname === '/admin-dashboard' ? 'bg-yellow2' : 'bg-gray-200 '
          } rounded-lg p-1`}
        >
          <Link to='/admin-dashboard'>
            <img src={logo} alt='' />
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
              className={`text-[9px] ${location.pathname === item.to ? 'bg-yellow2' : 'bg-gray-200 '} rounded-lg p-2`}
            >
              <div className='text-center flex flex-col justify-center items-center'>
                <item.icon className='text-2xl' />
                {item.label}
              </div>
            </Link>
          );
        })}
        <div className='flex flex-col justify-center items-center'>
          <button onClick={handleLogout}>
            <AiOutlineLogout className='text-4xl text-white' />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdminMobile;
