import { useSearchParams } from "react-router-dom";
import { useWarehouseOptions } from "../utils/loadWarehouseOptions";

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
    if (key === "status" && value === undefined) {
      console.trace("status set to undefined");
    }
    const actualValue =
      value && typeof value === "object" && value.value ? value.value : value;
    if (
      actualValue !== undefined &&
      actualValue !== null &&
      actualValue !== ""
    ) {
      searchParams.set(key, String(actualValue));
    } else if (actualValue === "") {
      searchParams.set(key, "");
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const syncStateWithParams = (key, defaultValue) => {
    const value = getParam(key, defaultValue);
    if (key === "warehouse" || key === "category") {
      return { value, label: value };
    }

    if (key === "status") {
      const statusLabels = {
        "": "All Status",
        approve: "Approved",
        reject: "Rejected",
        pending: "Pending",
      };
      return { value, label: statusLabels[value] };
    }

    return value;
  };

  return { getParam, setParam, syncStateWithParams };
}

export default useURLParams;
