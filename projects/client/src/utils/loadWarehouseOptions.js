import axios from "../api/axios";

export const useWarehouseOptions = () => {
  const loadWarehouseOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/warehouse/warehouse-list?searchName=${inputValue}`
      );
      const warehouseOptions = [
        { value: "", label: "All Warehouses" },
        ...response.data.warehouses.map((warehouse) => ({
          value: warehouse.id,
          label: warehouse.warehouse_name,
        })),
      ];
      return warehouseOptions;
    } catch (error) {
      console.error("Error loading warehouses:", error);
      return [];
    }
  };

  return loadWarehouseOptions;
};
