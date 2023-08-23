import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/SidebarAdminDesktop";
import DefaultPagination from "../../components/Pagination";
import AsyncSelect from "react-select/async";
import moment from "moment";
import RegisterCategoryModal from "../../components/Modals/category/ModalRegisterCategory";
import Button from "../../components/Button";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [currentPage, searchName]);

  const onSuccessfulRegister = () => {
    fetchCategories();
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/categories`,
        {
          params: {
            page: currentPage,
            name: searchName,
          },
        }
      );

      if (response.data.success) {
        setCategories(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

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
              onChange={(selectedOption) =>
                setSearchName(selectedOption ? selectedOption.value : "")
              }
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
        <div className="flex justify-end px-8 py-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border rounded shadow-sm">
              <img
                src={`http://localhost:8000${category.category_img}`}
                alt={category.name}
                className="w-full h-48 object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{category.name}</h3>
              <p className="text-sm text-gray-500">
                Created: {moment(category.createdAt).format("MMMM D, YYYY")}
              </p>
            </div>
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
          onSuccessfulRegister={onSuccessfulRegister}
        />
      </div>
    </div>
  );
};

export default CategoryList;
