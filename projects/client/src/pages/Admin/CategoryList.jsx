import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import Button from "../../components/Button";
import AdminCategoryCard from "../../components/admin/card/AdminCardCategory";
import RegisterCategoryModal from "../../components/modal/category/ModalRegisterCategory";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import { useSelector } from "react-redux";
import useURLParams from "../../utils/useUrlParams";
import SidebarAdminMobile from "../../components/SidebarAdminMobile";

const CategoryList = () => {
  const { syncStateWithParams, setParam } = useURLParams();
  const [searchName, setSearchName] = useState(
    syncStateWithParams("searchName", "")
  );
  const [currentPage, setCurrentPage] = useState(
    syncStateWithParams("page", 1)
  );

  const [categories, setCategories] = useState([]);

  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const adminData = useSelector((state) => state.profilerAdmin.value);

  useEffect(() => {
    setParam("searchName", searchName);
    setParam("page", currentPage);
    fetchCategories();
  }, [searchName, currentPage]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/admin/categories`, {
        params: {
          page: currentPage,
          name: searchName,
        },
      });

      if (response.data.success) {
        setCategories(response.data.data);
        const { totalPages } = response.data.pagination;
        setTotalPages(totalPages);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSuccessfulEdit = () => {
    fetchCategories();
  };

  const handleRegisterSuccess = () => {
    fetchCategories();
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="flex lg:flex-none">
        <SidebarAdminMobile />
        <div className="px-8 pt-8 w-full">
          <div className="flex items-center space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search Category Name"
                className="w-full p-2 border rounded text-base bg-white border-gray-300 shadow-sm"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <Button
              buttonSize="medium"
              buttonText="Register"
              onClick={() => setShowModal(true)}
              bgColor="bg-blue3"
              colorText="text-white"
              fontWeight="font-semibold"
              isVisible={adminData.role_id !== 1}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {categories.map((category) => (
              <AdminCategoryCard
                key={category.id}
                src={category.category_img}
                name={category.name}
                createdAt={category.createdAt}
                id={category.id}
                handleSuccessfulEdit={handleSuccessfulEdit}
              />
            ))}
          </div>
          <div className="flex justify-center items-center w-full my-4">
            <DefaultPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </div>
          <RegisterCategoryModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onSuccessfulRegister={handleRegisterSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuthAdminWarehouse(CategoryList);
