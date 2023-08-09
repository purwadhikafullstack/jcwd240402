import React, { useState } from "react";
import { Label } from "flowbite-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ isError = false, width }) => {
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`${width}`}>
      <div className="block">
        <Label htmlFor="password" value="password" />
      </div>

      <div className="relative">
        <input
          type={isPasswordVisible ? "text" : "password"}
          id={isError ? "error" : "password"}
          className={`block w-full p-2.5 text-sm rounded-lg ${
            isError
              ? "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 dark:bg-gray-700 focus:border-red-500"
              : "border-gray-300 rounded-lg bg-gray-50"
          }`}
          placeholder="password"
          required
        />
        <button
          onClick={togglePasswordVisibility}
          className="absolute right-2.5 bottom-3.5 rounded-lg text-lg"
        >
          {isPasswordVisible ? <FaEye /> : <FaEyeSlash />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
