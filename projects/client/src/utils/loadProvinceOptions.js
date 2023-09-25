import axios from "../api/axios";

export const useProvinceOptions = () => {
    const loadProvinceOptions = async (inputValue) => {
      try {
        const response = await axios.get(
          `/admin/province/?searchName=${inputValue}&page=1`
        );
        const provinceOptions = response.data.provinces.map((province) => ({
          value: province.id,
          label: province.name,
        }));
        return provinceOptions;
      } catch (error) {
        console.error("Error loading provinces:", error);
        return [];
      }
    };
  
    return loadProvinceOptions;
  };