import React, { useState } from "react";
import { Label } from "flowbite-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({
  errorMessage,
  width,
  value,
  onChange,
  name,
  placeholder = "password",
  label = "password",
}) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const isError = Boolean(errorMessage);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`${width}`}>
      <div className="block">
        <Label htmlFor="Password" value={label} />
      </div>
      <div className="relative">
        <div className="relative">
          <input
            type={isPasswordVisible ? "text" : "password"}
            id={isError ? "error" : "password"}
            className={`block w-full p-2.5 text-sm rounded-lg ${
              isError
                ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500"
                : "rounded-lg bg-gray-50"
            }`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            name={name}
          />
          <button
            onClick={togglePasswordVisibility}
            className="absolute right-2.5 bottom-3.5 rounded-lg text-lg"
            type="button"
          >
            {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        {isError && <div className="text-red-500 text-sm mt-1">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default PasswordInput;
