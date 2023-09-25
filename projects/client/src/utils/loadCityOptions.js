import axios from "../api/axios";

export const useCityOptions = () => {
  const loadCityOptions = async (inputValue) => {
    try {
      const response = await axios.get(
        `/admin/city/?searchName=${inputValue}&page=1`
      );
      const cityOptions = response.data.cities.map((city) => ({
        value: city.id,
        label: city.name,
      }));
      return cityOptions;
    } catch (error) {
      console.error("Error loading cities:", error);
      return [];
    }
  };

  return loadCityOptions;
};