import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Tabs from '../../components/Tab/TabContainer';
import { Outlet } from 'react-router-dom';
import SidebarAdminDesktop from '../../components/SidebarAdminDesktop';
import withAuthAdmin from '../../components/admin/withAuthAdmin';
import axios from '../../api/axios';
import { getCookie } from '../../utils/tokenSetterGetter';
import { profileAdmin } from '../../features/adminDataSlice';

const AdminProductPage = () => {
  const access_token = getCookie('access_token');
  const dispatch = useDispatch();

  const tabData = [
    {
      label: 'Product List',
      isActive: window.location.pathname === '/admin/products',
      to: '/admin/products',
    },
    {
      label: 'Create Product',
      isActive: window.location.pathname === '/admin/products/create',
      to: '/admin/products/create',
    },
  ];

  useEffect(() => {
    axios
      .get('/admin/profile', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      .then((res) => {
        dispatch(profileAdmin(res.data?.result));
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
      });
  }, [access_token, dispatch]);

  return (
    <div className="h-screen lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start lg:h-screen">
        <SidebarAdminDesktop />
      </div>
      <div className="flex flex-col h-full">
        <div className="border-b p-4">
          <Tabs tabData={tabData} />
        </div>
        <div className="flex-1 overflow-auto px-8 pt-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default withAuthAdmin(AdminProductPage);


