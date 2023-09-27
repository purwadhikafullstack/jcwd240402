import React from "react";
import AsyncSelect from "react-select/async";

const SearchDropdown = ({ loadOptions, onChange, value, placeholder }) => {
  return (
    <div className="w-56 ">
      <AsyncSelect
        value={value}
        onChange={onChange}
        loadOptions={loadOptions}
        placeholder={placeholder || "Select..."}
        className="relative z-50"
      />
    </div>
  );
};

export default SearchDropdown;
