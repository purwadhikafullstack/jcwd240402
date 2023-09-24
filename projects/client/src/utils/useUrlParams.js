import { useSearchParams } from "react-router-dom";

function useURLParams(defaultValues = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = (key, defaultValue) => {
    const paramValue = searchParams.get(key);
    if (paramValue === null) return defaultValue;
    if (typeof defaultValue === "number") {
      return parseInt(paramValue, 10);
    }
    return paramValue;
  };

  const setParam = (key, value) => {
    console.log(`Setting param: key=${key}, value=${JSON.stringify(value)}`);
    if (key === 'status' && value === undefined) {
      console.trace('status set to undefined');
    }
    const actualValue = value && typeof value === "object" && value.value ? value.value : value;
    if (actualValue !== undefined && actualValue !== null && actualValue !== "") {
      searchParams.set(key, String(actualValue));
      console.log(`Set param: key=${key}, value=${String(actualValue)}`);
    } else if (actualValue === "") {
      searchParams.set(key, "");
      console.log(`Set empty param: key=${key}`);
    } else {
      searchParams.delete(key);
      console.log(`Deleted param: key=${key}`);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const syncStateWithParams = (key, defaultValue) => {
    const value = getParam(key, defaultValue);
    if (key === "warehouse" || key === "category" || key === "status") {
      return { value, label: value };
    }
    return value;
  };

  return { getParam, setParam, syncStateWithParams};
}

export default useURLParams;

