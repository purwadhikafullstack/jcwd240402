import { useSearchParams } from "react-router-dom";

function useURLParams(defaultValues = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key, defaultValue) => {
    return searchParams.get(key) || defaultValue;
  };

  const setParam = (key, value) => {
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const syncStateWithParams = (key, defaultValue) => {
    const value = getParam(key, defaultValue);
    if (typeof defaultValue === "number") {
      return parseInt(value, 10);
    }
    return value;
  };

  return { getParam, setParam, syncStateWithParams };
}

export default useURLParams; 