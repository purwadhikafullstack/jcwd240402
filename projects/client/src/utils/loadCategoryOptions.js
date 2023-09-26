import axios from "../api/axios";

export const useCategoryOptions = () => {
  const loadCategories = async (inputValue) => {
    try {
      const response = await axios.get(`/admin/categories`, {
        params: {
          name: inputValue,
        },
      });
      const categoryOptions = [
        { value: "", label: "All Categories" },
        ...response.data.data.map((category) => ({
          value: category.id,
          label: category.name,
        })),
      ];
      return categoryOptions;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  };

  return loadCategories;
};
