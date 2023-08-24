import { Badge } from "flowbite-react";
import React from "react";

const BadgeTag = ({ msg, color }) => {
  return (
    <>
      <Badge color={color} className="w-fit text-xs">
        {msg}
      </Badge>
    </>
  );
};

export default BadgeTag;
