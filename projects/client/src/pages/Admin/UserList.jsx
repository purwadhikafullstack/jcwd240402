import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import moment from "moment";
import withAuthAdmin from "../../components/admin/withAuthAdmin";
import { getCookie } from "../../utils/tokenSetterGetter";
import useURLParams from "../../utils/useUrlParams";
import axios from "../../api/axios";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";

const UserList = () => {
  const { syncStateWithParams, setParam } = useURLParams();
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState(
    syncStateWithParams("searchName", "")
  );
  const [currentPage, setCurrentPage] = useState(
    syncStateWithParams("page", 1)
  );
  const [totalPages, setTotalPages] = useState(1);
  const access_token = getCookie("access_token");

  const resetPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    setParam("searchName", searchName);
    setParam("page", currentPage);
    refreshUserList();
  }, [searchName, currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        `/admin/user-list?searchName=${searchName}&page=${currentPage}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      setUsers(response.data.users);
      const { totalPages } = response.data.pagination;
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const formattedUsers = users.map((user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    verified: user.is_verify === 1 ? "Yes" : "No",
    "Created at": moment(user.createdAt).format("MMMM D, YYYY"),
    "First Name": user.User_detail?.first_name,
    "Last Name": user.User_detail?.last_name,
    Phone: user.User_detail?.phone,
    Address: user.Address_users[0]?.address_details,
  }));

  const refreshUserList = async () => {
    await fetchUsers();
    if (formattedUsers.length === 0 && currentPage > 1) {
      resetPage();
    }
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="lg:px-8 lg:pt-8 lg:w-full mt-4 mx-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Search User name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mx-4"
            />
          </div>
          <div className="py-4 mx-4">
            <TableComponent
              headers={[
                "username",
                "First Name",
                "Last Name",
                "email",
                "Address",
                "verified",
                "Created at",
                "Phone",
              ]}
              data={formattedUsers}
              showIcon={false}
            />
          </div>
          <div className="flex justify-center items-center w-full bottom-0 position-absolute">
            <DefaultPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuthAdmin(UserList);
