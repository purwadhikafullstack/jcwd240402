import React from "react";
import { Link } from "react-router-dom";

const Tab = ({ label, isActive, to }) => {
  const baseClasses = "inline-block p-4 cursor-pointer mr-2 transition-all";
  const activeClasses = isActive
    ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500 hover:text-blue-500"
    : "border-b-2 border-transparent text-gray-500 hover:text-gray-600 dark:hover:text-gray-300";

  return (
    <li className="mr-2">
      <Link to={to} className={`${baseClasses} ${activeClasses}`}>
        {label}
      </Link>
    </li>
  );
};

export default Tab;
