import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "../../api/axios";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import AsyncSelect from "react-select/async";
import RegisterCategoryModal from "../../components/modal/category/ModalRegisterCategory";
import Button from "../../components/Button";
import AdminCategoryCard from "../../components/admin/card/AdminCardCategory";
import withAuthAdminWarehouse from "../../components/admin/withAuthAdminWarehouse";
import { useSelector } from "react-redux";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchName, setSearchName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const adminData = useSelector((state) => state.profilerAdmin.value);
  
    useEffect(() => {
      fetchCategories();
    }, [currentPage, searchName]);
  
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



  const loadCategories = async (inputValue = "") => {
    try {
      const response = await axios.get(`/admin/categories`, {
        params: {
          name: inputValue,
        },
      });

      if (response.data.success) {
        const formattedCategories = [
          { value: "", label: "All Categories" },
          ...response.data.data.map((category) => ({
            value: category.name,
            label: category.name,
          })),
        ];
        return formattedCategories;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching category names:", error);
      return [];
    }
  };

  const handleSuccessfulEdit = () => {
    fetchCategories();
  };

  const handleRegisterSuccess = () => {
    fetchCategories();
  };

  const handleCategoryChange = (selectedOption) => {
    const selectedName = selectedOption ? selectedOption.value : "";
    setSearchName(selectedName);
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid lg:grid-cols-[auto,1fr]">
      <div className="lg:flex lg:flex-col lg:justify-start">
        <Sidebar />
      </div>
      <div className="px-8 pt-8">
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <AsyncSelect
              className="w-full"
              cacheOptions
              defaultOptions
              loadOptions={loadCategories}
              onChange={handleCategoryChange}
              placeholder="Category Name"
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
  );
};

export default withAuthAdminWarehouse(CategoryList);
