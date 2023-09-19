import React, { useState, useEffect } from "react";
import AdminCardProduct from "../card/AdminCardProduct";
import DefaultPagination from "../../Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import AsyncSelect from "react-select/async";
import debounce from "lodash/debounce";
import axios from "../../../api/axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const debouncedNavigate = debounce((updatedParams) => {
    for (const key in updatedParams) {
      searchParams.set(key, updatedParams[key]);
    }
    navigate({ search: searchParams.toString() });
  }, 150);

  const loadCategories = async (inputValue = "") => {
    try {
      const response = await axios.get("/admin/categories", {
        params: {
          name: inputValue,
        },
      });

      if (response.data.success) {
        return [
          { value: "", label: "All Categories" },
          ...response.data.data.map((cat) => ({
            value: cat.id,
            label: cat.name,
          })),
        ];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching categories for select:", error);
      return [];
    }
  };

  const fetchProducts = async (
    page = 1,
    productName = search,
    category = selectedCategory
  ) => {
    try {
      const response = await axios.get("/admin/products", {
        params: {
          category_id: category,
          product_name: productName,
          page: page,
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
    fetchProducts(currentPage, search, selectedCategory);
  }, [currentPage, search, selectedCategory]);

  useEffect(() => {
    const pageFromUrl = searchParams.get("page") || 1;
    const productNameFromUrl = searchParams.get("product_name") || "";
    const categoryIdFromUrl = searchParams.get("category_id") || "";
    setSearch(productNameFromUrl);
    setSelectedCategory(categoryIdFromUrl);
    setCurrentPage(Number(pageFromUrl));
    fetchProducts(Number(pageFromUrl), productNameFromUrl, categoryIdFromUrl);
  }, [searchParams.toString()]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedNavigate({ product_name: e.target.value });
  };

  const handleCategoryChange = (selectedOption) => {
    const selectedCategoryId = selectedOption ? selectedOption.value : "";
    setSelectedCategory(selectedCategoryId);
    debouncedNavigate({ category_id: selectedCategoryId });
  };

  return (
    <div className="h-full lg:h-screen lg:w-full lg:grid">
      <div className="px-8 pt-1">
        <div className="flex  relative mb-5">
          <input
            type="text"
            placeholder="Search Product"
            className="flex-1 p-2 border rounded text-base bg-white border-gray-300 shadow-sm mr-4"
            value={search}
            onChange={handleSearchChange}
          />
          <AsyncSelect
            className="flex-1 z-10"
            cacheOptions
            defaultOptions
            loadOptions={loadCategories}
            onChange={handleCategoryChange}
            placeholder="Select a category"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3 z-0">
          {products.map((product) => (
            <AdminCardProduct
              key={product.id}
              src={`${process.env.REACT_APP_API_BASE_URL}${product.Image_products[0]?.img_product}`}
              category={product.category.name}
              name={product.name}
              price={product.price}
              isActive={product.is_active}
              onEdit={() => console.log("Edit product:", product.name)}
              onDelete={() => console.log("Delete product:", product.name)}
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
        <div className="flex justify-center items-center w-full bottom-0 position-absolute">
          <DefaultPagination
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              searchParams.set("page", page);
              navigate({ search: searchParams.toString() });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
