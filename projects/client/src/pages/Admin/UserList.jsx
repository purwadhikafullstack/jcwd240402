import React, { useState, useEffect } from "react";
import TableComponent from "../../components/Table";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import moment from "moment";
import withAuthAdmin from "../../components/admin/withAuthAdmin";
import { getCookie } from "../../utils/tokenSetterGetter";
import axios from "../../api/axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const access_token = getCookie("access_token");

  useEffect(() => {
    fetchUsers();
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
    is_verify: user.is_verify === 1 ? "Yes" : "No",
    "Created at": moment(user.createdAt).format("MMMM D, YYYY"),
  }));

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search User name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mx-4"
          />
        </div>
        <div className="py-4">
          <TableComponent
            headers={["username", "email", "is_verify", "Created at"]}
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
  );
};

export default withAuthAdmin(UserList);
