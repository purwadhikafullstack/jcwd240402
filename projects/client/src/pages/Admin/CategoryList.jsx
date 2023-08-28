import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import AsyncSelect from "react-select/async";
import RegisterCategoryModal from "../../components/Modals/category/ModalRegisterCategory";
import Button from "../../components/Button";
import AdminCategoryCard from "../../components/admin/card/AdminCardCategory";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const searchNameRef = useRef("");
  const [showModal, setShowModal] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/categories`,
        {
          params: {
            page: currentPage,
            name: searchNameRef.current,
          },
        }
      );

      if (response.data.success) {
        setCategories(response.data.data);
        const { page, pageSize, totalItems, totalPages } =
          response.data.pagination;
        setTotalPages(totalPages);
        if ((page - 1) * pageSize + response.data.data.length > totalItems) {
          setCurrentPage(Math.max(1, totalPages));
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [currentPage, searchName]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const loadCategories = async (inputValue, callback) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/categories`,
        {
          params: {
            name: inputValue,
          },
        }
      );
      if (response.data.success) {
        const formattedCategories = response.data.data.map((category) => ({
          value: category.name,
          label: category.name,
        }));

        formattedCategories.unshift({ value: "", label: "All Categories" });

        callback(formattedCategories);
      }
    } catch (error) {
      console.error("Error fetching category names:", error);
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
      <div className="px-8 pt-8">
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <AsyncSelect
              className="w-full"
              cacheOptions
              defaultOptions
              loadOptions={loadCategories}
              onChange={(selectedOption) => {
                const selectedName = selectedOption ? selectedOption.value : "";
                setSearchName(selectedName);
                searchNameRef.current = selectedName;
              }}
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
        <div className="flex justify-center items-center w-full mt-8">
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

export default CategoryList;
