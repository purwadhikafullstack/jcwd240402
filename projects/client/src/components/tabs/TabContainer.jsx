import React from "react";
import Tab from "./TabComponent";
import { useLocation } from "react-router-dom";

const Tabs = ({ tabData }) => {
  const location = useLocation();

  return (
    <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap -mb-px">
        {tabData.map((tab) => (
          <Tab key={tab.label} {...tab} isActive={tab.to === location.pathname} />
        ))}
      </ul>
    </div>
  );
};

export default Tabs;
