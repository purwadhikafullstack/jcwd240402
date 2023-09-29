import React from "react";
import { Link } from "react-router-dom";

const ButtonLink = ({
  buttonSize,
  buttonText = "Edit Button",
  onClick,
  bgColor,
  colorText,
  fontWeight,
  type = "button",
  to,
}) => {
  let sizeClasses;

  switch (buttonSize) {
    case "small":
      sizeClasses = "px-2 py-1 text-xs w-24 h-8 rounded-lg ";
      break;
    case "medium":
      sizeClasses = "px-4 py-2 text-sm w-32 h-10 rounded-lg";
      break;
    case "large":
      sizeClasses = "px-6 py-3 text-lg w-40 h-12 rounded-lg";
      break;
    default:
      sizeClasses = "px-4 py-2 text-sm w-32 h-10 rounded-lg";
      break;
  }

  return (
    <>
      <Link
        className={`${bgColor} ${fontWeight} flex flex-col justify-center items-center text-center ${colorText} rounded-lg hover:border-black hover:border-2 transition duration-200 ${sizeClasses}`}
        to={to}
      >
        {buttonText}
      </Link>
    </>
  );
};

export default ButtonLink;
