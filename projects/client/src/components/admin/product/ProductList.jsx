import React, { useState, useEffect } from "react";
import AdminCardProduct from "../card/AdminCardProduct";
import DefaultPagination from "../../Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import axios from "../../../api/axios";
import ConfirmDeleteProduct from "../../modal/product/ModalDeleteProduct";
import withAuthAdminWarehouse from "../../admin/withAuthAdminWarehouse";
import { useCategoryOptions } from "../../../utils/loadCategoryOptions";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const loadCategories = useCategoryOptions();

  const navigateWithParams = (updatedParams) => {
    for (const key in updatedParams) {
      searchParams.set(key, updatedParams[key]);
    }
    navigate({ search: searchParams.toString() });
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/admin/products", {
        params: {
          category_id: selectedCategory,
          product_name: search,
          page: currentPage,
        },
      });
      setProducts(response.data.data);
      const { totalPages } = response.data.pagination;
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, selectedCategory]);

  useEffect(() => {
    const pageFromUrl = searchParams.get("page") || 1;
    const productNameFromUrl = searchParams.get("product_name") || "";
    const categoryIdFromUrl = searchParams.get("category_id") || "";
    setSearch(productNameFromUrl);
    setSelectedCategory(categoryIdFromUrl);
    setCurrentPage(Number(pageFromUrl));
  }, [searchParams.toString()]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
    navigateWithParams({ product_name: e.target.value, page: 1 });
  };

  const handleCategoryChange = (selectedOption) => {
    const selectedCategoryId = selectedOption ? selectedOption.value : "";
    setSelectedCategory(selectedCategoryId);
    setCurrentPage(1);
    navigateWithParams({ category_id: selectedCategoryId, page: 1 });
  };

  const handleShowDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleSuccessfulDelete = () => {
    fetchProducts();
  };

  return (
    <div className="h-full w-full lg:h-screen lg:w-full lg:grid">
      <div className="px-4 mr-8 lg:mr-0 lg:px-8 pt-1">
        <div className="flex relative mb-5">
          <input
            type="text"
            placeholder="Search Product"
            className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mr-4"
            value={search}
            onChange={handleSearchChange}
          />
          <AsyncSelect
            className="flex-1 relative z-50"
            cacheOptions
            defaultOptions
            loadOptions={loadCategories}
            onChange={handleCategoryChange}
            placeholder="Select a category"
            menuPortalTarget={document.body}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
          {products.map((product) => (
            <AdminCardProduct
              key={product.id}
              product={product}
              onDelete={() => handleShowDeleteModal(product)}
              setActive={(value) => {
                const index = products.findIndex((p) => p.id === product.id);
                if (index !== -1) {
                  const updatedProducts = [...products];
                  updatedProducts[index].is_active = value;
                  setProducts(updatedProducts);
                }
              }}
            />
          ))}
        </div>
        {showDeleteModal && (
          <ConfirmDeleteProduct
            show={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            handleSuccessfulDelete={handleSuccessfulDelete}
            productId={productToDelete ? productToDelete.id : null}
            productName={productToDelete ? productToDelete.name : null}
          />
        )}
        <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              navigateWithParams({ page });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuthAdminWarehouse(ProductList);
